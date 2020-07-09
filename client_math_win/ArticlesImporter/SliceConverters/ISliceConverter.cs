using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace ArticlesImporter.SliceConverters
{
    public interface ISliceConverter
    {
        bool Handle(XmlNode node);

        bool Convert(XmlNode node, ConvertContext ctx);
    }
}
