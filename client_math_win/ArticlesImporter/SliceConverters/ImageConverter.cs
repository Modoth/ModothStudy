﻿using System;
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
            var archorNode = node.LastChild.ChildNodes.FirstOrDefaultChildOfName("wp:anchor");
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
            ctx.InsertFile(id + ".png", Path.Combine(ctx.TempBaseDir, "word", ctx.Resoures[id]));
            return true;
        }

        public bool Handle(XmlNode node)
        {
            return node != null && node.Name == "w:r" && node.LastChild != null && node.LastChild.Name == "w:drawing";
        }
    }
}
