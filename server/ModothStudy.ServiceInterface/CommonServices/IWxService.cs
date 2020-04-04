using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ModothStudy.Entity;

namespace ModothStudy.ServiceInterface.CommonServices
{
    public interface IWxService
    {
        Task<bool> UpdateMenus(string? menus);

        Task<string?> UploadNews(IQueryable<Node> nodes);

        Task<string?> Send(string mediaId);

        Task DeleteMsg(string msgId);

        Task<string?> Upload(string fileName, Stream file, string type);
    }

    public static class WxUploadTypes
    {
        public static readonly string Thumb = "thumb";

        public static readonly string Image = "image";
    }
}