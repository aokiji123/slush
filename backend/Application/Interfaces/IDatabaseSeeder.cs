using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IDatabaseSeeder
{
    Task SeedAsync(IEnumerable<int> ids);
    Task SeedBadgesAsync();
}


