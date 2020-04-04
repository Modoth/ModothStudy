namespace ModothStudy.Generator
{
    public interface IGenerator
    {
        string Type { get; }

        void Generate(string targetFolder, string ns);
    }
}