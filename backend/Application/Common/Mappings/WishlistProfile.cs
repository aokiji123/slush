using AutoMapper;
using Domain.Entities;
using Application.DTOs;

namespace Application.Common.Mappings;

public class WishlistProfile : Profile
{
    public WishlistProfile()
    {
        CreateMap<WishlistRequestDto, Wishlist>()
            .ForMember(dest => dest.AddedAtUtc, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Game, opt => opt.Ignore());

        CreateMap<WishlistMeRequestDto, Wishlist>()
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.AddedAtUtc, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Game, opt => opt.Ignore());
    }
}
