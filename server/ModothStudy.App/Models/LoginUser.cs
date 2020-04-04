using System;
using System.Collections.Generic;
using System.Linq;

namespace ModothStudy.App.Models
{
    public class LoginUser
    {
        public string? Avatar { get; set; }

        public string Name { get; set; }

        public string NickName { get; set; }

        public Dictionary<string, bool> Permissions { get; set; }

        public string? RoleName { get; set; }

        public Guid Id { get; set; }

        public LoginUser(Entity.User user, HashSet<string> permissions)
        {
            Name = user.Name!;
            NickName = user.NickName!;
            Avatar = user.Avatar;
            RoleName = user.Role?.Name;
            Permissions = permissions.ToDictionary(p => p, p => true);
            Id = user.Id;
        }
    }
}