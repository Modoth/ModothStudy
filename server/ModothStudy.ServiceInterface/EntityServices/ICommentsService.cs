using System;
using System.Linq;
using System.Threading.Tasks;
using ModothStudy.Entity;

namespace ModothStudy.ServiceInterface.EntityServices
{
    public interface ICommentsService
    {
        Task<IQueryable<Comment>> GetBlogComments(Guid blogId);

        Task<IQueryable<Comment>> GetSubcomments(Guid commentId);

        Task<Guid> AddComment(Guid blogId, string detail);

        Task<Guid> AddSubcomment(Guid commentId, string detail);

        Task DeleteComment(Guid commentId);
    }
}