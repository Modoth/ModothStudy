using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
    public class UsersService : IUsersService
    {
        private const string UserKey = nameof(RolesService) + "_ROLES";

        private readonly IRepository<User, Guid> _userRepository;

        private readonly IFileService _fileService;

        public UsersService(IRepository<User, Guid> userRepository, IFileService fileService)
        {
            _userRepository = userRepository;
            _fileService = fileService;
        }

        public async Task<User> AddUser(string name, string pwd, Role role)
        {

            if (!DataValidater.ValidateLoginName(name))
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidUserName));
            }

            if (!DataValidater.ValidateUserName(name))
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidUserName));
            }

            if (!DataValidater.ValidatePwd(pwd))
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidPwd));
            }

            if (await _userRepository.Retrieve().Where(u => u.Name == name).AnyAsync())
            {
                throw new ServiceException(nameof(ServiceMessages.ConflictUserName));
            }

            var newUser = new User
            {
                Name = name,
                NickName = name,
                Created = DateTime.Now,
                State = UserState.Normal,
                Role = role,
                UserLogins = new List<UserLogin> { new PwdLogin { Password = PwdEncrypter.Encrypt(pwd) } }
            };

            return await _userRepository.Create(newUser);
        }

        [CacheService(UserKey, false, "userId")]
        public virtual IQueryable<User> GetUserById(Guid userId)
        {
            return _userRepository.Retrieve().Where(u => u.Id == userId);
        }

        public IQueryable<User> Users()
        {
            return _userRepository.Retrieve();
        }

        [CacheService(UserKey, false, "userId")]
        public virtual async Task ChangeUserRole(Guid userId, Role role)
        {
            var toUpdateUser = await _userRepository.Retrieve().FirstOrDefaultAsync(r => r.Id == userId);
            if (toUpdateUser == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchUser));
            }

            if (role == toUpdateUser.Role)
            {
                return;
            }

            toUpdateUser.Role = role;

            await _userRepository.Update(toUpdateUser);
        }

        [CacheService(UserKey, false, "userId")]
        public virtual async Task ChangeUserState(Guid userId, UserState state)
        {
            var toUpdateUser = await _userRepository.Retrieve().FirstOrDefaultAsync(r => r.Id == userId);
            if (toUpdateUser == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchUser));
            }

            if (toUpdateUser.State == state)
            {
                return;
            }

            toUpdateUser.State = state;
            await _userRepository.Update(toUpdateUser);
        }

        public async Task UpdatePwd(Guid userId, string pwd)
        {
            if (!DataValidater.ValidatePwd(pwd))
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidPwd));
            }
            var encryptedPwd = PwdEncrypter.Encrypt(pwd);
            var user = await _userRepository.Retrieve()
            .Include(u => u.UserLogins)
                .FirstOrDefaultAsync(u =>
                    u.Id == userId &&
                    u.State != UserState.Disabled);
            if (user == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchUser));
            }
            var login = default(PwdLogin);
            if (user.UserLogins == null)
            {
                user.UserLogins = new List<UserLogin>();
            }
            else
            {
                login = user.UserLogins.OfType<PwdLogin>().FirstOrDefault();
            }
            if (login == default)
            {
                login = new PwdLogin
                {
                    Password = encryptedPwd
                };
                user.UserLogins.Add(login);
            }
            else
            {
                login.Password = encryptedPwd;
            }
            await _userRepository.Update(user);
        }

        public async Task<string> UpdateAvatar(Guid userId, Func<Stream, Task> file, string contentType, long length)
        {
            var user = await _userRepository.Retrieve()
               .Include(u => u.UserLogins)
                   .FirstOrDefaultAsync(u =>
                       u.Id == userId &&
                       u.State != UserState.Disabled);
            if (user == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchUser));
            }
            if (!string.IsNullOrWhiteSpace(user.Avatar))
            {
                await _fileService.DeleteFile(user!.Avatar!);
            }
            var avatar = await _fileService.CreateImageFile(file, contentType, length);
            user.Avatar = avatar.Path;
            await _userRepository.Update(user);
            return avatar.Path;
        }

        public async Task UpdateNickName(Guid userId, string nickName)
        {
            if (!DataValidater.ValidateUserName(nickName))
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidUserName));
            }

            var user = await _userRepository.Retrieve()
                        .Include(u => u.UserLogins)
                            .FirstOrDefaultAsync(u =>
                                u.Id == userId &&
                                u.State != UserState.Disabled);
            if (user == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchUser));
            }
            user.NickName = nickName;
            await _userRepository.Update(user);
        }
    }
}