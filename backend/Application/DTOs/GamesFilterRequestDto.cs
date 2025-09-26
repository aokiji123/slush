using System;
using System.Collections.Generic;

namespace Application.DTOs;

public class GamesFilterRequestDto
{
    public string Query { get; set; } = string.Empty;
    public List<string> Genres { get; set; } = new();
    public List<string> Platforms { get; set; } = new();
    public bool? WithDiscount { get; set; }
    public string SortBy { get; set; } = "relevancy"; // relevancy, publish_date, rating, price_asc, price_desc, alphabet
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 20;
}


