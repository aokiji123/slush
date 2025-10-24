using AutoMapper;
using Domain.Entities;
using Application.DTOs;

namespace Application.Common.Mappings;

public class ProfileCommentProfile : Profile
{
    public ProfileCommentProfile()
    {
        CreateMap<ProfileComment, ProfileCommentDto>()
            .ForMember(dest => dest.AuthorNickname, opt => opt.MapFrom(src => src.Author.UserName))
            .ForMember(dest => dest.AuthorAvatar, opt => opt.MapFrom(src => src.Author.Avatar));

        CreateMap<CreateProfileCommentDto, ProfileComment>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.AuthorId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.ProfileUser, opt => opt.Ignore())
            .ForMember(dest => dest.Author, opt => opt.Ignore());
    }
}
