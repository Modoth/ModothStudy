using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;

namespace ArticlesImporter
{
    public class ArticleConverter
    {
		private Dictionary<string, string> LoadResources(string basePath)
		{
			var xmlPath = Path.Combine(basePath, "word", "_rels", "document.xml.rels");
			var res = new Dictionary<string, string>();
			var doc = new XmlDocument();
			doc.Load(xmlPath);
			foreach (XmlNode r in doc.ChildNodes[1].ChildNodes)
			{
				res.Add(r.Attributes["Id"].Value, r.Attributes["Target"].Value);
			}
			return res;
		}

		public IEnumerable<Article> Convert(string fIn, Regex speReg, Action<float> onprogress)
        {
			var baseDir = Path.Combine(Path.GetTempPath(), Path.GetFileName(fIn));
			if (Directory.Exists(baseDir))
			{
				Directory.Delete(baseDir, true);
			}
			if (File.Exists(baseDir))
			{
				File.Delete(baseDir);
			}
			Directory.CreateDirectory(baseDir);
			ZipFile.ExtractToDirectory(fIn, baseDir);
			var xmlPath = Path.Combine(baseDir, "word", "document.xml");
			var doc = new XmlDocument();
			doc.Load(xmlPath);
			var pars = doc.ChildNodes[1].ChildNodes[0];

			var ctx = new ConvertContext
			{
				Resoures = LoadResources(baseDir),
				TempBaseDir = baseDir
			};
			var paragraphConv = new ParagraphConverter();
			float idx = 0;
			foreach (XmlNode par in pars.ChildNodes)
			{
				paragraphConv.Convert(par, ctx, speReg);
				onprogress(idx / pars.ChildNodes.Count);
				idx++;
			}
			ctx.NewArticle();
			return ctx.Articles;

        }
    }
}
