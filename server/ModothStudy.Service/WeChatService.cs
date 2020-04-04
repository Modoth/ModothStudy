using System.Net.Http;
using System.Threading.Tasks;
using ModothStudy.ServiceInterface;
using Newtonsoft.Json;

namespace ModothStudy.Service
{
    public class WeChatService : IWeChatService
    {
        private static readonly string AccessTokenUrl =
            "https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code";

        public async Task<string> GetOpenId(string code)
        {
            var client = new HttpClient();
            var res = await client.GetStringAsync(AccessTokenUrl);
            var a = JsonConvert.DeserializeObject(res);
            return a.ToString();
        }
    }
}