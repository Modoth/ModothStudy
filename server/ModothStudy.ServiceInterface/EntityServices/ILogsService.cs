using System;
using System.Threading.Tasks;
using ModothStudy.Entity;

namespace ModothStudy.ServiceInterface.EntityServices
{
    public interface ILogsService
    {
        Task LogError(DateTime begin, DateTime end, String msg, String context);
    }
}