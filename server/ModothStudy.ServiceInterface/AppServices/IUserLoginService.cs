using System;
using System.Threading.Tasks;
using ModothStudy.Entity;

namespace ModothStudy.ServiceInterface.AppServices
{
    public interface IUserLoginService
    {
        Task<User> CheckLogin(string name, string pwd);

        Task<User> Register(string name, string pwd, Guid? roleId);
    }
}