using System;
using System.ComponentModel.DataAnnotations;

namespace ModothStudy.Entity
{
    public class Log : IEntity<Guid>
    {
        [Required] public DateTime Begin { get; set; }

        [Required] public LogLevel Level { get; set; }

        public string? Context { get; set; }

        [Required] public DateTime End { get; set; }

        [Required] public string Message { get; set; } = String.Empty;

        [Key] public Guid Id { get; set; }
    }

    public enum LogLevel
    {
        None = 0,
        Warn = 1,
        Error = 2,
        Fatal = 3
    }
}