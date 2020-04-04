using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ModothStudy.ServiceInterface.AppServices
{
    public interface IUserPermissionsService
    {
        Task<HashSet<string>> Permissions(Guid? userId);

        Task<IEnumerable<string>> CheckLackedPermissions(Guid? userId, string[] permissions);

        Task ChangeUserRole(Guid userId, Guid? roleId);
    }
}