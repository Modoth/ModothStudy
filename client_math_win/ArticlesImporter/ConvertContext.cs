using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArticlesImporter
{
    public class ConvertContext
    {
        public IEnumerable<Article> Articles { get { return articles; } }
        private List<Article> articles = new List<Article>();

        private StringBuilder sb = null;
        private List<ArticleFile> files = null;

        public Dictionary<string, string> Resoures;

        public string TempBaseDir;

        public bool Start  { get{ return sb != null; } }

        public void NewArticle()
        {
            if (sb != null)
            {
                foreach(var f in files)
                {
                    sb.Append($"$$:{f.Name}$$");
                }
                articles.Add(new Article { Content = sb.ToString(), Files = files.ToArray() });
            }
            sb = new StringBuilder();
            files = new List<ArticleFile>();
        }

        public void Insert(string content)
        {
            if (!Start)
            {
                return;
            }
            sb.Append(content);
        }

        public void InsertFormula(string formula)
        {
            if (!Start)
            {
                return;
            }
            if (String.IsNullOrWhiteSpace(formula))
            {
                return;
            }
            formula.Replace("\r\n<math>", "");
            formula.Replace("</math>\r\n", "");
            sb.Append($"${formula}$");
        }

        public void InsertFile(string name, string path)
        {
            if (!Start)
            {
                return;
            }
            files.Add(new ArticleFile { Name = name, Path = path });
        }
    }
}
