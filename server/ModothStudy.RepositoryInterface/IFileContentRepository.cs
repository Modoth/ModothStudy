using System;
using System.IO;
using System.Threading.Tasks;

namespace ModothStudy.RepositoryInterface
{
    public interface IFileContentRepository
    {
        Task<string> Create(Func<Stream, Task> file, string fileName, string fileExt);

        void Delete(string fileName);

        bool Exists(string fileName);

        Task<Stream> RetrieveByPath(string fileName);
    }
}