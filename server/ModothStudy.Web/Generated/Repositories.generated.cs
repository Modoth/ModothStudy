using System;
using Microsoft.EntityFrameworkCore;
using ModothStudy.Entity;
using ModothStudy.Repository;
namespace ModothStudy.Web.Generated
{

    public class CommentsRepository : Repository<Comment, Guid> 
    {
        public CommentsRepository(DataContext context) : base(context)
        {
        }
        protected override DbSet<Comment> Entities => ((DataContext)Context).Comments;
    }

    public class ConfigsRepository : Repository<Config, Guid> 
    {
        public ConfigsRepository(DataContext context) : base(context)
        {
        }
        protected override DbSet<Config> Entities => ((DataContext)Context).Configs;
    }

    public class FileResourcesRepository : Repository<FileResource, Guid> 
    {
        public FileResourcesRepository(DataContext context) : base(context)
        {
        }
        protected override DbSet<FileResource> Entities => ((DataContext)Context).FileResources;
    }

    public class LogsRepository : Repository<Log, Guid> 
    {
        public LogsRepository(DataContext context) : base(context)
        {
        }
        protected override DbSet<Log> Entities => ((DataContext)Context).Logs;
    }

    public class NodesRepository : Repository<Node, Guid> 
    {
        public NodesRepository(DataContext context) : base(context)
        {
        }
        protected override DbSet<Node> Entities => ((DataContext)Context).Nodes;
    }

    public class FolderNodesRepository : Repository<FolderNode, Guid> 
    {
        public FolderNodesRepository(DataContext context) : base(context)
        {
        }
        protected override DbSet<FolderNode> Entities => ((DataContext)Context).FolderNodes;
    }

    public class BlogNodesRepository : Repository<BlogNode, Guid> 
    {
        public BlogNodesRepository(DataContext context) : base(context)
        {
        }
        protected override DbSet<BlogNode> Entities => ((DataContext)Context).BlogNodes;
    }

    public class RolesRepository : Repository<Role, Guid> 
    {
        public RolesRepository(DataContext context) : base(context)
        {
        }
        protected override DbSet<Role> Entities => ((DataContext)Context).Roles;
    }

    public class TagsRepository : Repository<Tag, Guid> 
    {
        public TagsRepository(DataContext context) : base(context)
        {
        }
        protected override DbSet<Tag> Entities => ((DataContext)Context).Tags;
    }

    public class UsersRepository : Repository<User, Guid> 
    {
        public UsersRepository(DataContext context) : base(context)
        {
        }
        protected override DbSet<User> Entities => ((DataContext)Context).Users;
    }

}
