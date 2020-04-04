using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModothStudy.App.Common;
using ModothStudy.App.Models;
using ModothStudy.Entity;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.CommonServices;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.App.Controllers
{
    [Route("api/[controller]/[action]")]
    public class ConfigsController : Controller
    {
        private Lazy<IWxService> m_WxService;
        private Lazy<IConfigsService> m_ConfigsService;
        private Lazy<IFileService> m_FileService;

        public ConfigsController(Lazy<IWxService> wxService, Lazy<IConfigsService> configsService,
        Lazy<IFileService> fileService)
        {
            m_WxService = wxService;
            m_ConfigsService = configsService;
            m_FileService = fileService;
        }

        [HttpGet]
        public async Task<Dictionary<string, string>> All(
            [FromServices] IConfigsService configsService
        )
        {
            return await configsService.All();
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpGet]
        public async Task<ApiResult<PagedResult<ConfigItem>>> AllConfigs(string? filter, int? skip, int? count
        , [FromServices] IConfigsService configsService)
        {
            var configs = configsService.AllConfigs(filter);
            var total = await configs.CountAsync();
            configs = configs.Page(skip, count);
            return new PagedResult<ConfigItem>(total,
            await configs.OrderBy(t => t.Key)
            .Select(ConfigItemConverter.Selector).ToArrayAsync());
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpPut]
        public async Task<ApiResult> UpdateValue([Required]Guid id, [Required, FromBody]string value,
                [FromServices] IConfigsService configsService)
        {
            var config = await configsService.UpdateValue(id, value);
            await OnConfigChanged(config.Key!, config.Value);
            return true;
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpPut]
        public async Task<ApiResult<string>> UpdateImageValue([Required]Guid id, [Required]IFormFile file,
               [FromServices]IConfigsService configsService,
               [FromServices]IFileService fileService)
        {
            var originFile = await configsService.AllConfigs(null).Where(c => c.Id == id).Select(c => c.Value).FirstOrDefaultAsync();
            if (!string.IsNullOrWhiteSpace(originFile))
            {
                await fileService.DeleteFile(originFile);
            }
            var fileItem = await fileService.CreateImageFile(async (stream) =>
            {
                await file.CopyToAsync(stream);
            }, file.ContentType, file.Length);
            var config = await configsService.UpdateValue(id, fileItem.Path);
            await OnConfigChanged(config.Key!, config.Value, Path.GetFileName(fileItem.Path), await fileService.RetrieveByPath(fileItem.Path));
            return fileItem.Path;
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpPut]
        public async Task<ApiResult> ResetValue([Required]Guid id,
                        [FromServices] IConfigsService configsService,
                        [FromServices] IFileService fileService)
        {

            var config = await configsService.AllConfigs(null).Where(c => c.Id == id).FirstOrDefaultAsync();
            if (config != null && AppConfigsUtils.ConfigTypes.ContainsKey(config.Key!)
            && AppConfigsUtils.ConfigTypes[config.Key!] == ConfigType.Image)
            {
                await fileService.DeleteFile(config.Value!);
            }
            config = await configsService.ResetValue(id);
            await OnConfigChanged(config.Key!, config.Value);
            return true;
        }

        [HttpGet]
        public Configs AllKeys()
        {
            return new Configs();
        }



        private async Task OnConfigChanged(string key, string? value, params object[] opts)
        {
            switch (key)
            {
                case nameof(AppConfigs.CONFIG_MENUS):
                    if (!String.IsNullOrWhiteSpace(value))
                    {
                        await m_WxService.Value.UpdateMenus(value);
                    }
                    return;
                case nameof(AppConfigs.CONFIG_WX_SHARE_DEFAULT_THUMB):
                    var config = await m_ConfigsService.Value.AllConfigs(null).Where(c => c.Key == nameof(AppConfigs.CONFIG_WX_SHARE_DEFAULT_THUMB_ID))
                    .FirstOrDefaultAsync();
                    if (config == null)
                    {
                        throw new ServiceException(nameof(ServiceMessages.ServerError));
                    }
                    var defaultId = String.IsNullOrWhiteSpace(value) ?
                     string.Empty :
                    await m_WxService.Value.Upload((string)opts[0], (Stream)opts[1], WxUploadTypes.Thumb);
                    await m_ConfigsService.Value.UpdateValue(config.Id, defaultId!);
                    return;
            }
        }
    }
}