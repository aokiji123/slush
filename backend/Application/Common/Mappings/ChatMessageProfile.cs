using Application.DTOs;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Mappings;

public class ChatMessageProfile : Profile
{
    public ChatMessageProfile()
    {
        CreateMap<ChatMessage, ChatMessageDto>()
            .ForMember(dest => dest.MessageType, opt => opt.MapFrom(src => (ChatMessageTypeDto)src.MessageType))
            .ForMember(dest => dest.Sender, opt => opt.MapFrom(src => src.Sender != null ? new UserBasicDto
            {
                Id = src.Sender.Id,
                UserName = src.Sender.UserName ?? string.Empty,
                Nickname = src.Sender.Nickname,
                Avatar = src.Sender.Avatar,
                IsOnline = src.Sender.IsOnline
            } : null))
            .ForMember(dest => dest.Receiver, opt => opt.MapFrom(src => src.Receiver != null ? new UserBasicDto
            {
                Id = src.Receiver.Id,
                UserName = src.Receiver.UserName ?? string.Empty,
                Nickname = src.Receiver.Nickname,
                Avatar = src.Receiver.Avatar,
                IsOnline = src.Receiver.IsOnline
            } : null));

        CreateMap<ChatMessageAttachment, ChatMessageAttachmentDto>()
            .ForMember(dest => dest.AttachmentType, opt => opt.MapFrom(src => (ChatMessageTypeDto)src.AttachmentType));

        CreateMap<SendTextMessageDto, ChatMessage>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.SenderId, opt => opt.Ignore())
            .ForMember(dest => dest.MessageType, opt => opt.MapFrom(src => ChatMessageType.Text))
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsEdited, opt => opt.Ignore())
            .ForMember(dest => dest.EditedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Sender, opt => opt.Ignore())
            .ForMember(dest => dest.Receiver, opt => opt.Ignore())
            .ForMember(dest => dest.Attachments, opt => opt.Ignore());

        CreateMap<SendMediaMessageDto, ChatMessage>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.SenderId, opt => opt.Ignore())
            .ForMember(dest => dest.MessageType, opt => opt.MapFrom(src => (ChatMessageType)src.MessageType))
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsEdited, opt => opt.Ignore())
            .ForMember(dest => dest.EditedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Sender, opt => opt.Ignore())
            .ForMember(dest => dest.Receiver, opt => opt.Ignore())
            .ForMember(dest => dest.Attachments, opt => opt.Ignore());
    }
}
