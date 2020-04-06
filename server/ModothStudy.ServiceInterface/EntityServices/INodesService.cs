using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ModothStudy.Entity;
using ModothStudy.ServiceInterface.Common;

namespace ModothStudy.ServiceInterface.EntityServices
{
    public interface INodesService
    {
        Task<IQueryable<Node>?> QueryNodes(Query? query, string? filter);

        Task Rename(Guid nodeId, string newName);

        Task<IQueryable<Node>> AllLevelNodes(Guid nodeId);

        Task<IQueryable<Node>> GetBlogsByTag(string tag, string? tagValue);

        Task<IQueryable<Node>> SubNodesOrFilterAllSubNodes(Guid? nodeId, string? filter, bool ownedOnly = false);

        Task<IQueryable<Node>> PathNodes(Guid nodeId, bool ownedOnly = false);

        Task<IQueryable<Node>> GetNodeById(Guid nodeId);

        Task<Node> AddFolder(Guid? parentId, string name);

        Task<Node> AddBlog(Guid? parentId, string name);

        Task<Node> AddReference(Guid? parentId, string? name, Guid refId);

        Task RemoveNode(Guid nodeId);

        Task MoveNode(Guid nodeId, Guid? parentId);

        Task CreateOrUpdateBlogContent(string path, string content);


        Task UpdateBlogContent(Guid blogId, string content, string[]? files);

        Task<Guid> UpdateBlogSolution(Guid blogId, string title, string content, string[]? files);

        Task<IQueryable<BlogNode>> GetBlogSolutions(Guid blogId);

        Task<IQueryable<BlogNode>> GetBlogDefaultSolution(Guid blogId);

        Task<IQueryable<BlogNode>> GetBlogCustomSolution(Guid blogId);

        Task UpdateNodeShared(Guid nodeId, bool shared);

        Task UpdateNodeGroupShared(Guid nodeId, bool shared);

        Task AddTag(Guid nodeId, Guid tagId, string? value);

        Task RemoveTag(Guid nodeId, Guid tagId);
        Task DeleteTempBlogFiles(Guid blogId);
    }
}