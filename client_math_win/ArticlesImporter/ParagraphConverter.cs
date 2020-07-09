using ArticlesImporter.SliceConverters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;

namespace ArticlesImporter
{
    public class ParagraphConverter
    {
        static  IEnumerable<ISliceConverter> Convs;
        static ParagraphConverter()
        {
            var convs = new List<ISliceConverter>();
            var iType = typeof(ISliceConverter);
            foreach(var type in typeof(ParagraphConverter).Assembly.GetTypes()){
                if(type.IsAbstract || !iType.IsAssignableFrom(type) || !type.IsClass)
                {
                    continue;
                }
                var ins = Activator.CreateInstance(type) as ISliceConverter;
                convs.Add(ins);
            }
            Convs = convs;
        }
        public void Convert(XmlNode node, ConvertContext ctx, Regex speReg)
        {
            var txt = node.InnerText;
            if (speReg.Match(txt).Success)
            {
                ctx.NewArticle();
            }
            if (!ctx.Start)
            {
                return;
            }
            foreach (XmlNode r in node.ChildNodes)
            {
                var conv = Convs.FirstOrDefault(c => c.Handle(r));
                if (conv == null || !conv.Convert(r, ctx))
                {
                    Console.WriteLine(r.OuterXml);
                }
            }
        }
    }
}
