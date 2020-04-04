using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModothStudy.Entity;
using ModothStudy.Service.Common;
using ModothStudy.ServiceInterface.AppServices;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.Service.AppServices
{
    public class UserLoginService : IUserLoginService
    {
        private readonly IRolesService _rolesService;

        private readonly IUsersService _usersService;

        public UserLoginService(IUsersService usersService, IRolesService rolesService)
        {
            _usersService = usersService;
            _rolesService = rolesService;
        }

        public async Task<User> CheckLogin(string name, string pwd)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(pwd))
            {
                throw new ServiceException(nameof(ServiceMessages.UserOrPwdError));
            }

            var encryptPwd = PwdEncrypter.Encrypt(pwd);
            var user = await _usersService.Users()
                .FirstOrDefaultAsync(u =>
                    u.Name == name &&
                    u.State != UserState.Disabled &&
                    u.UserLogins.Any(l => ((PwdLogin)l).Password == encryptPwd));

            if (user == null)
            {
                throw new ServiceException(nameof(ServiceMessages.UserOrPwdError));
            }

            return user;
        }

        public async Task<User> Register(string name, string pwd, Guid? roleId)
        {
            var role = default(Role);
            if (roleId != null)
            {
                role = await _rolesService.GetRoleById(roleId.Value).FirstOrDefaultAsync();
            }

            return await _usersService.AddUser(name, pwd, role!);
        }
    }
}