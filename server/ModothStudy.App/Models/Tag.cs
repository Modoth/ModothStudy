using System;
using System.Linq.Expressions;
using ModothStudy.Entity;

namespace ModothStudy.App.Models
{
    public class TagItem
    {
        public Guid Id { get; set; }

        public string? Name { get; set; }

        public TagType Type { get; set; }

        public string? Values { get; set; }
    }

    public static class TagItemConverter
    {
        public static Expression<Func<Entity.Tag, TagItem>> Selector = n =>
            new TagItem
            {
                Id = n.Id,
                Name = n.Name,
                Type = n.Type,
                Values = n.Values
            };

        public static Func<Entity.Tag, TagItem> Convert = Selector.Compile();
        public static TagItem ToTagItem(this Entity.Tag n) => Convert(n);

    }
}