using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ModothStudy.Entity;

namespace ModothStudy.ServiceInterface.EntityServices
{
    public interface IUsersService
    {
        Task<User> AddUser(string name, string pwd, Role role);

        IQueryable<User> GetUserById(Guid userId);

        IQueryable<User> Users();

        Task ChangeUserRole(Guid userId, Role role);

        Task ChangeUserState(Guid userId, UserState state);

        Task UpdatePwd(Guid userId, string pwd);

        Task<string> UpdateAvatar(Guid userId, Func<Stream, Task> file, string contentType, long length);

        Task UpdateNickName(Guid userId, string nickName);
    }
}