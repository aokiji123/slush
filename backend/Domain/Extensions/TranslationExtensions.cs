using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace Domain.Extensions;

/// <summary>
/// Extension methods for handling JSON-based translations
/// </summary>
public static class TranslationExtensions
{
    /// <summary>
    /// Gets a translation from JSON string for the specified language with fallback to Ukrainian
    /// </summary>
    /// <param name="jsonTranslations">JSON string containing translations</param>
    /// <param name="language">Target language code (e.g., "en", "uk")</param>
    /// <returns>Translated text or empty string if not found</returns>
    public static string GetTranslation(this string jsonTranslations, string language)
    {
        if (string.IsNullOrWhiteSpace(jsonTranslations))
            return string.Empty;

        try
        {
            var translations = JsonSerializer.Deserialize<Dictionary<string, string>>(jsonTranslations);
            
            if (translations == null)
                return string.Empty;

            // Try requested language first
            if (translations.TryGetValue(language, out var translation) && !string.IsNullOrEmpty(translation))
                return translation;

            // Fallback to Ukrainian
            if (translations.TryGetValue("uk", out var ukTranslation) && !string.IsNullOrEmpty(ukTranslation))
                return ukTranslation;

            // Return first available translation if Ukrainian not found
            var firstTranslation = translations.Values.FirstOrDefault(v => !string.IsNullOrEmpty(v));
            return firstTranslation ?? string.Empty;
        }
        catch (JsonException)
        {
            // If JSON is malformed, return empty string
            return string.Empty;
        }
    }

    /// <summary>
    /// Gets a translation array from JSON string for the specified language with fallback to Ukrainian
    /// </summary>
    /// <param name="jsonTranslations">JSON string containing array translations</param>
    /// <param name="language">Target language code (e.g., "en", "uk")</param>
    /// <returns>List of translated strings or empty list if not found</returns>
    public static List<string> GetTranslationArray(this string jsonTranslations, string language)
    {
        if (string.IsNullOrWhiteSpace(jsonTranslations))
            return new List<string>();

        try
        {
            var translations = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(jsonTranslations);
            
            if (translations == null)
                return new List<string>();

            // Try requested language first
            if (translations.TryGetValue(language, out var translationArray) && translationArray != null && translationArray.Count > 0)
                return translationArray;

            // Fallback to Ukrainian
            if (translations.TryGetValue("uk", out var ukTranslationArray) && ukTranslationArray != null && ukTranslationArray.Count > 0)
                return ukTranslationArray;

            // Return first available translation array if Ukrainian not found
            var firstTranslationArray = translations.Values.FirstOrDefault(v => v != null && v.Count > 0);
            return firstTranslationArray ?? new List<string>();
        }
        catch (JsonException)
        {
            // If JSON is malformed, return empty list
            return new List<string>();
        }
    }

    /// <summary>
    /// Sets a translation in JSON string for the specified language
    /// </summary>
    /// <param name="jsonTranslations">Current JSON string containing translations</param>
    /// <param name="language">Target language code (e.g., "en", "uk")</param>
    /// <param name="value">Translation value to set</param>
    /// <returns>Updated JSON string with the new translation</returns>
    public static string SetTranslation(this string jsonTranslations, string language, string value)
    {
        try
        {
            var translations = JsonSerializer.Deserialize<Dictionary<string, string>>(jsonTranslations) ?? new Dictionary<string, string>();
            translations[language] = value;
            return JsonSerializer.Serialize(translations);
        }
        catch (JsonException)
        {
            // If JSON is malformed, create new dictionary
            var newTranslations = new Dictionary<string, string> { [language] = value };
            return JsonSerializer.Serialize(newTranslations);
        }
    }

    /// <summary>
    /// Sets a translation array in JSON string for the specified language
    /// </summary>
    /// <param name="jsonTranslations">Current JSON string containing array translations</param>
    /// <param name="language">Target language code (e.g., "en", "uk")</param>
    /// <param name="values">Translation array to set</param>
    /// <returns>Updated JSON string with the new translation array</returns>
    public static string SetTranslationArray(this string jsonTranslations, string language, List<string> values)
    {
        try
        {
            var translations = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(jsonTranslations) ?? new Dictionary<string, List<string>>();
            translations[language] = values ?? new List<string>();
            return JsonSerializer.Serialize(translations);
        }
        catch (JsonException)
        {
            // If JSON is malformed, create new dictionary
            var newTranslations = new Dictionary<string, List<string>> { [language] = values ?? new List<string>() };
            return JsonSerializer.Serialize(newTranslations);
        }
    }
}
