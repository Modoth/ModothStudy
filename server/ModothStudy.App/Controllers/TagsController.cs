using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModothStudy.App.Common;
using Microsoft.EntityFrameworkCore;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.Entity;
using ModothStudy.App.Models;
using System.Linq;
using ModothStudy.ServiceInterface.Common;

namespace ModothStudy.App.Controllers
{

    [Route("api/[controller]/[action]")]
    public class TagsController : Controller
    {
        [HttpGet]
        public async Task<ApiResult<PagedResult<TagItem>>> AllTags(string? filter, int? skip, int? count, [FromServices] ITagsService tagsService)
        {
            var tags = tagsService.AllTags(filter);
            var total = await tags.CountAsync();
            tags = tags.Page(skip, count);
            return new PagedResult<TagItem>(total,
            await tags.OrderBy(t => t.Name)
            .Select(TagItemConverter.Selector).ToArrayAsync());
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpDelete]
        public async Task<ApiResult> RemoveTag([Required] Guid id,
                   [FromServices] ITagsService tagsService)
        {
            await tagsService.RemoveTag(id);
            return true;
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpPost]
        public async Task<ApiResult<TagItem>> AddTag([Required] string name, [Required] TagType type,
               string? values,
                  [FromServices] ITagsService tagsService)
        {
            return (await tagsService.AddTag(name, type, values)).ToTagItem();
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpPut]
        public async Task<ApiResult> UpdateTagName([Required] Guid id, [Required] string name,
               [FromServices] ITagsService tagsService)
        {
            await tagsService.UpdateTagName(id, name);
            return true;
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_MANAGE))]
        [HttpPut]
        public async Task<ApiResult> UpdateTagValues([Required] Guid id, [Required] string values,
              [FromServices] ITagsService tagsService)
        {
            await tagsService.UpdateTagValues(id, values);
            return true;
        }
    }
}