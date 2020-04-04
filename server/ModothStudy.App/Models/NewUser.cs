using System;
using System.ComponentModel.DataAnnotations;

namespace ModothStudy.App.Models
{
    public class NewUser
    {
        [Required] public string? Name { get; set; }

        [Required] public string? Pwd { get; set; }

        public Guid? RoleId { get; set; }
    }
}