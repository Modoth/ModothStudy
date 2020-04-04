using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ModothStudy.App.Common;
using ModothStudy.App.Models;
using ModothStudy.Entity;
using ModothStudy.ServiceInterface.AppServices;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;
using User = ModothStudy.App.Models.User;

namespace ModothStudy.App.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpPost]
        public async Task<ApiResult<User>> AddUser([FromBody] [Required] NewUser newUser,
            [FromServices] IUserLoginService loginService)
        {
            var user = await loginService.Register(newUser.Name!, newUser.Pwd!, newUser.RoleId);
            return user.ToUser();
        }

        [HttpGet]
        public async Task<ApiResult<PagedResult<User>>> Users(string? nameFilter, int? skip, int? count,
            [FromServices] IUsersService usersService)
        {
            IQueryable<Entity.User> users = usersService.Users();
            if (!string.IsNullOrWhiteSpace(nameFilter))
            {
                nameFilter = nameFilter!.Trim();
                users = users.Where(u => u.Name!.Contains(nameFilter, StringComparison.CurrentCultureIgnoreCase));
            }

            var total = await users.CountAsync();
            users = users.Page(skip, count);
            var filteredUsers = await users.OrderBy(u => u.Name).ThenBy(u => u.State).Select(u => new User
            {
                Id = u.Id,
                Name = u.Name!,
                Avatar = u.Avatar,
                State = u.State,
                RoleId = u.Role == null ? default : u.Role.Id
            })
                .ToArrayAsync();
            return new PagedResult<User>(total, filteredUsers);
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpPut("role")]
        public async Task<ApiResult> ChangeUserRole([Required] Guid id, Guid? roleId,
                    [FromServices] IUserPermissionsService permissionsService)
        {
            await permissionsService.ChangeUserRole(id, roleId);
            return true;
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpPut("state")]
        public async Task<ApiResult> ChangeUserState([Required] Guid id, [Required] bool normal,
                    [FromServices] IUsersService usersService)
        {
            await usersService.ChangeUserState(id, normal ? UserState.Normal : UserState.Disabled);
            return true;
        }
    }
}