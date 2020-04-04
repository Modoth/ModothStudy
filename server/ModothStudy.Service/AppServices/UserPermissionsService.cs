using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModothStudy.Entity;
using ModothStudy.ServiceInterface.AppServices;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.Service.AppServices
{
    public class UserPermissionsService : IUserPermissionsService
    {
        private readonly IRolesService _rolesService;

        private readonly IUsersService _usersService;

        public UserPermissionsService(IUsersService usersService, IRolesService rolesService)
        {
            _usersService = usersService;
            _rolesService = rolesService;
        }

        public async Task<HashSet<string>> Permissions(Guid? userId)
        {
            if (!userId.HasValue)
            {
                return new HashSet<string>();
            }

            var roleId = await _usersService.GetUserById(userId.Value)
            .Select(u => u.Role == null ? default(Guid?) : u.Role!.Id)
            .FirstOrDefaultAsync();
            return await _rolesService.RolePermissions(roleId);
        }

        public async Task<IEnumerable<string>> CheckLackedPermissions(Guid? userId, string[] permissions)
        {
            if (!userId.HasValue)
            {
                return permissions;
            }

            var rolePermissions = await Permissions(userId);
            return permissions.Where(p => !rolePermissions.Contains(p));
        }

        public async Task ChangeUserRole(Guid userId, Guid? roleId)
        {
            var role = default(Role);
            if (roleId != null)
            {
                role = await _rolesService.GetRoleById(roleId.Value).FirstOrDefaultAsync();
                if (role == null)
                {
                    throw new ServiceException(nameof(ServiceMessages.NoSuchRole));
                }
            }

            await _usersService.ChangeUserRole(userId, role!);
        }
    }
}