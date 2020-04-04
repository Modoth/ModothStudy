using System;
using System.ComponentModel.DataAnnotations;

namespace ModothStudy.Entity
{
    public class FileResource : IEntity<Guid>
    {
        [Key] public Guid Id { get; set; }

        public string Path { get; set; } = string.Empty;

        public DateTime Created { get; set; }
    }
}