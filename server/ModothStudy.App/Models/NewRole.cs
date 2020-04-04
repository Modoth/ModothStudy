using System;
using System.ComponentModel.DataAnnotations;

namespace ModothStudy.App.Models
{
    public class NewRole
    {
        public Guid? BaseRoleId { get; set; }

        [Required] public string? Name { get; set; }
    }
}