using System;
using System.Threading.Tasks;
using ModothStudy.Entity;
using ModothStudy.RepositoryInterface;
using ModothStudy.ServiceInterface.EntityServices;

namespace ModothStudy.Service.EntityServices
{
    public class LogsService : ILogsService
    {
        private readonly IRepository<Log, Guid> _logsRepository;

        public LogsService(IRepository<Log, Guid> logsRepository)
        {
            _logsRepository = logsRepository;
        }

        public async Task LogError(DateTime begin, DateTime end, String msg, String context)
        {
            var log = new Log
            {
                Begin = begin,
                End = end,
                Message = msg,
                Level = LogLevel.Error,
                Context = context
            };

            await _logsRepository.Create(log);
        }
    }
}