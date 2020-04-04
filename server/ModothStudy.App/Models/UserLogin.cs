using System.ComponentModel.DataAnnotations;

namespace ModothStudy.App.Models
{
    public class UserLogin
    {
        [Required] public string? Name { get; set; }

        [Required] public string? Password { get; set; }
    }

    public class NewPwd
    {
        [Required] public string? OldPassword { get; set; }
        [Required] public string? Password { get; set; }
    }
}