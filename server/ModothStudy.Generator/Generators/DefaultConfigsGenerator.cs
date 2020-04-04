using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using ModothStudy.Service.Common;
using ModothStudy.Service.Interfaces;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.CommonServices;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.Generator.Generators
{
    public class DefaultConfigsGenerator : IGenerator
    {
        public string Type => "DefaultConfigs";

        public void Generate(string targetFolder, string ns)
        {
            var types = typeof(CacheServiceAttribute).Assembly.GetTypes()
                .Where(t => t.GetCustomAttributes<CacheServiceAttribute>().Any());
            var iname = typeof(IDefaultConfigsService).FullName;
            var cn = nameof(IDefaultConfigsService).Substring(1);
            var sb = new List<string>
            {
                $"namespace {ns}\n"
                + "{\n"
                + $"    public partial class {cn} : {iname}\n"
                + "    {\n"
            };

            foreach (var name in Enum.GetNames(typeof(ServiceMessages))
            .Concat(Enum.GetNames(typeof(PermissionDescriptions)))
            .Concat(Enum.GetNames(typeof(UILangs)))
            .Concat(Enum.GetNames(typeof(AppConfigs))))
            {
                sb.Add($"        public string {name} {{get;set;}}\n");
            }

            sb.Add(
                "    }\n"
                + "}\n"
                );
            File.WriteAllText(Path.Join(targetFolder, $"{cn}.cs"), String.Join("", sb)); //todo : confilct with ef lazy loading. string.Join('\n', services)
        }
    }
}