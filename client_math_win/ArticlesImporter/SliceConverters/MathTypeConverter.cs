using ArticlesImporter.Converts;
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
            if(srcNode == null)
            {
                return false;
            }
            var imgNode = srcNode.ChildNodes.FirstOrDefaultChildOfName("v:imagedata");
            var id = imgNode.Attributes["r:id"].Value;
            var conv = new FormulaConverter();
            var latex = conv.Convert(Path.Combine(ctx.TempBaseDir, "word", ctx.Resoures[id]));
            if(latex == null)
            {
                return false;
            }
            latex= latex.Replace("\r\n<math>", "");
            latex = latex.Replace("</math>\r\n", "");
            latex = latex.Replace("<math>", "");
            latex = latex.Replace("</math>", "");
            ctx.InsertFormula(latex);
            return true;
        }

        public bool Handle(XmlNode node)
        {
            return node != null && node.Name == "w:r" && node.LastChild != null && node.LastChild.Name == "w:object" ;
        }
    }
}
