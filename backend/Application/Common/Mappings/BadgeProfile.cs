using AutoMapper;
using Domain.Entities;
using Application.DTOs;

namespace Application.Common.Mappings;

public class BadgeProfile : Profile
{
    public BadgeProfile()
    {
        CreateMap<Badge, BadgeDto>();

        CreateMap<UserBadge, UserBadgeDto>()
            .ForMember(dest => dest.Badge, opt => opt.MapFrom(src => src.Badge));
    }
}
