using System;
using System.Linq.Expressions;


public class Blog
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public string? Content { get; set; }

    public string? Name { get; set; }
}

public static class BlogConverter
{
    public static Expression<Func<ModothStudy.Entity.BlogNode, Blog>> BlogSelector = b => new Blog
    {
        UserId = b.User == null ? default : b.User.Id,
        Id = b.Id,
        Name = b.Name,
        Content = b.Detail == null ? null : b.Detail.Content
    };
}