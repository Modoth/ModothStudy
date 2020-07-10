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
            var rPr = node.ChildNodes.FirstOrDefaultChildOfName("w:rPr");
            var isItalic = false;
            if (rPr != null && rPr.ChildNodes != null)
            {
                isItalic = rPr.ChildNodes.Has(n => n.Name == "w:i" || n.Name == "w:iCs");
            }
            ctx.Insert(content, isItalic);
            return true;
        }

        public bool Handle(XmlNode node)
        {
            return node != null && node.Name == "w:r" && node.LastChild != null && node.LastChild.Name == "w:t";
        }
    }
}
