using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace ModothStudy.Entity
{
    public class Comment : IEntity<Guid>
    {
        public BlogNode? Blog { get; set; }

        public ICollection<Comment>? Children { get; set; }

        public CommentDetail? Detail { get; set; }

        public Comment? Parent { get; set; }

        public User? User { get; set; }

        public Guid Id { get; set; }

        public DateTime Created { get; set; }
    }

    public class CommentDetail
    {
        [Key] public Guid CommentId { get; set; }

        public string? Content { get; set; }
    }
}