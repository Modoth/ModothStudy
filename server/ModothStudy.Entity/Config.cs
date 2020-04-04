using System;

namespace ModothStudy.Entity
{
    public class Config : IEntity<Guid>
    {
        public Guid Id { get; set; }

        public string? Key { get; set; }

        public string? DefaultValue { get; set; }


        public string? Value { get; set; }
    }

    public enum ConfigType
    {
        None,

        Boolean,

        Json,

        Image
    }

    [AttributeUsage(AttributeTargets.Field)]

    public class ConfigTypeAttribute : Attribute
    {
        public ConfigType ConfigType { get; private set; }
        public ConfigTypeAttribute(ConfigType configType)
        {
            ConfigType = configType;
        }
    }

    [AttributeUsage(AttributeTargets.Field)]

    public class PrivateConfigAttribute : Attribute
    {
    }
}