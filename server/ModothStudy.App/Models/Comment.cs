using System;
using System.Linq.Expressions;

namespace ModothStudy.App.Models
{
    public class CommentItem
    {
        public Guid? Id { get; set; }

        public string? UserName { get; set; }

        public Guid? UserId { get; set; }

        public string? UserAvatar { get; set; }

        public string? Detail { get; set; }
    }

    public static class CommentItemConverter
    {
        public static Expression<Func<Entity.Comment, CommentItem>> Selector = n =>
            new CommentItem
            {
                Id = n.Id,
                UserName = n.User == null ? "" : n.User.NickName,
                UserId = n.User == null ? default(Guid?) : n.User.Id,
                UserAvatar = n.User == null ? default(string) : n.User.Avatar,
                Detail = n.Detail == null ? "" : n.Detail.Content
            };

        public static Func<Entity.Comment, CommentItem> Convert = Selector.Compile();
        public static CommentItem ToTagItem(this Entity.Comment n) => Convert(n);

    }
}