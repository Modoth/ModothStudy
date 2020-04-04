using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace ModothStudy.Entity
{

    public enum TagType
    {
        None = 0,

        Bool,

        String,

        Number,

        Enum,

        Url,

        Private
    }

    public class Tag : IEntity<Guid>
    {
        [Key] public Guid Id { get; set; }

        public string? Name { get; set; }

        public TagType Type { get; set; }

        public string? Values { get; set; }

        public ICollection<NodeTag>? Nodes { get; set; }
    }
}