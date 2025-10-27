using AutoMapper;
using Application.DTOs;
using Domain.Entities;

namespace Application.Common.Mappings;

public class UserReportProfile : Profile
{
    public UserReportProfile()
    {
        CreateMap<CreateUserReportDto, UserReport>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.ReporterId, opt => opt.Ignore())
            .ForMember(dest => dest.Reporter, opt => opt.Ignore())
            .ForMember(dest => dest.ReportedUser, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.ResolvedAt, opt => opt.Ignore())
            .ForMember(dest => dest.ResolvedById, opt => opt.Ignore());

        CreateMap<UserReport, UserReportDto>();
    }
}

