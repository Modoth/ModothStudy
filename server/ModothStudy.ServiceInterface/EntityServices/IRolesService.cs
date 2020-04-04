using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ModothStudy.Entity;

namespace ModothStudy.ServiceInterface.EntityServices
{
    public interface IRolesService
    {
        Task<Role> AddRole(string name, Guid? baseRoleId);

        Task<RolePermission> AddPermissionToRole(Guid roleId, string permission);

        Task RemovePermissionFormRole(Guid roleId, string permission);

        Task RemoveRole(Guid id);

        IQueryable<Role> Roles();

        IQueryable<Role> GetRoleById(Guid roleId);

        Task<HashSet<string>> AllRolePermissions();

        Task<Role> GetOrAddAdmRole();

        Task<HashSet<string>> RolePermissions(Guid? roleId);
    }
}