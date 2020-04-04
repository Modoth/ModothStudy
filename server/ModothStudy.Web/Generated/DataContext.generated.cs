using Microsoft.EntityFrameworkCore;
using ModothStudy.Entity;
using ModothStudy.Repository;
namespace ModothStudy.Web.Generated
{
    public class DataContext : DataContextBase
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Config> Configs { get; set; }
        public DbSet<FileResource> FileResources { get; set; }
        public DbSet<Log> Logs { get; set; }
        public DbSet<Node> Nodes { get; set; }
        public DbSet<FolderNode> FolderNodes { get; set; }
        public DbSet<BlogNode> BlogNodes { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<User> Users { get; set; }
}
}
