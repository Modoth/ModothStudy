using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ModothStudy.Entity
{
    public class Node : IEntity<Guid>
    {
        public DateTime Created { get; set; }

        public DateTime Modified { get; set; }

        public string? Name { get; set; }

        public FolderNode? Parent { get; set; }

        public string? Type { get; set; }

        public User? User { get; set; }

        public Guid Id { get; set; }

        public string? Path { get; set; }

        public bool Shared { get; set; }

        public ICollection<NodeTag>? Tags { get; set; }

        public Node? Reference { get; set; }
    }

    public class NodeTag
    {
        public Tag? Tag { get; set; }

        public Node? Node { get; set; }

        public string? Value { get; set; }
    }

    public class FolderNode : Node
    {
        public ICollection<Node>? Children { get; set; }

        public string? Description { get; set; }
    }

    public class BlogNode : Node
    {
        public ICollection<Comment>? Comments { get; set; }

        public BlogDetail? Detail { get; set; }

        public BlogNode? SolutionTo { get; set; }

        public List<BlogFile>? Files { get; set; }

        public ICollection<BlogNode>? Solutions { get; set; }
    }    

    public class BlogDetail
    {
        [Key] public BlogNode? Blog { get; set; }

        public string? Content { get; set; }
    }

    public class BlogFile
    {
        public FileResource? File { get; set; }

        public int Order { get; set; }

        [Required] public BlogNode? Blog { get; set; }
    }
}