using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModothStudy.App.Common;
using ModothStudy.App.Models;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.CommonServices;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;
using Query = ModothStudy.ServiceInterface.Common.Query;

namespace ModothStudy.App.Controllers
{
    [Route("api/[controller]/[action]")]
    public class NodesController : Controller
    {

        [HttpGet]
        public async Task<ApiResult<NodeDir>> NodeDir(Guid? nodeId, string filter, int? skip, int? count,
        [FromServices] INodesService nodesService)
        {
            var sups = nodeId.HasValue ? await (await nodesService.PathNodes(nodeId.Value)).Select(NodeItemConverter.SummarySelector).ToArrayAsync()
            : new NodeItem[0];
            var subs = await (await nodesService.SubNodesOrFilterAllSubNodes(nodeId, filter)).Select(NodeItemConverter.SummarySelector).ToArrayAsync();
            return new NodeDir
            {
                Subnodes = subs,
                Supnodes = sups
            };
        }

        [HttpPost]
        public async Task<ApiResult> UpdateNodeShared(Guid nodeId, bool shared,
        [FromServices] INodesService nodesService)
        {
            await nodesService.UpdateNodeShared(nodeId, shared);
            return true;
        }

        [HttpPost]
        public async Task<ApiResult> Move(Guid nodeId, Guid folderId,
        [FromServices] INodesService nodesService)
        {
            await nodesService.MoveNode(nodeId, folderId);
            return true;
        }

        [HttpPost]
        public async Task<ApiResult> Rename(Guid nodeId, string newName,
        [FromServices] INodesService nodesService)
        {
            await nodesService.Rename(nodeId, newName);
            return true;
        }

        [HttpGet]
        public async Task<ApiResult<PagedResult<NodeItem>>> AllLevelNodes([Required]Guid nodeId, int? skip, int? count,
        [FromServices] INodesService nodesService)
        {
            var nodes = await nodesService.AllLevelNodes(nodeId);
            var total = await nodes.CountAsync();
            nodes = nodes.Page(skip, count);
            return new PagedResult<NodeItem>(total, await nodes
            .OrderBy(n => n.Path)
            .Select(NodeItemConverter.Selector).ToArrayAsync());
        }

        [HttpGet]
        public async Task<ApiResult<PagedResult<NodeItem>>> GetBlogsByTag([Required]string tag, string? tagValue, int count,
       [FromServices] INodesService nodesService)
        {
            var nodes = await nodesService.GetBlogsByTag(tag, tagValue);
            nodes = nodes.Page(0, count);
            return new PagedResult<NodeItem>(total: count, await nodes
            .Select(NodeItemConverter.Selector).ToArrayAsync());
        }

        [HttpPost]
        public async Task<ApiResult<PagedResult<NodeItem>>> QueryNodes([FromBody][Required]Query? query, string? filter, int? skip, int? count,
        [FromServices] INodesService nodesService)
        {
            var nodes = await nodesService.QueryNodes(query, filter);
            if (nodes == null)
            {
                return new PagedResult<NodeItem>(0, new NodeItem[0]);
            }
            var total = await nodes.CountAsync();
            nodes = nodes.Page(skip, count);
            return new PagedResult<NodeItem>(total, await nodes
            .Select(NodeItemConverter.Selector).ToArrayAsync());
        }

        [HttpGet]
        public async Task<ApiResult<PagedResult<NodeItem>>> SubNodesOrFilterAllSubNodes(Guid? nodeId, string filter, int? skip, int? count,
        [FromServices] INodesService nodesService)
        {
            var subnodes = await nodesService.SubNodesOrFilterAllSubNodes(nodeId, filter);
            var total = await subnodes.CountAsync();
            subnodes = subnodes.Page(skip, count);
            return new PagedResult<NodeItem>(total, await subnodes.Select(NodeItemConverter.Selector).ToArrayAsync());
        }

        [HttpGet]
        public async Task<ApiResult<IEnumerable<NodeItem>>> PathNodes([Required] Guid nodeId, [FromServices] INodesService nodesService)
        {
            var supnodes = await nodesService.PathNodes(nodeId);
            return await supnodes.Select(NodeItemConverter.Selector).ToArrayAsync();
        }

        [HttpGet]
        public async Task<ApiResult<Blog>> GetBlog([Required]Guid blogId, [FromServices] INodesService nodesService)
        {
            var blog = await (await nodesService.GetNodeById(blogId)).OfType<Entity.BlogNode>()
            .Select(BlogConverter.BlogSelector)
            .FirstOrDefaultAsync();
            if (blog == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            return blog;
        }

        [HttpGet]
        public async Task<ApiResult<IEnumerable<Blog>>> GetBlogSolutions([Required]Guid blogId,
        [FromServices]INodesService nodesService)
        {
            var solutions = await nodesService.GetBlogSolutions(blogId);
            return await solutions.Select(BlogConverter.BlogSelector).ToArrayAsync();
        }

        [HttpGet]
        public async Task<ApiResult<Blog>> GetBlogDefaultSolution([Required]Guid blogId,
        [FromServices]INodesService nodesService)
        {
            var solutions = await nodesService.GetBlogDefaultSolution(blogId);
            return await solutions.Select(BlogConverter.BlogSelector).FirstOrDefaultAsync();
        }

        [HttpGet]
        public async Task<ApiResult<Blog>> GetBlogCustomSolution([Required]Guid blogId,
        [FromServices]INodesService nodesService)
        {
            var solutions = await nodesService.GetBlogCustomSolution(blogId);
            return await solutions.Select(BlogConverter.BlogSelector).FirstOrDefaultAsync();
        }

        [HttpPut]
        public async Task<ApiResult<Guid>> UpdateBlogSolution([Required] Guid blogId, string title,
        [FromBody]string content, string[]? files,
        [FromServices]INodesService nodesService)
        {
            return await nodesService.UpdateBlogSolution(blogId, title, content, files);
        }

        [HttpDelete]
        public async Task<ApiResult> DeleteTempBlogFiles([Required] Guid blogId,
        [FromServices]INodesService nodesService)
        {
            await nodesService.DeleteTempBlogFiles(blogId);
            return true;
        }

        [HttpPut]
        public async Task<ApiResult> UpdateBlogContent([Required]Guid blogId,
         [FromBody]string content, string[]? files,
        [FromServices] INodesService nodesService)
        {
            await nodesService.UpdateBlogContent(blogId, content, files);
            return true;
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_POST_BLOG))]
        [HttpGet]
        public async Task<ApiResult<NodeItem>> CreateNode([Required]string name, [Required]NodeItemType type, Guid? parentId,
                   [FromServices] INodesService nodesService)
        {
            switch (type)
            {
                case NodeItemType.Folder:
                    return (await nodesService.AddFolder(parentId, name)).ToNodeItem();
                case NodeItemType.Blog:
                    return (await nodesService.AddBlog(parentId, name)).ToNodeItem();
                default:
                    throw new ServiceException(nameof(ServiceMessages.ClientError));
            }
        }

        [Permission(nameof(PermissionDescriptions.PERMISSION_POST_BLOG))]
        [HttpGet]
        public async Task<ApiResult<NodeItem>> CreateRefNode(string? name, Guid? parentId,
                Guid refId, [FromServices] INodesService nodesService)
        {
            return (await nodesService.AddReference(parentId, name, refId)).ToNodeItem();
        }

        [HttpDelete]
        public async Task<ApiResult> RemoveNode([Required]Guid nodeId,
                   [FromServices] INodesService nodesService)
        {
            await nodesService.RemoveNode(nodeId);
            return true;
        }

        [HttpPost("tags")]
        public async Task<ApiResult> UpdateTag([Required]Guid nodeId, [Required]Guid tagId, string? value,
         [FromServices] INodesService nodesService)
        {
            await nodesService.AddTag(nodeId, tagId, value);
            return true;
        }

        [HttpPost("share")]
        [Permission(nameof(PermissionDescriptions.PERMISSION_THIRD_SHARE))]
        public async Task<ApiResult<NodeTag>> UpdateWxShare([Required]Guid nodeId, [Required]bool share,
         [FromServices]IConfigsService configsService,
         [FromServices]ITagsService tagsService,
         [FromServices]INodesService nodesService,
         [FromServices]IWxService wxService)
        {
            var wxTagName = await configsService.GetValueOrDefault(nameof(AppConfigs.CONFIG_WX_SHARE_TAG));
            if (string.IsNullOrWhiteSpace(wxTagName))
            {
                throw new ServiceException(nameof(ServiceMessages.SiteConfigError));
            }
            var wxTag = await tagsService.AllTags(null).Where(t => t.Name == wxTagName).FirstOrDefaultAsync();
            if (wxTag == null)
            {
                throw new ServiceException(nameof(ServiceMessages.SiteConfigError));
            }
            var tagValue = default(string?);
            if (share)
            {
                var nodes = await nodesService.SubNodesOrFilterAllSubNodes(nodeId, null);
                var id = await wxService.UploadNews(nodes);
                if (id == null)
                {
                    throw new ServiceException(nameof(ServiceMessages.ServerError));

                }
                tagValue = await wxService.Send(id);
                await nodesService.AddTag(nodeId, wxTag.Id, tagValue);
            }
            else
            {
                var node = await (await nodesService.GetNodeById(nodeId)).Include(n => n.Tags).ThenInclude(t => t.Tag).FirstOrDefaultAsync();
                var tag = await (await nodesService.GetNodeById(nodeId))
                .Select(n => n.Tags.Where(t => t.Tag!.Id == wxTag.Id).FirstOrDefault()).FirstOrDefaultAsync();
                if (tag != null)
                {
                    if (!string.IsNullOrWhiteSpace(tag.Value))
                    {
                        await wxService.DeleteMsg(tag.Value!);
                    }
                    await nodesService.RemoveTag(nodeId, wxTag.Id);
                }
            }

            return new NodeTag
            {
                Id = wxTag.Id,
                Name = wxTag.Name,
                Type = wxTag.Type,
                Value = tagValue,
                Values = wxTag.Values
            };
        }

        [HttpDelete("tags")]
        public async Task<ApiResult> RemoveTag([Required]Guid nodeId, [Required]Guid tagId,
         [FromServices] INodesService nodesService)
        {
            await nodesService.RemoveTag(nodeId, tagId);
            return true;
        }
    }
}