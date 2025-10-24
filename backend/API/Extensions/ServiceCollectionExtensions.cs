using System;
using System.Reflection;
using Application.Common.Configuration;
using Application.Common.Validation;
using Application.Interfaces;
using Infrastructure.Configuration;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using FluentValidation;
using FluentValidation.AspNetCore;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Routing;

namespace API.Extensions;

/// <summary>
/// Extension methods for configuring services in the DI container
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds application services to the DI container
    /// </summary>
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Add AutoMapper
        services.AddAutoMapper(typeof(Application.Common.Mappings.GameProfile));

        // Add FluentValidation
        services.AddFluentValidationAutoValidation();
        services.AddFluentValidationClientsideAdapters();
        services.AddValidatorsFromAssemblyContaining<CreateGameDtoValidator>();

        return services;
    }

    /// <summary>
    /// Adds infrastructure services to the DI container
    /// </summary>
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Add strongly-typed configuration
        services.Configure<AppSettings>(configuration);

        // Add DbContext
        services.AddDbContext<AppDbContext>(options => 
            options.UseNpgsql(SecretsConfiguration.BuildConnectionString()));

        // Add Redis distributed cache
        services.AddStackExchangeRedisCache(options =>
        {
            var redisConnectionString = SecretsConfiguration.GetRequiredSecret("REDIS_CONNECTION_STRING", "Redis connection string");
            options.Configuration = redisConnectionString;
        });

        // Register Redis services
        services.AddScoped<IRedisCacheService, RedisCacheService>();
        services.AddScoped<IRedisVerificationCodeService, RedisVerificationCodeService>();

        // Add Identity
        services.AddIdentity<User, IdentityRole<Guid>>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

        // Register repositories
        services.AddScoped<IWalletRepository, WalletRepository>();
        services.AddScoped<ILibraryRepository, LibraryRepository>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddScoped<IFriendRequestRepository, FriendRequestRepository>();
        services.AddScoped<IFriendshipRepository, FriendshipRepository>();
        services.AddScoped<IUserBlockRepository, UserBlockRepository>();
        services.AddScoped<IReviewRepository, ReviewRepository>();
        services.AddScoped<IReviewLikeRepository, ReviewLikeRepository>();
        services.AddScoped<IProfileCommentRepository, ProfileCommentRepository>();
        services.AddScoped<IBadgeRepository, BadgeRepository>();

        // Register application services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IGameService, GameService>();
        services.AddScoped<ILibraryService, LibraryService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IPurchaseService, PurchaseService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IWalletService, WalletService>();
        services.AddScoped<IFriendshipService, FriendshipService>();
        services.AddScoped<IUserBlockService, UserBlockService>();
        services.AddScoped<ICommunityService, CommunityService>();
        services.AddScoped<IStorageService, StorageService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<IWishlistService, WishlistService>();
        services.AddScoped<IProfileCommentService, ProfileCommentService>();
        services.AddScoped<IBadgeService, BadgeService>();

        return services;
    }

    /// <summary>
    /// Adds API services to the DI container
    /// </summary>
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Add Memory Cache
        services.AddMemoryCache();

        // Add BaseUrl configuration
        services.Configure<RouteOptions>(options => options.LowercaseUrls = true);
        var baseUrl = SecretsConfiguration.GetOptionalSecret("BASE_URL", "https://localhost:5088");
        services.AddHttpContextAccessor();

        // Add HttpClient
        services.AddHttpClient();

        return services;
    }
}
