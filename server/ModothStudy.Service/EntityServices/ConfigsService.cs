using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModothStudy.Entity;
using ModothStudy.RepositoryInterface;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.CommonServices;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.Service.EntityServices
{
    public class ConfigsService : IConfigsService
    {
        static ConfigsService()
        {
            _privateKeys = new HashSet<string>();
            var fileds = typeof(AppConfigs).GetFields();
            foreach (var field in fileds)
            {
                var type = field.GetCustomAttribute<PrivateConfigAttribute>();
                if (type != null)
                {
                    _privateKeys.Add(field.Name);
                }
            }
        }
        private readonly IRepository<Config, Guid> _configsRepository;
        private readonly IFileContentRepository _fileRepository;

        private readonly IOperatorService _operatorService;

        private static readonly ISet<string> _privateKeys;

        public ConfigsService(IRepository<Config, Guid> configsRepository,
       IFileContentRepository fileRepository,
        IOperatorService operatorService)
        {
            _configsRepository = configsRepository;
            _fileRepository = fileRepository;
            _operatorService = operatorService;
        }

        public async Task<Dictionary<string, string>> All()
        {
            return await _configsRepository.Retrieve()
            .Select(l => new { l.Key, Value = l.Value == null ? l.DefaultValue : l.Value })
            .Where(l => !_privateKeys.Contains(l.Key!))
            .ToDictionaryAsync(l => l.Key, l => l.Value);
        }

        public IQueryable<Config> AllConfigs(string? filter)
        {
            var configs = _configsRepository.Retrieve();
            if (!string.IsNullOrWhiteSpace(filter))
            {
                configs = configs.Where(l => l.Key!.Contains(filter, StringComparison.InvariantCultureIgnoreCase));
            }
            return configs;
        }

        public async Task Reset()
        {
            var configs = await _configsRepository.Retrieve().ToListAsync();
            configs.ForEach(l => l.Value = null);
            await _configsRepository.Update(configs);
        }

        public async Task<Config> ResetValue(Guid id)
        {
            var config = await this.CheckLang(id);
            config.Value = null;
            await _configsRepository.Update(config);
            return config;
        }

        public async Task SetDefault(Dictionary<string, string> configs)
        {
            var oldConfigs = await _configsRepository.Retrieve().ToDictionaryAsync(l => l.Key);
            var toUpdates = new List<Config>();
            var toCreates = new List<Config>();
            foreach (var p in configs)
            {
                if (oldConfigs.ContainsKey(p.Key))
                {
                    var config = oldConfigs[p.Key];
                    config.DefaultValue = p.Value;
                    toUpdates.Add(config);
                }
                else
                {
                    toCreates.Add(new Config { Key = p.Key, DefaultValue = p.Value });
                }
            }

            await _configsRepository.Update(toUpdates, false);
            await _configsRepository.Create(toCreates);
        }

        public async Task<Config> UpdateValue(Guid id, string value)
        {
            var config = await this.CheckLang(id);
            config.Value = value;
            await _configsRepository.Update(config);
            return config;
        }

        public async Task<long> GetLongValue(string key)
        {
            var value = await GetValueOrDefault(key);
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ServiceException(nameof(ServiceMessages.SiteConfigError));
            }
            long lValue;
            if (long.TryParse(value, out lValue))
            {
                return lValue;
            }
            throw new ServiceException(nameof(ServiceMessages.SiteConfigError));
        }

        public async Task<string?> GetValueOrDefault(string key)
        {
            var config = await _configsRepository.Retrieve().Where(l => l.Key == key).FirstOrDefaultAsync();
            if (config == null)
            {
                throw new ServiceException(nameof(ServiceMessages.ServerError));
            }
            return config.Value ?? config.DefaultValue;

        }

        private async Task<Config> CheckLang(Guid id)
        {
            var config = await _configsRepository.Retrieve().Where(l => l.Id == id).FirstOrDefaultAsync();
            if (config == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchLang));
            }
            return config;
        }
    }
}