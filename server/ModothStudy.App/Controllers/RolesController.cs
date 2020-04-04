using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModothStudy.App.Common;
using ModothStudy.App.Models;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.App.Controllers
{
    [Route("api/[controller]")]
    public class RolesController : Controller
    {
        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpPost]
        public async Task<ApiResult<Role>> AddRole([FromBody] [Required] NewRole newRole,
            [FromServices] IRolesService rolesService)
        {
            var role = await rolesService.AddRole(newRole.Name!, newRole.BaseRoleId);
            return new Role
            {
                Id = role.Id,
                Name = role.Name!,
                Permissions = await GetPermissionDict(rolesService,
                    await rolesService.RolePermissions(role.Id))
            };
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpPost("permission")]
        public async Task<ApiResult<string>> AddPermissionToRole([Required] Guid roleId, [Required] string permission,
                    [FromServices] IRolesService rolesService)
        {
            return (await rolesService.AddPermissionToRole(roleId, permission)).Permission!;
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpDelete]
        public async Task<ApiResult> RemoveRole([Required] Guid id,
            [FromServices] IRolesService rolesService)
        {
            await rolesService.RemoveRole(id);
            return true;
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpDelete("permission")]
        public async Task<ApiResult> RemovePermissionFromRole([Required] Guid roleId, [Required] string permission,
                    [FromServices] IRolesService rolesService)
        {
            await rolesService.RemovePermissionFormRole(roleId, permission);
            return true;
        }

        [HttpGet]
        public async Task<ApiResult<PagedResult<Role>>> Roles([FromServices] IRolesService rolesService)
        {
            var roles = await rolesService.Roles().Select(r => new Role
            { Id = r.Id, Name = r.Name! }).ToArrayAsync();

            foreach (var role in roles)
            {
                role.Permissions = await GetPermissionDict(rolesService,
                    await rolesService.RolePermissions(role.Id));
            }

            return new PagedResult<Role>(roles.Length, roles);
        }

        private static async Task<Dictionary<string, bool>> GetPermissionDict(
            IRolesService rolesService, HashSet<string> permissions)
        {
            var allPermissions = await rolesService.AllRolePermissions();
            return allPermissions.ToDictionary(p => p, permissions.Contains);
        }
    }
}
