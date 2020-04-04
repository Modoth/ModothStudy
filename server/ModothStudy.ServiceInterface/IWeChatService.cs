using System.Threading.Tasks;

namespace ModothStudy.ServiceInterface
{
    public interface IWeChatService
    {
        Task<string> GetOpenId(string code);
    }
}