using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ModothStudy.RepositoryInterface;
using ModothStudy.Service.Common;
using ModothStudy.ServiceInterface.AppServices;
using ModothStudy.ServiceInterface.CommonServices;
using ModothStudy.ServiceInterface.EntityServices;

namespace ModothStudy.Service.AppServices
{
    public class DataInitService : IDataInitService
    {
        private readonly IInitRepository _initRepository;

        private readonly IConfigsService _configsService;

        private readonly IDefaultConfigsService _defaultConfigsService;

        private readonly IRolesService _rolesService;
        private readonly IConfiguration _configuration;
        private readonly IUsersService _usersService;

        public DataInitService(IInitRepository initRepository, IConfigsService configsService,
        IDefaultConfigsService defaultConfigsService,
         IUsersService usersService, IRolesService rolesService,
         IConfiguration configuration)
        {
            _initRepository = initRepository;
            _configsService = configsService;
            _defaultConfigsService = defaultConfigsService;
            _usersService = usersService;
            _rolesService = rolesService;
            _configuration = configuration;
        }

        public async Task Init()
        {
            await _initRepository.Init();
            await InitUsers();
            await InitConfigs();
        }

        private string ReadPwd(int maxLength = 16)
        {
            string pass = "";
            while (maxLength-- > 0)
            {
                ConsoleKeyInfo key = Console.ReadKey(true);
                if (key.Key != ConsoleKey.Backspace && key.Key != ConsoleKey.Enter)
                {
                    pass += key.KeyChar;
                    Console.Write("*");
                }
                else
                {
                    if (key.Key == ConsoleKey.Backspace && pass.Length > 0)
                    {
                        pass = pass.Substring(0, (pass.Length - 1));
                        Console.Write("\b \b");
                    }
                    else if (key.Key == ConsoleKey.Enter)
                    {
                        break;
                    }
                }
            }
            return pass;
        }

        private async Task InitUsers()
        {
            var admRole = await _rolesService.GetOrAddAdmRole();
            var admUser = await _usersService.Users().Where(r => r.Role != null && r.Role.Id == admRole.Id)
                .FirstOrDefaultAsync();

            if (admUser == null)
            {
                var userName = "adm";
                var pwd = _configuration["DefaultPassword"];
                if (string.IsNullOrWhiteSpace(pwd))
                {
                    pwd = Guid.NewGuid().ToString().Substring(0, 8);
                    Console.WriteLine($"user: {userName}, pwd: {pwd}");
                }
                await _usersService.AddUser(userName, pwd, admRole);
            }
        }

        private async Task InitConfigs()
        {
            var configs = _defaultConfigsService.GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public)
            .ToDictionary(
                p => p.Name,
                p => (string)p.GetValue(_defaultConfigsService)
            );
            await _configsService.SetDefault(configs);
        }
    }
}