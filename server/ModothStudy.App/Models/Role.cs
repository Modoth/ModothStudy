using System;
using System.Collections.Generic;

namespace ModothStudy.App.Models
{
    public class Role
    {
        public Guid Id { get; set; }

        public string? Name { get; set; }

        public Dictionary<string, bool>? Permissions { get; set; }
    }
}