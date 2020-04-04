using System.Threading.Tasks;

namespace ModothStudy.ServiceInterface.CommonServices
{
    public interface IMd2H5ConvertService
    {
        Task<string> Convert(string md);
    }
}