using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Domain.Extensions;

namespace Domain.Entities;

public class Game
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [Column(TypeName = "jsonb")]
    public string NameTranslations { get; set; } = "{}";

    [Required]
    [Column(TypeName = "jsonb")]
    public string DescriptionTranslations { get; set; } = "{}";

    [Required]
    [Column(TypeName = "jsonb")]
    public string DeveloperTranslations { get; set; } = "{}";

    [Required]
    [Column(TypeName = "jsonb")]
    public string PublisherTranslations { get; set; } = "{}";

    [Required]
    [Column(TypeName = "jsonb")]
    public string GenreTranslations { get; set; } = "{}";

    [Required]
    public string Slug { get; set; } = string.Empty;

    // Backward compatibility properties - these will be populated from translations
    [NotMapped]
    public string Name
    {
        get => NameTranslations.GetTranslation("uk");
        set => NameTranslations = NameTranslations.SetTranslation("uk", value);
    }

    [NotMapped]
    public string Title
    {
        get => Name;
        set => Name = value;
    }

    [NotMapped]
    public string Description
    {
        get => DescriptionTranslations.GetTranslation("uk");
        set => DescriptionTranslations = DescriptionTranslations.SetTranslation("uk", value);
    }

    [Required]
    [Range(0, 100000)]
    public decimal Price { get; set; }

    [MaxLength(500)]
    public string MainImage { get; set; } = string.Empty;

    public List<string> Images { get; set; } = new();

    [Range(0, 100)]
    public int DiscountPercent { get; set; }

    [Range(0, 100000)]
    public decimal SalePrice { get; set; }

    public DateTime? SaleDate { get; set; }

    [Range(0, 5)]
    public double Rating { get; set; }

    public DateTime ReleaseDate { get; set; }

    public List<string> Platforms { get; set; } = new();

    // Backward compatibility properties for Developer, Publisher, and Genre
    [NotMapped]
    public string Developer
    {
        get => DeveloperTranslations.GetTranslation("uk");
        set => DeveloperTranslations = DeveloperTranslations.SetTranslation("uk", value);
    }

    [NotMapped]
    public string Publisher
    {
        get => PublisherTranslations.GetTranslation("uk");
        set => PublisherTranslations = PublisherTranslations.SetTranslation("uk", value);
    }

    [NotMapped]
    public List<string> Genre
    {
        get => GenreTranslations.GetTranslationArray("uk");
        set => GenreTranslations = GenreTranslations.SetTranslationArray("uk", value);
    }

    public bool IsDlc { get; set; }

    public Guid? BaseGameId { get; set; }

    public List<Review> Reviews { get; set; } = new();

    public List<GameCharacteristic> GameCharacteristics { get; set; } = new();
    
    // Backward compatibility property
    [NotMapped]
    public GameCharacteristic? GameCharacteristic
    {
        get => GameCharacteristics.FirstOrDefault();
        set
        {
            if (value != null)
            {
                if (GameCharacteristics.Count == 0)
                {
                    GameCharacteristics.Add(value);
                }
                else
                {
                    GameCharacteristics[0] = value;
                }
            }
        }
    }
    
    public List<GameConsoleFeature> ConsoleFeatures { get; set; } = new();

    // Helper methods for getting localized data
    public string GetLocalizedName(string language = "uk")
    {
        return NameTranslations.GetTranslation(language);
    }

    public string GetLocalizedDescription(string language = "uk")
    {
        return DescriptionTranslations.GetTranslation(language);
    }

    public string GetLocalizedDeveloper(string language = "uk")
    {
        return DeveloperTranslations.GetTranslation(language);
    }

    public string GetLocalizedPublisher(string language = "uk")
    {
        return PublisherTranslations.GetTranslation(language);
    }

    public List<string> GetLocalizedGenres(string language = "uk")
    {
        return GenreTranslations.GetTranslationArray(language);
    }
}