using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ModothStudy.ServiceInterface.CommonServices;
using Newtonsoft.Json;

namespace ModothStudy.Service.CommonServices
{
    public class Md2H5ConvertService : IMd2H5ConvertService
    {
        public async Task<string> Convert(string md)
        {
            await Task.Delay(0);
            return Markdig.Markdown.ToHtml(md);
        }
    }
}