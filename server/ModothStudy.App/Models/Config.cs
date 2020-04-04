using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using ModothStudy.Entity;
using System.Reflection;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.Lang;
using System.Linq;

namespace ModothStudy.App.Models
{
    public class Configs
    {
        public AppConfigs AppConfigs { get; set; }

        public ServiceMessages ServiceMessages { get; set; }

        public PermissionDescriptions PermissionDescriptions { get; set; }

        public UILangs UILangs { get; set; }

    }
    public class ConfigItem
    {
        public Guid Id { get; set; }

        public string? Key { get; set; }

        public string? DefaultValue { get; set; }


        public string? Value { get; set; }

        public ConfigType? ConfigType;
    }

    public static class ConfigItemConverter
    {
        public static Expression<Func<Entity.Config, ConfigItem>> Selector = n =>
            new ConfigItem
            {
                Id = n.Id,
                Key = n.Key,
                DefaultValue = n.DefaultValue,
                Value = n.Value,
                ConfigType = AppConfigsUtils.ConfigTypes.ContainsKey(n.Key!) ? AppConfigsUtils.ConfigTypes[n.Key!] : ConfigType.None
            };

        public static Func<Entity.Config, ConfigItem> Convert = Selector.Compile();
        public static ConfigItem ToTagItem(this Entity.Config n) => Convert(n);

    }
}