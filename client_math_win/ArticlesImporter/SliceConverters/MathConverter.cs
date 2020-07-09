using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace ArticlesImporter.SliceConverters
{
    public class MathConverter : ISliceConverter
    {

        public bool Convert(XmlNode node, ConvertContext ctx)
        {
            var content = node.InnerText;
            ctx.InsertFormula(content);
            return true;
        }

        public bool Handle(XmlNode node)
        {
            return node != null && node.Name == "m:oMath";
        }
    }
}
