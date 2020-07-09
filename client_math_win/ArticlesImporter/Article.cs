using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArticlesImporter
{
    public class Article
    {
        public string Content { get; set; }

        public ArticleFile[] Files { get; set; }
    }

    public class ArticleFile
    {
        public string Name { get; set; }

        public string Path { get; set; }
    }
}
