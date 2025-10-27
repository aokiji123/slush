using AutoMapper;
using Domain.Entities;
using Application.DTOs;

namespace Application.Common.Mappings;

public class LibraryProfile : Profile
{
    public LibraryProfile()
    {
        CreateMap<Library, LibraryDto>();

        CreateMap<Library, LibraryGameDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Game.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Game.Name))
            .ForMember(dest => dest.MainImage, opt => opt.MapFrom(src => src.Game.MainImage))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => (double)src.Game.Price))
            .ForMember(dest => dest.SalePrice, opt => opt.MapFrom(src => (double)src.Game.SalePrice))
            .ForMember(dest => dest.DiscountPercent, opt => opt.MapFrom(src => src.Game.DiscountPercent))
            .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Game.Rating))
            .ForMember(dest => dest.ReleaseDate, opt => opt.MapFrom(src => src.Game.ReleaseDate))
            .ForMember(dest => dest.AddedAt, opt => opt.MapFrom(src => src.AddedAt))
            .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.Game.Genre))
            .ForMember(dest => dest.Platforms, opt => opt.MapFrom(src => src.Game.Platforms));

        CreateMap<AddToLibraryDto, Library>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.AddedAt, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Game, opt => opt.Ignore());

        CreateMap<LibraryMeRequestDto, Library>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.AddedAt, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Game, opt => opt.Ignore());
    }
}
