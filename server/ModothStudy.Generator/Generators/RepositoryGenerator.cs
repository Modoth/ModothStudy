using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ModothStudy.Entity;

namespace ModothStudy.Generator.Generators
{
    public class RepositoryGenerator : IGenerator
    {
        private static readonly Type EntityInterfaceType = typeof(IEntity<>);

        public void Generate(string targetFolder, string ns)
        {
            var entityTypes = EntityInterfaceType.Assembly.GetTypes().Where(t =>
                    !t.IsAbstract && t.IsClass && !t.IsGenericType &&
                    t.GetInterfaces().Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == EntityInterfaceType))
                .ToArray();

            var dbsets = new List<string>();
            var repositories = new List<string>
            {
                "using System;\n"
                + "using Microsoft.EntityFrameworkCore;\n"
                + "using ModothStudy.Entity;\n"
                + "using ModothStudy.Repository;\n"
                + $"namespace {ns}\n"
                + "{\n"
            };

            foreach (var entityType in entityTypes)
            {
                var repositoryName = entityType.Name + "sRepository";
                var entityKeyType = entityType.GetInterfaces()[0].GetGenericArguments()[0];
                repositories.Add(GenerateRepository(repositoryName, entityType.Name, entityKeyType.Name));
                dbsets.Add($"        public DbSet<{entityType.Name}> {entityType.Name}s {{ get; set; }}\n");
            }

            repositories.Add("}\n");
            File.WriteAllText(Path.Join(targetFolder, "Repositories.generated.cs"), string.Join('\n', repositories));
            var dataContext = "using Microsoft.EntityFrameworkCore;\n"
                              + "using ModothStudy.Entity;\n"
                              + "using ModothStudy.Repository;\n"
                              + $"namespace {ns}\n"
                              + "{\n"
                              + "    public class DataContext : DataContextBase\n"
                              + "    {\n"
                              + "        public DataContext(DbContextOptions<DataContext> options) : base(options) { }\n"
                              + string.Join("", dbsets)
                              + "}\n"
                              + "}\n";

            File.WriteAllText(Path.Join(targetFolder, "DataContext.generated.cs"), dataContext);
        }

        public string Type { get; } = "Repository";

        private static string GenerateRepository(string repositoryType, string entity, string entityKey)
        {
            return
                $"    public class {repositoryType} : Repository<{entity}, {entityKey}> \n"
                + "    {\n"
                + $"        public {repositoryType}(DataContext context) : base(context)\n"
                + "        {\n"
                + "        }\n"
                + $"        protected override DbSet<{entity}> Entities => ((DataContext)Context).{entity}s;\n"
                + "    }\n";
        }
    }
}