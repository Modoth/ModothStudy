using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace ArticlesImporter.SliceConverters
{
    public class MathTypeConverter : ISliceConverter
    {

        public bool Convert(XmlNode node, ConvertContext ctx)
        {
            var srcNode = node.LastChild.ChildNodes.FirstOrDefaultChildOfName("v:shape");
            if(srcNode == null || srcNode.LastChild == null)
            {
                return false;
            }
            var id = srcNode.LastChild.Attributes["r:id"].Value;
            var conv = new FormulaConverter();
            var latex = conv.Convert(Path.Combine(ctx.TempBaseDir, "word", ctx.Resoures[id]));
            if(latex == null)
            {
                return false;
            }
            latex= latex.Replace("\r\n<math>", "");
            latex = latex.Replace("</math>\r\n", "");
            ctx.InsertFormula(latex);
            return true;
        }

        public bool Handle(XmlNode node)
        {
            return node != null && node.Name == "w:r" && node.LastChild != null && node.LastChild.Name == "w:object" ;
        }
    }
}
