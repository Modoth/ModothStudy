using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModothStudy.Entity;
using ModothStudy.RepositoryInterface;
using ModothStudy.Service.Common;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.Service.EntityServices
{
    [CacheService]
    public class RolesService : IRolesService
    {
        private const string RoleDetailKey = nameof(RolesService) + "_ROLE_DETAILS";

        private const string RolesKey = nameof(RolesService) + "_ROLES";

        private static readonly string AdmRoleName = "adm";

        private readonly IRepository<Role, Guid> _rolesRepository;

        public RolesService(IRepository<Role, Guid> rolesRepository)
        {
            _rolesRepository = rolesRepository;
        }

        private static HashSet<string> AllPermissions { get; } = GetAllPermissions();

        [CacheService(RolesKey, false)]
        public virtual async Task<Role> AddRole(string name, Guid? baseRoleId)
        {
            name = name.Trim();
            if (!DataValidater.ValidateRoleName(name))
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidRoleName));
            }

            var existedRole = await _rolesRepository.Retrieve().FirstOrDefaultAsync(r => r.Name == name);
            if (existedRole != null)
            {
                throw new ServiceException(nameof(ServiceMessages.ConflictRoleName));
            }

            var newRole = new Role { Name = name };

            if (baseRoleId != null)
            {
                var baseRole = await _rolesRepository.Retrieve().Include(r => r.Permissions)
                    .FirstOrDefaultAsync(r => r.Id == baseRoleId);

                if (baseRole == null)
                {
                    throw new ServiceException(nameof(ServiceMessages.NoSuchBaseRole));
                }

                newRole.Permissions = baseRole.Permissions.Select(p => new RolePermission { Permission = p.Permission }).ToArray();
            }

            return await _rolesRepository.Create(newRole);
        }

        [CacheService(RoleDetailKey, false, "roleId")]
        public virtual async Task<RolePermission> AddPermissionToRole(Guid roleId, string permission)
        {
            var admRoleId = (await GetOrAddAdmRole()).Id;
            if (admRoleId == roleId)
            {
                throw new ServiceException(nameof(ServiceMessages.NoPermission));
            }

            if (string.IsNullOrWhiteSpace(permission))
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchPermission));
            }

            permission = permission.Trim().ToUpper();
            var role = await _rolesRepository.Retrieve().Include(r => r.Permissions).Where(r => r.Id == roleId)
                .FirstOrDefaultAsync();

            if (role == null)
            {
                throw new Exception(nameof(ServiceMessages.NoSuchRole));
            }

            var permissionItem = role.Permissions.FirstOrDefault(p => p.Permission == permission);
            if (permissionItem != null)
            {
                return permissionItem;
            }

            var newPermission = new RolePermission { Permission = permission };
            role.Permissions!.Add(newPermission);
            await _rolesRepository.Update(role);
            return newPermission;
        }

        [CacheService(RoleDetailKey, false, "roleId")]
        public virtual async Task RemovePermissionFormRole(Guid roleId, string permission)
        {
            var admRoleId = (await GetOrAddAdmRole()).Id;
            if (admRoleId == roleId)
            {
                throw new ServiceException(nameof(ServiceMessages.NoPermission));
            }

            permission = permission.Trim().ToUpper();
            var role = await _rolesRepository.Retrieve().Include(r => r.Permissions).Where(r => r.Id == roleId)
                .FirstOrDefaultAsync();

            if (role == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchRole));
            }

            var permissionItem = role.Permissions.FirstOrDefault(p => p.Permission == permission);
            if (permissionItem == null)
            {
                return;
            }

            role.Permissions!.Remove(permissionItem);
            await _rolesRepository.Update(role);
        }

        [CacheService(RolesKey, false)]
        public virtual async Task RemoveRole(Guid id)
        {
            var admRoleId = (await GetOrAddAdmRole()).Id;
            if (admRoleId == id)
            {
                throw new ServiceException(nameof(ServiceMessages.NoPermission));
            }

            var role = await _rolesRepository.Retrieve().FirstOrDefaultAsync(r => r.Id == id);
            if (role == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchRole));
            }

            await _rolesRepository.Delete(role);
        }


        [CacheService(RolesKey)]
        public virtual IQueryable<Role> Roles()
        {
            return _rolesRepository.Retrieve();
        }

        [CacheService(RoleDetailKey, true, "roleId")]
        public virtual IQueryable<Role> GetRoleById(Guid roleId)
        {
            return _rolesRepository.Retrieve().Where(r => r.Id == roleId);
        }

        public Task<HashSet<string>> AllRolePermissions()
        {
            return Task.FromResult(AllPermissions);
        }

        [CacheService(RolesKey, false)]
        public virtual async Task<Role> GetOrAddAdmRole()
        {
            return await _rolesRepository.Retrieve().Where(r => r.Name == AdmRoleName).FirstOrDefaultAsync()
                   ?? await AddRole(AdmRoleName, null);
        }

        public async Task<HashSet<string>> RolePermissions(Guid? roleId)
        {
            if (!roleId.HasValue)
            {
                return new HashSet<string>();
            }

            var admRoleId = (await GetOrAddAdmRole()).Id;
            if (admRoleId == roleId)
            {
                return GetAllPermissions();
            }

            var role = await GetRoleById(roleId.Value).Include(r => r.Permissions).FirstOrDefaultAsync();
            if (role == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchRole));
            }
            return role.Permissions == null ? new HashSet<string>() : role.Permissions.Select(p => p.Permission!).ToHashSet();
        }

        private static HashSet<string> GetAllPermissions()
        {
            return Enum.GetNames(typeof(PermissionDescriptions)).ToHashSet();
        }
    }
}