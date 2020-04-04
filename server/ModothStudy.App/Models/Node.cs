using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace ModothStudy.App.Models
{
    public enum NodeItemType
    {
        None = 0,
        Folder,
        Blog,
        Reference
    }

    public class NodeUser
    {
        public Guid Id { get; set; }

        public string? Name { get; set; }

        public string? NickName { get; set; }

        public string? Avatar { get; set; }
    }

    public class NodeTag
    {
        public Guid? Id { get; set; }

        public string? Name { get; set; }

        public Entity.TagType Type { get; set; }

        public string? Value { get; set; }

        public string? Values { get; set; }
    }

    public class NodeReference
    {
        public Guid? Id { get; set; }

        public NodeItemType? Type { get; set; }

        public string? Content { get; set; }

        public IEnumerable<NodeTag>? Tags { get; set; }
    }

    public class NodeItem
    {
        public Guid? Id { get; set; }

        public NodeReference? Reference { get; set; }

        public DateTime Created { get; set; }

        public DateTime Modified { get; set; }

        public string? Name { get; set; }

        public bool HasSolution { get; set; }

        public Guid? SolutionToId { get; set; }

        public string? SolutionTo { get; set; }

        public string? Path { get; set; }

        public NodeItemType Type { get; set; }

        public NodeUser? User { get; set; }

        public string? Content { get; set; }

        public bool Shared { get; set; }

        public IEnumerable<NodeTag>? Tags { get; set; }

    }

    public static class NodeItemConverter
    {
        public static Expression<Func<Entity.Node, NodeItem>> Selector = n =>
            new NodeItem
            {
                Name = n.Name,
                Path = n.Path,
                Id = n.Id,
                Shared = n.Shared,
                Created = n.Created,
                Modified = n.Modified,
                HasSolution = n is Entity.BlogNode && ((Entity.BlogNode)n).Solutions != null && ((Entity.BlogNode)n).Solutions.Any(s => s.User == n.User),
                SolutionToId = n is Entity.BlogNode && ((Entity.BlogNode)n).SolutionTo != null ?
                ((Entity.BlogNode)n).SolutionTo.Id : default(Guid?),
                SolutionTo = n is Entity.BlogNode && ((Entity.BlogNode)n).SolutionTo != null ?
                ((Entity.BlogNode)n).SolutionTo.Name : default(string?),
                Type = n is Entity.FolderNode ? NodeItemType.Folder :
                n is Entity.BlogNode ? NodeItemType.Blog
                : NodeItemType.None,
                User = n.User == null ? null : new NodeUser { Name = n.User.Name, Id = n.User.Id, NickName = n.User.NickName, Avatar = n.User.Avatar },
                Content = n is Entity.BlogNode && ((Entity.BlogNode)n).Detail != null
                ? ((Entity.BlogNode)n).Detail.Content
                : null,
                Reference = n.Reference != null ? new NodeReference
                {
                    Id = n.Reference.Id,
                    Type = n.Reference is Entity.FolderNode ? NodeItemType.Folder :
            n.Reference is Entity.BlogNode ? NodeItemType.Blog
            : NodeItemType.None,
                    Content = n.Reference is Entity.BlogNode && ((Entity.BlogNode)n.Reference).Detail != null
                ? ((Entity.BlogNode)n.Reference).Detail.Content
                : null,
                    Tags = n.Reference.Tags == null ? null : n.Reference.Tags.Select(t => new NodeTag
                    {
                        Id = t.Tag!.Id,
                        Name = t.Tag!.Name,
                        Type = t.Tag!.Type,
                        Value = t.Value,
                        Values = t.Tag!.Values
                    })
                } : null,
                Tags = n.Tags == null ? null : n.Tags.Select(t => new NodeTag
                {
                    Id = t.Tag!.Id,
                    Name = t.Tag!.Name,
                    Type = t.Tag!.Type,
                    Value = t.Value,
                    Values = t.Tag!.Values
                }
                    )
            };

        public static Expression<Func<Entity.Node, NodeItem>> SummarySelector = n =>
        new NodeItem
        {
            Name = n.Name,
            Id = n.Id,
            Path = n.Path,
            Type = n is Entity.FolderNode ? NodeItemType.Folder :
            n is Entity.BlogNode ? NodeItemType.Blog
            : NodeItemType.None,
            Tags = n.Tags == null ? null : n.Tags.Select(t => new NodeTag
            {
                Id = t.Tag!.Id,
                Name = t.Tag!.Name,
                Type = t.Tag!.Type,
                Value = t.Value,
                Values = t.Tag!.Values
            }),
            Reference = n.Reference != null ? new NodeReference
            {
                Id = n.Reference.Id,
                Type = n.Reference is Entity.FolderNode ? NodeItemType.Folder :
            n.Reference is Entity.BlogNode ? NodeItemType.Blog
            : NodeItemType.None
            } : null,
        };

        public static Func<Entity.Node, NodeItem> Convert = Selector.Compile();
        public static NodeItem ToNodeItem(this Entity.Node n) => Convert(n);

    }
}
