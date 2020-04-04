using System;
using System.IO;
using System.Threading.Tasks;
using ModothStudy.RepositoryInterface;

namespace ModothStudy.Repository
{
    public class FileContentRepository : IFileContentRepository
    {
        private string baseDir;

        private string fileDir;

        public FileContentRepository()
        {
            baseDir = AppDomain.CurrentDomain.BaseDirectory;
            fileDir = "/files";
        }

        private string GetFilePath(string fileName)
        {
            return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, fileName.Substring(1));
        }

        public async Task<Stream> RetrieveByPath(string fileName)
        {
            await Task.Delay(0);
            if (!fileName.StartsWith(fileDir))
            {
                throw new Exception();
            }
            var filePath = GetFilePath(fileName);
            if (!File.Exists(filePath))
            {
                throw new Exception();
            }
            return File.OpenRead(filePath);
        }

        public async Task<string> Create(Func<Stream, Task> file, string fileName, string fileExt)
        {
            var imgPath = Path.Combine(fileDir, fileName + "." + fileExt);
            var filePath = GetFilePath(imgPath);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file(stream);
            }
            return imgPath;
        }

        public bool Exists(string fileName)
        {
            if (!fileName.StartsWith(fileDir))
            {
                return false;
            }
            var filePath = GetFilePath(fileName);
            return File.Exists(filePath);
        }

        public void Delete(string fileName)
        {
            if (!fileName.StartsWith(fileDir))
            {
                throw new Exception();
            }
            var filePath = GetFilePath(fileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}