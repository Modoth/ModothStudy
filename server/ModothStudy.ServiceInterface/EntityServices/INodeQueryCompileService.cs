using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using ModothStudy.Entity;
using ModothStudy.ServiceInterface.Common;

namespace ModothStudy.ServiceInterface.EntityServices
{
    public class NodeParentId
    {
        public String? Path { get; set; }

        public Guid UserId { get; set; }
    }
    public interface INodeQueryCompileService
    {
        Expression<Func<Node, bool>> Compile(IEnumerable<NodeParentId>? ins, Query? query);
    }
}