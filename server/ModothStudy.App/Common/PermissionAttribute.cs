using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using ModothStudy.App.Keys;
using ModothStudy.ServiceInterface.AppServices;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.App.Common
{
    [AttributeUsage(AttributeTargets.Method)]
    public class PermissionAttribute : ActionFilterAttribute
    {
        public PermissionAttribute(params string[] permissions)
        {
            Permissions = permissions;
        }

        public string[] Permissions { get; }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            base.OnActionExecuting(context);
            var userId = context.HttpContext.Session.GetGuid(SessionKeys.UserId);
            var permissionService = context.HttpContext.RequestServices.GetService<IUserPermissionsService>();
            var requirePermissions = await permissionService.CheckLackedPermissions(userId, Permissions);
            if (requirePermissions.Any())
            {
                throw new ServiceException(nameof(ServiceMessages.NoPermission));
            }

            await base.OnActionExecutionAsync(context, next);
        }
    }
}