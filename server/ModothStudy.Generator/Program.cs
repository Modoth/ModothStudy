using System;
using System.IO;
using System.Linq;
using System.Reflection;

namespace ModothStudy.Generator
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            if (args.Length < 2)
            {
                return;
            }

            var solutionFolder = args[0];
            var relativeTargetFolder = args[1];
            var targetFolder = Path.Join(solutionFolder, relativeTargetFolder);
            var ns = relativeTargetFolder.Replace('/', '.').Replace('\\', '.');
            var generatorType = typeof(IGenerator);
            var generators = Assembly.GetExecutingAssembly().GetTypes()
                .Where(t => !t.IsAbstract && t.IsClass && t.GetInterfaces().Any(i => i == generatorType)).ToArray();

            if (!Directory.Exists(targetFolder))
            {
                Directory.CreateDirectory(targetFolder);
            }
            foreach (var generator in generators)
            {
                var gen = (IGenerator)Activator.CreateInstance(generator);
                gen.Generate(targetFolder, ns);
            }
        }
    }
}