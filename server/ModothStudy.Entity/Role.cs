using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace ModothStudy.Entity
{
    public class RolePermission
    {
        public string? Permission { get; set; }

        public Guid RoleId { get; set; }
    }

    public class Role : IEntity<Guid>
    {
        [Required] public string? Name { get; set; }

        public ICollection<RolePermission>? Permissions { get; set; }

        public ICollection<User>? Users { get; set; }

        [Key] public Guid Id { get; set; }
    }
}