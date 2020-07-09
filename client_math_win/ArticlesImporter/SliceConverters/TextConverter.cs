using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace ArticlesImporter.SliceConverters
{
    public class TextConverter : ISliceConverter
    {

        public bool Convert(XmlNode node, ConvertContext ctx)
        {
            var content = node.LastChild.InnerText;
            ctx.Insert(content);
            return true;
        }

        public bool Handle(XmlNode node)
        {
            return node != null && node.Name == "w:r" && node.LastChild != null && node.LastChild.Name == "w:t";
        }
    }
}
