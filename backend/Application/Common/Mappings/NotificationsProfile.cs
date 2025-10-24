using AutoMapper;
using Domain.Entities;
using Application.DTOs;

namespace Application.Common.Mappings;

public class NotificationsProfile : Profile
{
    public NotificationsProfile()
    {
        CreateMap<Notifications, NotificationsDto>();

        CreateMap<NotificationsDto, Notifications>()
            .ForMember(dest => dest.User, opt => opt.Ignore());
    }
}
