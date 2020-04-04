using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModothStudy.App.Common;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.CommonServices;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.App.Controllers
{
    [Route("api/[controller]/[action]")]
    public class FilesController : Controller
    {
        [HttpPost]
        public async Task<ApiResult<string>> UploadFile([Required]IFormFile file,
        [FromServices] IFileService fileService
        )
        {
            var fileItem = await fileService.CreateImageFile(async (stream) =>
           {
               await file.CopyToAsync(stream);
           }, file.ContentType, file.Length);
            return fileItem.Path;
        }
    }
}
