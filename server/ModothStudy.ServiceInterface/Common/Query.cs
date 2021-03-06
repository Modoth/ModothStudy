using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace ModothStudy.ServiceInterface.Common
{
    public class Query
    {
        public string? Parent { get; set; }

        public Condition? Where { get; set; }

        public string? OrderBy { get; set; }

        public bool? OrderByDesc { get; set; }

    }

    public enum ConditionType
    {
        None,
        And,
        Not,
        Or,
        Has,
        Equal,
        Contains,
        StartsWith,
        EndsWith,
        GreaterThan,
        GreaterThanOrEqual,
        LessThenOrEqual

    }

    public class Condition
    {
        public ConditionType Type { get; set; }

        public string? Prop { get; set; }

        public string? Value { get; set; }

        public Condition[]? Children { get; set; }
    }
}