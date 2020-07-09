using ArticlesImporter.Converters;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace ArticlesImporter.SliceConverters
{
    public class ImageConverter : ISliceConverter
    {

        public bool Convert(XmlNode node, ConvertContext ctx)
        {
            var archorNode = node.LastChild.ChildNodes.FirstOrDestult(n => n.Name == "wp:anchor" || n.Name == "wp:inline");
            if (archorNode == null)
            {
                return false;
            }
            var graphic = archorNode.ChildNodes.FirstOrDefaultChildOfName("a:graphic");
            if (graphic == null)
            {
                return false;
            }
            var blip = graphic.LastChild.LastChild.ChildNodes.FirstOrDefaultChildOfName("pic:blipFill");
            var id = blip.FirstChild.Attributes["r:embed"].Value;
            var path = Path.Combine(ctx.TempBaseDir, "word", ctx.Resoures[id]);
            if (string.Compare(Path.GetExtension(path), ".emf", true) == 0)
            {
                var newPath = path + ".png";
                var converter = new EmfToPngConverter();
                converter.Convert(path, newPath);
                path = newPath;
            }
            ctx.InsertFile(id + ".png", path);
            return true;
        }

        public bool Handle(XmlNode node)
        {
            return node != null && node.Name == "w:r" && node.LastChild != null && node.LastChild.Name == "w:drawing";
        }
    }
}
