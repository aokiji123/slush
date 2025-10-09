using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using Application.Common.Query;
using Domain.Entities;

namespace Application.Common.Query;

public static class QueryableExtensions
{
    // Pagination
    public static IQueryable<T> ApplyPagination<T>(this IQueryable<T> query, QueryParameters parameters)
    {
        var (skip, take) = parameters.Normalize();
        return query.Skip(skip).Take(take);
    }

    // Search (single field overload to satisfy the required signature)
    public static IQueryable<T> ApplySearch<T>(this IQueryable<T> query, QueryParameters parameters, Expression<Func<T, string>> field)
    {
        return query.ApplySearch(parameters, new[] { field });
    }

    // Search across multiple string fields
    public static IQueryable<T> ApplySearch<T>(this IQueryable<T> query, QueryParameters parameters, params Expression<Func<T, string>>[] fields)
    {
        if (string.IsNullOrWhiteSpace(parameters.Search) || fields == null || fields.Length == 0)
            return query;

        var searchLower = parameters.Search.Trim().ToLowerInvariant();
        var param = Expression.Parameter(typeof(T), "x");

        Expression? combined = null;
        foreach (var field in fields)
        {
            // Replace parameter in field expression with our param
            var replaced = new ReplaceParameterVisitor(field.Parameters[0], param).Visit(field.Body)!;
            var notNull = Expression.NotEqual(replaced, Expression.Constant(null, typeof(string)));
            var toLower = Expression.Call(replaced, typeof(string).GetMethod("ToLower", Type.EmptyTypes)!);
            var contains = Expression.Call(toLower, typeof(string).GetMethod("Contains", new[] { typeof(string) })!, Expression.Constant(searchLower));
            var safeContains = Expression.AndAlso(notNull, contains);
            combined = combined == null ? safeContains : Expression.OrElse(combined, safeContains);
        }

        var lambda = Expression.Lambda<Func<T, bool>>(combined!, param);
        return query.Where(lambda);
    }

    // Generic sorting by property names (fallback)
    public static IQueryable<T> ApplySorting<T>(this IQueryable<T> query, QueryParameters parameters)
    {
        return ApplySortingByProperties(query, parameters);
    }

    // Typed sorting for Game with domain-specific keys
    public static IQueryable<Game> ApplySorting(this IQueryable<Game> query, QueryParameters parameters)
    {
        var sort = parameters.SortBy?.Trim();
        var dir = parameters.SortDirection?.Trim();
        var normalized = string.IsNullOrWhiteSpace(sort) ? "relevancy" : sort.ToLowerInvariant();
        var dirNormalized = string.IsNullOrWhiteSpace(dir) ? null : dir.ToLowerInvariant();

        // Support inline "field:dir"
        string field = normalized;
        string? inlineDir = null;
        var parts = normalized.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        if (parts.Length == 1)
        {
            var p = parts[0];
            var pair = p.Split(':', StringSplitOptions.TrimEntries);
            if (pair.Length == 2)
            {
                field = pair[0];
                inlineDir = pair[1];
            }
        }

        string effectiveDir = inlineDir ?? dirNormalized ?? string.Empty;

        // Synonyms mapping
        switch (field)
        {
            case "relevancy":
                return query.OrderByDescending(g => g.Rating).ThenBy(g => g.Name);
            case "alphabet":
            case "name":
                return query.OrderBy(g => g.Name);
            case "rating":
                return query.OrderByDescending(g => g.Rating);
            case "publish_date":
            case "release_date":
            case "releasedate":
                return query.OrderByDescending(g => g.ReleaseDate);
            case "discount":
            case "discountpercent":
                return query.OrderByDescending(g => g.DiscountPercent).ThenBy(g => g.Price);
            case "price_asc":
                return query.OrderBy(g => g.Price);
            case "price_desc":
                return query.OrderByDescending(g => g.Price);
            case "price":
                return string.Equals(effectiveDir, "desc", StringComparison.OrdinalIgnoreCase)
                    ? query.OrderByDescending(g => g.Price)
                    : query.OrderBy(g => g.Price);
            default:
                // Fallback to generic property-based sorting (supports multi-level spec)
                return ApplySortingByProperties(query, parameters);
        }
    }

    // Internal: property-based multi-level sorting using expressions/reflection
    private static IQueryable<T> ApplySortingByProperties<T>(IQueryable<T> source, QueryParameters parameters)
    {
        if (string.IsNullOrWhiteSpace(parameters.SortBy))
            return source;

        var specs = ParseSortSpecs(parameters);
        bool first = true;
        foreach (var (prop, desc) in specs)
        {
            var param = Expression.Parameter(typeof(T), "x");
            Expression body;
            try
            {
                body = Expression.PropertyOrField(param, prop);
            }
            catch
            {
                // Property not found -> skip
                continue;
            }

            var keyType = body.Type;
            var lambda = Expression.Lambda(body, param);

            string methodName;
            if (first)
            {
                methodName = desc ? nameof(Queryable.OrderByDescending) : nameof(Queryable.OrderBy);
                first = false;
            }
            else
            {
                methodName = desc ? nameof(Queryable.ThenByDescending) : nameof(Queryable.ThenBy);
            }

            var method = GetQueryableMethod(methodName, typeof(T), keyType);
            var call = Expression.Call(method, source.Expression, Expression.Quote(lambda));
            source = source.Provider.CreateQuery<T>(call);
        }
        return source;
    }

    private static MethodInfo GetQueryableMethod(string name, Type tSource, Type tKey)
    {
        var methods = typeof(Queryable).GetMethods()
            .Where(m => m.Name == name && m.GetParameters().Length == 2)
            .ToList();
        foreach (var m in methods)
        {
            var generic = m.MakeGenericMethod(tSource, tKey);
            return generic;
        }
        throw new InvalidOperationException($"Queryable method {name} not found");
    }

    private static List<(string prop, bool desc)> ParseSortSpecs(QueryParameters parameters)
    {
        var specs = new List<(string prop, bool desc)>();
        var sort = parameters.SortBy ?? string.Empty;
        var entries = sort.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        foreach (var e in entries)
        {
            var token = e.Trim();
            string propertyToken = token;
            string? dir = null;

            var colonIndex = token.IndexOf(':');
            if (colonIndex >= 0)
            {
                propertyToken = token[..colonIndex];
                dir = token[(colonIndex + 1)..];
            }

            bool desc = string.Equals(dir, "desc", StringComparison.OrdinalIgnoreCase);

            if (dir == null)
            {
                if (propertyToken.EndsWith("_desc", StringComparison.OrdinalIgnoreCase))
                {
                    propertyToken = propertyToken[..^5];
                    desc = true;
                }
                else if (propertyToken.EndsWith("_asc", StringComparison.OrdinalIgnoreCase))
                {
                    propertyToken = propertyToken[..^4];
                    desc = false;
                }
                else if (entries.Length == 1 && !string.IsNullOrWhiteSpace(parameters.SortDirection))
                {
                    desc = string.Equals(parameters.SortDirection, "desc", StringComparison.OrdinalIgnoreCase);
                }
            }

            specs.Add((NormalizePropName(propertyToken), desc));
        }
        return specs;
    }

    private static string NormalizePropName(string prop)
    {
        // Convert common snake_case to PascalCase-ish to match property names
        if (string.IsNullOrWhiteSpace(prop)) return prop;
        if (!prop.Contains('_')) return prop;
        var parts = prop.Split('_', StringSplitOptions.RemoveEmptyEntries);
        return string.Concat(parts.Select(p => char.ToUpperInvariant(p[0]) + (p.Length > 1 ? p.Substring(1) : string.Empty)));
    }

    private sealed class ReplaceParameterVisitor : ExpressionVisitor
    {
        private readonly ParameterExpression _source;
        private readonly ParameterExpression _target;

        public ReplaceParameterVisitor(ParameterExpression source, ParameterExpression target)
        {
            _source = source;
            _target = target;
        }

        protected override Expression VisitParameter(ParameterExpression node)
        {
            return node == _source ? _target : base.VisitParameter(node);
        }
    }
}
