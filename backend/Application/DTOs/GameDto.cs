using System;
using System.Collections.Generic;

namespace Application.DTOs;

public class GameDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string MainImage { get; set; } = string.Empty;
    public List<string> GameImages { get; set; } = new List<string>();
    public List<string> Genres { get; set; } = new List<string>();
    public double Price { get; set; }
    public double Rating { get; set; }
    public DateTime ReleaseDate { get; set; }
    public DeveloperDto Developer { get; set; } = new DeveloperDto();
    public PublisherDto Publisher { get; set; } = new PublisherDto();
    public List<string> Platforms { get; set; } = new List<string>();
    public List<GameSetDto> GameSets { get; set; } = new List<GameSetDto>();
    public List<DlcDto> Dlcs { get; set; } = new List<DlcDto>();
    public List<CommentDto> Comments { get; set; } = new List<CommentDto>();
    public FriendsWishlistDto FriendsWishlist { get; set; } = new FriendsWishlistDto();
    public FriendsOwnedDto FriendsOwned { get; set; } = new FriendsOwnedDto();
}