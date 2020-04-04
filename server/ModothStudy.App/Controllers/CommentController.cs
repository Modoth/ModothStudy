using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModothStudy.App.Common;
using ModothStudy.App.Models;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.EntityServices;

namespace ModothStudy.App.Controllers
{
    [Route("api/[controller]/[action]")]
    public class CommentController : Controller
    {
        [HttpGet]
        public async Task<ApiResult<PagedResult<CommentItem>>> GetBlogComments([Required]Guid blogId, int? skip, int? count,
        [FromServices]ICommentsService commentsService)
        {
            var comments = await commentsService.GetBlogComments(blogId);
            var total = await comments.CountAsync();
            comments = comments.Page(skip, count);
            return new PagedResult<CommentItem>(total, await comments
            .OrderBy(n => n.Created)
            .Select(CommentItemConverter.Selector).ToArrayAsync());
        }

        [HttpGet]
        public async Task<ApiResult<PagedResult<CommentItem>>> GetSubcomments([Required]Guid commentId, int? skip, int? count,
       [FromServices]ICommentsService commentsService)
        {
            var comments = await commentsService.GetSubcomments(commentId);
            var total = await comments.CountAsync();
            comments = comments.Page(skip, count);
            return new PagedResult<CommentItem>(total, await comments
            .OrderBy(n => n.Created)
            .Select(CommentItemConverter.Selector).ToArrayAsync());
        }

        [HttpPost]
        [Permission(nameof(PermissionDescriptions.PERMISSION_COMMENT))]
        public async Task<ApiResult<Guid>> AddComment([Required]Guid blogId, [Required] string detail,
        [FromServices]ICommentsService commentsService)
        {
            return await commentsService.AddComment(blogId, detail);
        }

        [HttpPost]
        [Permission(nameof(PermissionDescriptions.PERMISSION_COMMENT))]
        public async Task<ApiResult> AddSubcomment([Required]Guid commentId, [Required] string detail,
       [FromServices]ICommentsService commentsService)
        {
            await commentsService.AddSubcomment(commentId, detail);
            return true;
        }

        [HttpDelete]
        public async Task<ApiResult> DeleteComment([Required]Guid commentId,
      [FromServices]ICommentsService commentsService)
        {
            await commentsService.DeleteComment(commentId);
            return true;
        }
    }
}
