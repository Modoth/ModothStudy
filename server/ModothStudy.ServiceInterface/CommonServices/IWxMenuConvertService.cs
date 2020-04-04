using System.Threading.Tasks;

namespace ModothStudy.ServiceInterface.CommonServices
{
    public interface IWxMenuConvertService
    {
        string Convert(string? menu, string? basicUrl, string? homeName);
    }
}