using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModothStudy.Entity;
using ModothStudy.RepositoryInterface;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.CommonServices;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.Service.EntityServices
{
    public class FileService : IFileService
    {
        private IOperatorService _operatorService;
        private IConfigsService _configsService;

        private IFileContentRepository _fileRepository;

        private IRepository<FileResource, Guid> _fileResourceRepository;

        private HashSet<string> _validImageType = new HashSet<string> {
            "png",
            "jpeg",
            "jpg",
            "gif",
            "svg",
            "mp4"
        };

        public FileService(IOperatorService operatorService,
         IConfigsService configsService,
        IFileContentRepository fileRepository,
        IRepository<FileResource, Guid> fileResourceRepository)
        {
            _operatorService = operatorService;
            _configsService = configsService;
            _fileRepository = fileRepository;
            _fileResourceRepository = fileResourceRepository;
        }

        public Task<FileResource> CreateImageFile(Func<Stream, Task> file, string contentType, long length)
        {
            if(contentType == "application/octet-stream"){
                contentType = "image/png";
            }
            return CreateFile(file, _validImageType, contentType, length);
        }

        public async Task DeleteFile(string path)
        {
            _fileRepository.Delete(path);
            var file = await _fileResourceRepository.Retrieve().FirstOrDefaultAsync(f => f.Path == path);
            await _fileResourceRepository.Delete(file);
        }

        public async Task DeleteFiles(IEnumerable<FileResource> deletingFiles)
        {
            foreach (var f in deletingFiles)
            {
                _fileRepository.Delete(f.Path);
                await _fileResourceRepository.Delete(f, false);
            }
            await _fileResourceRepository.SaveChanges();
        }

        public async Task<Stream> RetrieveByPath(string fileName)
        {
            return await _fileRepository.RetrieveByPath(fileName);
        }

        private async Task<FileResource> CreateFile(Func<Stream, Task> file, HashSet<string> validFileType, string contentType, long length)
        {
            var types = contentType.ToLower().Trim().Split("/");
            if (types.Length != 2)
            {
                throw new ServiceException(nameof(ServiceMessages.ClientError));
            }
            var ext = types[1];
            var idx = ext.IndexOf('+');
            if (idx >= 0)
            {
                ext = ext.Substring(0, idx);
            }
            if (!validFileType.Contains(ext))
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidFileType));
            }
            await _operatorService.CheckOperator();
            if (file == null || string.IsNullOrWhiteSpace(contentType))
            {
                throw new ServiceException(nameof(ServiceMessages.ClientError));
            }
            var size = await _configsService.GetLongValue(nameof(AppConfigs.CONFIG_MAX_FILE_SIZE));
            if (length > size)
            {
                throw new ServiceException(nameof(ServiceMessages.FileToLarge));

            }
            var fileId = Guid.NewGuid();
            var filePath = await _fileRepository.Create(file, fileId.ToString(), ext);
            var fileItem = new FileResource { Id = fileId, Path = filePath, Created = DateTime.Now };
            await _fileResourceRepository.Create(fileItem);
            return fileItem;
        }
    }
}