using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ModothStudy.Entity
{
    public enum UserState
    {
        ToApprove = 0,

        Normal,

        Disabled
    }

    public class UserLogin
    {
        public string? Type { get; set; }

        public Guid UserId { get; set; }
    }

    public class PwdLogin : UserLogin
    {
        public PwdLogin()
        {
            Type = nameof(PwdLogin);
        }
        [Required] public string? Password { get; set; }
    }

    public class WeChatLogin : UserLogin
    {
        public WeChatLogin()
        {
            Type = nameof(WeChatLogin);
        }
        [Required] public Guid AppId { get; set; }
    }


    public class User : IEntity<Guid>
    {
        public string? Avatar { get; set; }

        [Required] public DateTime Created { get; set; }

        [Required] public string? Name { get; set; }

        [Required] public string? NickName { get; set; }

        public Role? Role { get; set; }

        public UserState State { get; set; }

        public ICollection<UserLogin>? UserLogins { get; set; }

        [Key] public Guid Id { get; set; }
    }
}