using Microsoft.EntityFrameworkCore;
using ModothStudy.Entity;

namespace ModothStudy.Repository
{
    public abstract class DataContextBase : DbContext
    {
        public DataContextBase(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //role
            modelBuilder.Entity<Role>()
                .HasAlternateKey(r => r.Name);

            modelBuilder.Entity<Role>()
                .HasMany(r => r.Permissions).WithOne().HasForeignKey(p => p.RoleId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RolePermission>().HasKey(p => new { p.RoleId, p.Permission });
            modelBuilder.Entity<Role>()
                .HasMany(r => r.Users).WithOne(u => u.Role!).OnDelete(DeleteBehavior.SetNull);


            //user
            modelBuilder.Entity<User>()
                .HasAlternateKey(u => u.Name);

            modelBuilder.Entity<User>().HasMany(u => u.UserLogins).WithOne().HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserLogin>()
                .HasDiscriminator<string>(nameof(UserLogin.Type))
                .HasValue<PwdLogin>(nameof(PwdLogin))
                .HasValue<WeChatLogin>(nameof(WeChatLogin));

            modelBuilder.Entity<UserLogin>().HasKey(u => new { u.UserId, LoginType = u.Type });

            //article nodes 
            modelBuilder.Entity<Node>()
                .HasDiscriminator<string>(nameof(Node.Type))
                .HasValue<FolderNode>(nameof(FolderNode))
                .HasValue<BlogNode>(nameof(BlogNode));

            modelBuilder.Entity<Node>().HasIndex(nameof(Node.Type));
            modelBuilder.Entity<Node>().HasIndex(nameof(Node.Path)).IsUnique();
            modelBuilder.Entity<Node>().HasIndex(nameof(Node.Name));
            modelBuilder.Entity<Node>().HasIndex(nameof(Node.Shared));
            modelBuilder.Entity<Node>().HasIndex(nameof(Node.GroupShared));
            modelBuilder.Entity<Node>().HasIndex(nameof(Node.Created));
            modelBuilder.Entity<Node>().HasIndex(nameof(Node.Published));

            modelBuilder.Entity<Node>()
                .HasOne(a => a.User)
                .WithMany()
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<FolderNode>()
                .HasMany(b => b.Children)
                .WithOne(b => b.Parent!)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Node>()
                .HasOne(b => b.Reference)
                .WithMany()
                .OnDelete(DeleteBehavior.SetNull);

            var nodeId = "NodeId";
            var tagId = "TagId";
            modelBuilder.Entity<Node>()
             .HasMany(b => b!.Tags)
            .WithOne(t => t!.Node!)
            .HasForeignKey(tagId)
           .OnDelete(DeleteBehavior.Cascade);

            //tag
            modelBuilder.Entity<Tag>()
            .HasMany(t => t!.Nodes)
           .WithOne(t => t!.Tag!)
           .HasForeignKey(nodeId)
           .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Tag>()
             .HasAlternateKey(t => t!.Name);

            modelBuilder.Entity<NodeTag>().HasKey(nodeId, tagId);

            //blog
            modelBuilder.Entity<BlogNode>()
                .HasMany(b => b.Comments)
                .WithOne(c => c.Blog!)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<BlogNode>()
                .HasMany(b => b.Files)
                .WithOne(c => c.Blog!)
                .HasForeignKey("BlogId")
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<BlogFile>()
                .HasKey("FileId");
            modelBuilder.Entity<BlogFile>().HasOne(f => f.File)
                .WithMany().HasForeignKey("FileId");

            modelBuilder.Entity<BlogNode>()
                .HasMany(b => b.Solutions)
                .WithOne(c => c.SolutionTo!)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<BlogNode>()
                .HasOne(b => b.Detail)
                .WithOne(d => d!.Blog!).HasForeignKey<BlogDetail>("BlogId")
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<BlogDetail>().HasKey("BlogId");

            //comment
            modelBuilder.Entity<Comment>()
                .HasMany(c => c.Children)
                .WithOne(c => c.Parent!)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Detail)
                .WithOne().HasForeignKey<CommentDetail>(c => c.CommentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comment>()
                .HasOne(b => b.User)
                .WithMany()
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<FileResource>().HasAlternateKey(f => f.Path);
        }
    }
}