using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces;

public interface IBadgeService
{
    Task<IEnumerable<BadgeDto>> GetAllBadgesAsync();
    Task<IEnumerable<UserBadgeDto>> GetUserBadgesAsync(Guid userId);
    Task CheckAndAwardBadgesAsync(Guid userId);
    Task<int> AwardBadgesByNicknameAsync(string nickname, int count = 5);
}
