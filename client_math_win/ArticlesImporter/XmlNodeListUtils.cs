using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace ArticlesImporter
{
    public static class XmlNodeListUtils
    {
        public static XmlNode FirstOrDestult(this XmlNodeList list, Func<XmlNode, bool> filter)
        {
            foreach(XmlNode node in list)
            {
                if (filter(node))
                {
                    return node;
                }
            }
            return null;
        }

        public static XmlNode FirstOrDefaultChildOfName(this XmlNodeList list, string name)
        {
            return list.FirstOrDestult(n => n.Name == name);
        }
    }
}
