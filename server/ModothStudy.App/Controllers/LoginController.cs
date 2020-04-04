using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ModothStudy.App.Common;
using ModothStudy.App.Keys;
using ModothStudy.App.Models;
using ModothStudy.ServiceInterface.AppServices;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.CommonServices;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.App.Controllers
{
    [Route("api/[controller]/[action]")]
    public class LoginController : Controller
    {
        [HttpGet()]
        public async Task<ApiResult<LoginUser?>> On(
            [FromServices] IOperatorService operatorService,
            [FromServices] IUserPermissionsService permissionsService)
        {
            var user = await operatorService.Operator();
            if (user == null)
            {
                return new ApiResult<LoginUser?>(false, null, nameof(ServiceMessages.NotLogin));
            }
            return new LoginUser(user, await permissionsService.Permissions(user.Id));
        }

        [HttpGet()]
        public ApiResult<string> WeChatAppId([FromServices] IConfiguration configuration)
        {
            return configuration.GetValue<string>(ConfigKeys.WeChatAppId);
        }

        [HttpGet()]
        public ApiResult Off()
        {
            HttpContext.Session.Clear();
            return true;
        }

        [HttpPut]
        public async Task<ApiResult> UpdateNickName([Required]string nickName,
         [FromServices]IOperatorService operatorService,
        [FromServices]IUsersService usersService)
        {
            var user = await operatorService.Operator();
            if (user == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NotLogin));
            }
            await usersService.UpdateNickName(user.Id, nickName);
            return true;
        }

        [HttpPut]
        public async Task<ApiResult<string>> UpdateAvatar([Required]IFormFile file,
         [FromServices]IOperatorService operatorService,
        [FromServices]IUsersService usersService)
        {
            var user = await operatorService.Operator();
            if (user == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NotLogin));
            }
            return await usersService.UpdateAvatar(user.Id, async (stream) =>
            {
                await file.CopyToAsync(stream);
            }, file.ContentType, file.Length);
        }

        [HttpPut]
        public async Task<ApiResult> UpdatePwd([FromBody][Required] NewPwd newpwd,
        [FromServices]IOperatorService operatorService,
        [FromServices] IUserLoginService loginService,
        [FromServices]IUsersService usersService)
        {
            var user = await operatorService.Operator();
            if (user == null)
            {
                return new ApiResult<LoginUser?>(false, null, nameof(ServiceMessages.NotLogin));
            }
            user = await loginService.CheckLogin(user.Name!, newpwd.OldPassword!);
            await usersService.UpdatePwd(user.Id, newpwd.Password!);
            HttpContext.Session.Clear();
            return true;
        }

        [HttpPost()]
        public async Task<ApiResult<LoginUser>> PwdOn([FromBody] [Required] UserLogin login,
            [FromServices] IUserLoginService loginService,
            [FromServices] IUserPermissionsService permissionsService)
        {
            HttpContext.Session.Clear();
            var user = await loginService.CheckLogin(login.Name!, login.Password!);
            HttpContext.Session.SetString(SessionKeys.UserId, user.Id.ToString());
            return new LoginUser(user, await permissionsService.Permissions(user.Id));
        }

        [HttpGet()]
        public ApiResult<LoginUser> WeChatOn([Required] string code, bool testLogin,
            [FromServices] IConfiguration configuration)
        {
            //var appId = configuration.GetValue<string>(ConfigKeys.WeChatAppId);
            //var appSecret = configuration.GetValue<string>(ConfigKeys.WeChatAppSecret);
            throw new ServiceException(nameof(ServiceMessages.UserOrPwdError));
        }
    }
}