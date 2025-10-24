using AutoMapper;
using Domain.Entities;
using Application.DTOs;

namespace Application.Common.Mappings;

public class FriendshipProfile : Profile
{
    public FriendshipProfile()
    {
        CreateMap<Friendship, FriendshipDto>()
            .ForMember(dest => dest.User1, opt => opt.MapFrom(src => src.User1))
            .ForMember(dest => dest.User2, opt => opt.MapFrom(src => src.User2));

        CreateMap<FriendRequest, FriendRequestDto>()
            .ForMember(dest => dest.Sender, opt => opt.MapFrom(src => src.Sender))
            .ForMember(dest => dest.Receiver, opt => opt.MapFrom(src => src.Receiver));

        CreateMap<SendFriendRequestDto, FriendRequest>()
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.Sender, opt => opt.Ignore())
            .ForMember(dest => dest.Receiver, opt => opt.Ignore());
    }
}
