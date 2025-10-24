using System;
using System.IO;
using System.Reflection;
using Application.Interfaces;
using Microsoft.OpenApi.Models;
using Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Infrastructure.Configuration;
using API.Middleware;
using API.Helpers;
using API.Extensions;
using DotNetEnv;
using FluentValidation;
using FluentValidation.AspNetCore;

// Load environment variables from .env file if it exists
var currentDir = Directory.GetCurrentDirectory();
var envPath = Path.Combine(currentDir, ".env");

if (!File.Exists(envPath))
{
    // Try parent directory (backend root)
    var parentDir = Directory.GetParent(currentDir)?.FullName ?? "";
    envPath = Path.Combine(parentDir, ".env");
}

if (File.Exists(envPath))
{
    Env.Load(envPath);
}

// Validate that all required secrets are present
SecretsConfiguration.ValidateRequiredSecrets();

var builder = WebApplication.CreateBuilder(args);

// Add services using extension methods
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApiServices(builder.Configuration);

// JWT
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = SecretsConfiguration.GetRequiredSecret("JWT_ISSUER", "JWT issuer"),
            ValidAudience = SecretsConfiguration.GetRequiredSecret("JWT_AUDIENCE", "JWT audience"),
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(SecretsConfiguration.GetRequiredSecret("JWT_KEY", "JWT signing key")))
        };
    });

builder.Services.AddAuthorization();

// TODO: Register AWS S3 client for R2 when packages are available
// SWAGGER
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Slush API",
        Version = "v1",
        Description = "API Documentation for Slush"
    });
    
    options.UseInlineDefinitionsForEnums();

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' followed by a space and your JWT token (e.g., 'Bearer eyJ...'). Obtain token from /api/auth/login.",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

    // Add support for file uploads
    options.MapType<IFormFile>(() => new OpenApiSchema
    {
        Type = "string",
        Format = "binary"
    });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

// CORS SETTING
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",  // Vite dev server
                "http://localhost:3000",  // Alternative dev port
                "https://localhost:5173",
                "https://localhost:3000"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .SetPreflightMaxAge(TimeSpan.FromSeconds(2520));
    });
});

builder.Services.AddControllers();
builder.Services.AddHttpClient();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseCors("AllowFrontend");

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<OnlineStatusMiddleware>();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();