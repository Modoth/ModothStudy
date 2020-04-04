using System.Collections.Generic;

namespace ModothStudy.App.Models
{
    public class NodeDir
    {
        public IEnumerable<NodeItem>? Subnodes { get; set; }
        public IEnumerable<NodeItem>? Supnodes { get; set; }

    }
}