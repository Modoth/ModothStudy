using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ModothStudy.Entity;

namespace ModothStudy.ServiceInterface.EntityServices
{
    public interface IConfigsService
    {
        Task<Dictionary<string, string>> All();

        Task Reset();

        Task<long> GetLongValue(string key);

        Task<string?> GetValueOrDefault(string key);

        Task SetDefault(Dictionary<string, string> configs);

        Task<Config> UpdateValue(Guid id, string value);

        Task<Config> ResetValue(Guid id);

        IQueryable<Entity.Config> AllConfigs(string? filter);

    }
}