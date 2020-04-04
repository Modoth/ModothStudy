using System.Threading.Tasks;
using ModothStudy.Entity;

namespace ModothStudy.ServiceInterface.CommonServices
{
    public interface IOperatorService
    {
        Task<User?> Operator();

        Task<User> CheckOperator();
    }
}