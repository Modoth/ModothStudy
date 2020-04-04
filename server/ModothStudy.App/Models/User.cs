using System;
using ModothStudy.Entity;

namespace ModothStudy.App.Models
{
    public class User
    {
        public string? Avatar { get; set; }

        public Guid Id { get; set; }

        public string? Name { get; set; }

        public string? NickName { get; set; }

        public Guid? RoleId { get; set; }

        public UserState State { get; set; }
    }

    public static class UserConverter
    {
        //TODO: use constructor
        public static User ToUser(this Entity.User user)
        {
            return new User
            {
                Id = user.Id,
                Name = user.Name!,
                NickName = user.NickName!,
                Avatar = user.Avatar,
                State = user.State,
                RoleId = user.Role?.Id
            };
        }
    }
}