using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using ModothStudy.Service.Common;
using ModothStudy.Service.Interfaces;

namespace ModothStudy.Generator.Generators
{
    public class CachedClassGenerator : IGenerator
    {
        private static readonly string CacheServiceType = typeof(ICacheService).ToSourceCodeType();

        public void Generate(string targetFolder, string ns)
        {
            var types = typeof(CacheServiceAttribute).Assembly.GetTypes()
                .Where(t => t.GetCustomAttributes<CacheServiceAttribute>().Any());

            var services = new List<string>
            {
                $"namespace {ns}\n"
                + "{\n"
            };

            foreach (var type in types)
            {
                var typeName = type.ToSourceCodeType();
                var newTypeName = "Generated_" + typeName;
                newTypeName = newTypeName.Replace(".", "_");
                var classStr = GenerateType(type, typeName, newTypeName);
                services.Add(classStr);
            }

            services.Add("}\n");
            File.WriteAllText(Path.Join(targetFolder, "Services.generated.cs"), string.Empty); //todo : confilct with ef lazy loading. 
        }

        public string Type { get; } = "CachedClass";

        private string GenerateConstructor(Type type, string newTypeName)
        {
            var ci = type.GetConstructors()[0];
            var parameters = ci.GetParameters();
            var baseSign = MethodSign(parameters);
            var baseArgs = MethodArgs(parameters);
            var ctor =
                $"        public {newTypeName}({CacheServiceType} cacheService, {baseSign}): base({baseArgs})\n"
                + "        {\n"
                + "            _cacheService = cacheService;\n"
                + "        }\n";

            return ctor;
        }

        private string GenerateMethods(Type type)
        {
            var methods = type.GetMethods();
            var methodList = new List<string>();
            foreach (var method in methods)
            {
                var cacheServiceAttr = method.GetCustomAttribute<CacheServiceAttribute>();
                if (cacheServiceAttr == null)
                {
                    continue;
                }

                if (method.IsAbstract || method.IsStatic || method.IsPrivate)
                {
                    throw new Exception();
                }

                var retType = method.ReturnType.ToSourceCodeType();
                var isAsync = method.ReturnType.IsTaskType();
                var needReturn = method.ReturnType.NeedReturn();
                var methodBody =
                    $"            var cacheKey = {string.Join(" + ", new[] { $"\"{cacheServiceAttr.CacheKey}\"" }.Concat(cacheServiceAttr.Vars))};\n";

                var parameters = method.GetParameters();
                if (cacheServiceAttr.IsGet)
                {
                    methodBody +=
                        $"            return {(isAsync ? "await" : "")} _cacheService.GetOrAddAsync(cacheKey, () => base.{method.Name}({MethodArgs(parameters)}));\n";
                } else
                {
                    methodBody +=
                        $"            {(needReturn ? "var res = " : "")}{(isAsync ? "await " : "")} base.{method.Name}({MethodArgs(parameters)});\n"
                        + "            _cacheService.Remove(cacheKey);\n"
                        + (needReturn ? "            return res;\n" : "");
                }

                var methodStr =
                    $"        public override {(isAsync ? "async" : "")} {retType} {method.Name}({MethodSign(parameters)})\n"
                    + "        {\n"
                    + methodBody
                    + "        }\n";

                methodList.Add(methodStr);
            }

            return string.Join("\n", methodList);
        }

        private string GenerateType(Type type, string typeName, string newTypeName)
        {
            var ctor = GenerateConstructor(type, newTypeName);
            var methods = GenerateMethods(type);
            return $"    public class {newTypeName} : {typeName}\n"
                   + "    {\n"
                   + $"        private readonly {CacheServiceType} _cacheService;\n"
                   + ctor
                   + methods
                   + "    }\n";
        }

        private string MethodArgs(ParameterInfo[] parameters)
        {
            return string.Join(", ", parameters.Select(p => p.Name));
        }

        private string MethodSign(ParameterInfo[] parameters)
        {
            return string.Join(", ", parameters.Select(p => $"{p.ParameterType.ToSourceCodeType()} {p.Name}"));
        }
    }
}