using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModothStudy.Entity;
using ModothStudy.RepositoryInterface;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.CommonServices;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.Service.EntityServices
{
    public class CommentsService : ICommentsService
    {
        public IRepository<Node, Guid> _nodeRepository { get; }

        private readonly IRepository<Comment, Guid> _commentsRepository;
        private readonly IOperatorService _operatorService;

        public CommentsService(IRepository<Comment, Guid> commentsRepository,
        IRepository<Node, Guid> nodeRepository,
        IOperatorService operatorService)
        {
            _nodeRepository = nodeRepository;
            _commentsRepository = commentsRepository;
            _operatorService = operatorService;
        }
        public async Task<Guid> AddComment(Guid blogId, string detail)
        {
            var user = await _operatorService.CheckOperator();
            var node = await _nodeRepository.Retrieve().WhereOwnedOrShared(user).OfType<BlogNode>()
            .Where(n => n.Id == blogId).FirstOrDefaultAsync();
            if (node == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            var comment = new Comment
            {
                User = user,
                Blog = node,
                Created = DateTime.Now,
                Detail = new CommentDetail
                {
                    Content = detail
                }
            };
            await _commentsRepository.Create(comment);
            return comment.Id;
        }

        public async Task<Guid> AddSubcomment(Guid commentId, string detail)
        {
            var user = await _operatorService.CheckOperator();
            var comment = await _commentsRepository.Retrieve().Where(c => c.Id == commentId)
            .Include(c => c.Blog)
            .FirstOrDefaultAsync();
            if (comment == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchComment));
            }
            var succomment = new Comment
            {
                User = user,
                Blog = comment.Blog,
                Parent = comment,
                Created = DateTime.Now,
                Detail = new CommentDetail
                {
                    Content = detail
                }
            };
            await _commentsRepository.Create(comment);
            return comment.Id;
        }

        public async Task DeleteComment(Guid commentId)
        {
            var user = await _operatorService.CheckOperator();
            var comment = await _commentsRepository.Retrieve().Where(c => c.Id == commentId)
            .Where(c => c.User == user)
                        .Include(c => c.Blog)
                        .FirstOrDefaultAsync();
            if (comment == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchComment));
            }
            await _commentsRepository.Delete(comment);
        }

        private async Task<BlogNode> GetBlogNode(Guid blogId, User? user)
        {
            var node = await _nodeRepository.Retrieve().WhereOwnedOrShared(user).OfType<BlogNode>()
            .Where(n => n.Id == blogId).FirstOrDefaultAsync();
            if (node == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            return node;
        }

        public async Task<IQueryable<Comment>> GetBlogComments(Guid blogId)
        {
            var user = await this._operatorService.Operator();
            var blog = await GetBlogNode(blogId, user);
            return _commentsRepository.Retrieve().Where(c => c.Blog == blog);
        }

        public Task<IQueryable<Comment>> GetSubcomments(Guid commentId)
        {
            return Task.Run(() => _commentsRepository.Retrieve().Where(c => c.Parent!.Id == commentId));
        }
    }
}