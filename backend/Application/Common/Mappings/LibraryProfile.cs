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
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Game.GetLocalizedName("uk")))
            .ForMember(dest => dest.MainImage, opt => opt.MapFrom(src => src.Game.MainImage));

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
