using System;
using Microsoft.AspNetCore.Http;
using ModothStudy.App.Keys;
using ModothStudy.Entity;
using ModothStudy.ServiceInterface.CommonServices;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.App.Common;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.Lang;
using Microsoft.EntityFrameworkCore;

namespace ModothStudy.App
{
    public class OperatorService : IOperatorService
    {
        private readonly IHttpContextAccessor _context;

        private Lazy<Task<User?>> _operator;

        public OperatorService(IHttpContextAccessor context)
        {
            _context = context;
            _operator = new Lazy<Task<User?>>(async () =>
         {
             var userId = _context.HttpContext.Session.GetGuid(SessionKeys.UserId);
             if (!userId.HasValue)
             {
                 return null;
             }
             var userService = _context.HttpContext.RequestServices.GetService<IUsersService>();
             return await userService.GetUserById(userId.Value).FirstOrDefaultAsync();
         });
        }

        public Task<User> CheckOperator() => _operator.Value.ContinueWith(user => user.Result ?? throw new ServiceException(nameof(ServiceMessages.NotLogin)));

        public Task<User?> Operator() => _operator.Value;
    }
}