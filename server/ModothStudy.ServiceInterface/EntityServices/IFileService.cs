using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using ModothStudy.Entity;

namespace ModothStudy.ServiceInterface.EntityServices
{
    public interface IFileService
    {
        Task<FileResource> CreateImageFile(Func<Stream, Task> file, string contentType, long length);

        Task DeleteFile(string path);

        Task DeleteFiles(IEnumerable<FileResource> deletingFiles);

        Task<Stream> RetrieveByPath(string fileName);
    }
}