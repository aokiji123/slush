using System;
using System.Collections.Generic;
using Domain.Entities;

namespace Application.DTOs;

public class GameDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string MainImage { get; set; } = string.Empty;
    public List<string> Images { get; set; } = new();
    public double Price { get; set; }
    public int DiscountPercent { get; set; }
    public double SalePrice { get; set; }
    public DateTime? SaleDate { get; set; }
    public double Rating { get; set; }
    public List<string> Genre { get; set; } = new();
    public string Description { get; set; } = string.Empty;
    public DateTime ReleaseDate { get; set; }
    public string Developer { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public List<string> Platforms { get; set; } = new();
    public bool IsDlc { get; set; }
    public Guid? BaseGameId { get; set; }

    /// <summary>
    /// Creates a GameDto from a Game entity with localized content
    /// </summary>
    /// <param name="game">Game entity to convert</param>
    /// <param name="language">Target language for localization (default: "uk")</param>
    /// <returns>Localized GameDto or null if game is null</returns>
    public static GameDto? FromEntity(Game game, string language = "uk")
    {
        if (game == null)
            return null;

        return new GameDto
        {
            Id = game.Id,
            Name = game.GetLocalizedName(language),
            Slug = game.Slug,
            MainImage = game.MainImage,
            Images = game.Images,
            Price = (double)game.Price,
            DiscountPercent = game.DiscountPercent,
            SalePrice = (double)game.SalePrice,
            SaleDate = game.SaleDate,
            Rating = game.Rating,
            Genre = game.GetLocalizedGenres(language),
            Description = game.GetLocalizedDescription(language),
            ReleaseDate = game.ReleaseDate,
            Developer = game.GetLocalizedDeveloper(language),
            Publisher = game.GetLocalizedPublisher(language),
            Platforms = game.Platforms,
            IsDlc = game.IsDlc,
            BaseGameId = game.BaseGameId
        };
    }
}