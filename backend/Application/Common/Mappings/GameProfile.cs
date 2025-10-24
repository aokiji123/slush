using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Application.DTOs;

namespace Application.Common.Mappings;

public class GameProfile : Profile
{
    public GameProfile()
    {
        CreateMap<Game, GameDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.GetLocalizedName("uk")))
            .ForMember(dest => dest.Genre, opt => opt.MapFrom(src => src.GetLocalizedGenres("uk")))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.GetLocalizedDescription("uk")))
            .ForMember(dest => dest.Developer, opt => opt.MapFrom(src => src.GetLocalizedDeveloper("uk")))
            .ForMember(dest => dest.Publisher, opt => opt.MapFrom(src => src.GetLocalizedPublisher("uk")))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => (double)src.Price))
            .ForMember(dest => dest.SalePrice, opt => opt.MapFrom(src => (double)src.SalePrice));

        CreateMap<CreateGameDto, Game>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.NameTranslations, opt => opt.MapFrom(src => "{}".SetTranslation("uk", src.Name)))
            .ForMember(dest => dest.DescriptionTranslations, opt => opt.MapFrom(src => "{}".SetTranslation("uk", src.Description)))
            .ForMember(dest => dest.DeveloperTranslations, opt => opt.MapFrom(src => "{}".SetTranslation("uk", src.Developer)))
            .ForMember(dest => dest.PublisherTranslations, opt => opt.MapFrom(src => "{}".SetTranslation("uk", src.Publisher)))
            .ForMember(dest => dest.GenreTranslations, opt => opt.MapFrom(src => "{}".SetTranslationArray("uk", src.Genre)))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
            .ForMember(dest => dest.SalePrice, opt => opt.MapFrom(src => src.SalePrice))
            .ForMember(dest => dest.Reviews, opt => opt.Ignore())
            .ForMember(dest => dest.GameCharacteristic, opt => opt.Ignore());
    }
}
