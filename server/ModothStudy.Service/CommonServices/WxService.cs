using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModothStudy.Entity;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.CommonServices;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;
using Newtonsoft.Json;
using System.IO;
using System.Net;
using System.Net.Http.Headers;

namespace ModothStudy.Service.CommonServices
{
    public static class HttpClientUtils
    {
        public static async Task<T> PostAsync<T>(this HttpClient client, string requestUri, HttpContent content)
        where T : class
        {
            var res = await client.PostAsync(requestUri, content);
            var str = await res.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(str);
        }
    }

    public class WxService : IWxService
    {
        private class TokenData
        {
            [JsonProperty("access_token")]
            public string? AccessToken { get; set; }

            [JsonProperty("expires_in")]
            public int? ExpiresIn { get; set; }
        }
        private readonly Lazy<IConfigsService> m_ConfigsService;
        private readonly Lazy<IWxMenuConvertService> m_MenuConverter;

        private readonly Lazy<IFileService> m_FilesService;

        private readonly Lazy<IMd2H5ConvertService> m_Md2H5ConvertService;
        private static string m_Token = "";

        private static DateTime m_TokenExpriedTime = DateTime.MinValue;

        private static object m_TokenLock = new Object();

        private async Task<TokenData> GetTokenFromServer()
        {
            var urlTemplate = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_WX_API_URL_TOKEN));
            var appid = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_WX_APP_ID));
            var appSecret = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_WX_APP_SECRET));
            if (string.IsNullOrWhiteSpace(urlTemplate) || string.IsNullOrWhiteSpace(appid) || string.IsNullOrWhiteSpace(appSecret))
            {
                throw new ServiceException(nameof(ServiceMessages.SiteConfigError));
            }
            var url = urlTemplate!.Replace($"${nameof(AppConfigs.CONFIG_WX_APP_ID)}", appid)
            .Replace($"${nameof(AppConfigs.CONFIG_WX_APP_SECRET)}", appSecret);
            var client = new HttpClient();
            var res = await client.GetStringAsync(url);
            var data = JsonConvert.DeserializeObject<TokenData>(res);
            if (string.IsNullOrWhiteSpace(data.AccessToken) || data.ExpiresIn <= 0)
            {
                throw new ServiceException(nameof(ServiceMessages.ServerError));
            }
            return data;
        }

        private static Task<TokenData>? m_GettingToken;

        private async Task<string> GetToken()
        {
            if (!string.IsNullOrWhiteSpace(m_Token) && m_TokenExpriedTime < DateTime.Now)
            {
                return m_Token;
            }
            if (m_GettingToken == null)
            {
                m_GettingToken = GetTokenFromServer();
            }
            var data = await m_GettingToken;
            m_GettingToken = null;
            m_Token = data.AccessToken!;
            m_TokenExpriedTime = DateTime.Now.AddSeconds(data.ExpiresIn!.Value);
            return m_Token;
        }

        public WxService(Lazy<IConfigsService> configService, Lazy<IWxMenuConvertService> menuConverter
        , Lazy<IFileService> fileService,
        Lazy<IMd2H5ConvertService> md2H5ConvertService)
        {
            m_ConfigsService = configService;
            m_MenuConverter = menuConverter;
            m_FilesService = fileService;
            m_Md2H5ConvertService = md2H5ConvertService;
        }
        public async Task<bool> UpdateMenus(string? menus)
        {
            var wxEnabled = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_WX_ENABLED));
            if (string.IsNullOrWhiteSpace(wxEnabled))
            {
                return true;
            }
            var wxMenu = await ConvertMenus(menus);
            var client = new HttpClient();
            var urlTemplate = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_WX_API_URL_MENU));
            if (string.IsNullOrWhiteSpace(urlTemplate))
            {
                throw new ServiceException(nameof(ServiceMessages.SiteConfigError));
            }
            var token = await GetToken();
            var url = urlTemplate!.Replace("$ACCESS_TOKEN", token);
            var res = await client.PostAsync<WxRes>(url, new StringContent(wxMenu, Encoding.UTF8, "application/json"));
            return !res.HasError();
        }

        private async Task<string> ConvertMenus(string? menus)
        {
            var homeName = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_TITLE));
            var basicUrl = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_HOME_URL));
            return m_MenuConverter.Value.Convert(menus, basicUrl, homeName);
        }

        private async Task<string> ConvertWxArticle(string mdContent, Dictionary<string, string> images)
        {
            if (string.IsNullOrWhiteSpace(mdContent))
            {
                return mdContent;
            }
            if (images != null)
            {
                foreach (var pair in images)
                {
                    mdContent = mdContent.Replace(pair.Key, pair.Value);
                }
            }

            return await m_Md2H5ConvertService.Value.Convert(mdContent);
        }

        private async Task<string> BuildNews(int maxArticleCount, string defaultMediaId, string urlBase, IQueryable<Node> nodes)
        {
            var param = new WxUploadNewsParas();
            param.Articles = await nodes.OfType<BlogNode>().Take(maxArticleCount).Select(node =>
            new WxUploadNewsArticle
            {
                ThumbMedias = node.Files == null ? null :
                node.Files.Where(f => f.Order >= 0).OrderBy(f => f.Order).Select(f => f.File!.Path)
                .Where(p =>
                p.EndsWith("jpeg", StringComparison.CurrentCultureIgnoreCase)
                || p.EndsWith("jpg", StringComparison.CurrentCultureIgnoreCase)
                || p.EndsWith("gif", StringComparison.CurrentCultureIgnoreCase)
                || p.EndsWith("png", StringComparison.CurrentCultureIgnoreCase)).ToList(),
                Author = node.User == null ? String.Empty : node.User.Name,
                Title = node.Name,
                ContentSourceUrl = $"{urlBase}/library/view/{node.Id}",
                Content = node.Reference == null ? (node.Detail == null ? string.Empty : node.Detail.Content) :
                (node.Reference is BlogNode && ((BlogNode)node.Reference).Detail != null ? ((BlogNode)node.Reference).Detail.Content : string.Empty)
            }).ToArrayAsync();
            foreach (var a in param.Articles)
            {
                if (a.ThumbMedias == null || a.ThumbMedias.Count == 0)
                {
                    a.ThumbMediaId = defaultMediaId;
                }
                else
                {
                    var file = await m_FilesService.Value.RetrieveByPath(a.ThumbMedias[0]);
                    a.ThumbMediaId = (await Upload(Path.GetFileName(a.ThumbMedias[0]), file, WxUploadTypes.Thumb));
                }
                var images = new Dictionary<string, string>();
                foreach (var t in a.ThumbMedias!)
                {
                    try
                    {
                        var file = await m_FilesService.Value.RetrieveByPath(t);
                        images[t] = (await UploadImg(Path.GetFileName(t), file))!;
                    }
                    catch
                    {
                        images[t] = defaultMediaId;
                    }
                }
                a.Content = await ConvertWxArticle(a.Content!, images);
            }
            var content = JsonConvert.SerializeObject(param);
            return content;
        }

        public async Task<string?> UploadNews(IQueryable<Node> nodes)
        {
            var wxEnabled = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_WX_ENABLED));
            if (string.IsNullOrWhiteSpace(wxEnabled))
            {
                return null;
            }
            var urlBase = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_HOME_URL));
            if (string.IsNullOrWhiteSpace(urlBase))
            {
                throw new ServiceException(nameof(ServiceMessages.SiteConfigError));
            }
            var defaultMediaId = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_WX_SHARE_DEFAULT_THUMB_ID));
            if (string.IsNullOrWhiteSpace(defaultMediaId))
            {
                throw new ServiceException(nameof(ServiceMessages.SiteConfigError));
            }
            var maxArticleCount = await m_ConfigsService.Value.GetLongValue(nameof(AppConfigs.CONFIG_WX_SHARE_MAX_ARTICLE_COUNT)); ;
            var urlTemplate = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_WX_API_URL_UPLOAD_NEWS));
            if (string.IsNullOrWhiteSpace(urlTemplate))
            {
                throw new ServiceException(nameof(ServiceMessages.SiteConfigError));
            }
            var content = await BuildNews((int)maxArticleCount, defaultMediaId!, urlBase!, nodes);
            var client = new HttpClient();
            var token = await GetToken();
            var url = urlTemplate!.Replace("$ACCESS_TOKEN", token);
            var ret = await client.PostAsync<WxUploadNewsRes>(url, new StringContent(content, Encoding.UTF8, "application/json"));
            if (string.IsNullOrWhiteSpace(ret.MediaId))
            {
                throw new ServiceException(nameof(ServiceMessages.ServerError));
            }
            return ret.MediaId;
        }

        public async Task DeleteMsg(string msgId)
        {
            var wxEnabled = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_WX_ENABLED));
            if (string.IsNullOrWhiteSpace(wxEnabled))
            {
                throw new ServiceException(nameof(ServiceMessages.SiteConfigError));
            }
            var msgStr = JsonConvert.SerializeObject(new WxDeleteMsgParas
            {
                MsgId = msgId
            });
            var client = new HttpClient();
            var urlTemplate = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_WX_API_URL_DELETE_MSG));
            if (string.IsNullOrWhiteSpace(urlTemplate))
            {
                throw new ServiceException(nameof(ServiceMessages.SiteConfigError));
            }
            var token = await GetToken();
            var url = urlTemplate!.Replace("$ACCESS_TOKEN", token);
            var res = await client.PostAsync<WxRes>(url, new StringContent(msgStr, Encoding.UTF8, "application/json"));
            if (!res.HasError())
            {
                throw new ServiceException(nameof(ServiceMessages.ServerError));
            }
        }

        public async Task<string?> Send(string mediaId)
        {
            var wxEnabled = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_WX_ENABLED));
            if (string.IsNullOrWhiteSpace(wxEnabled))
            {
                throw new ServiceException(nameof(ServiceMessages.ServerError));
            }
            var perviewUserId = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_WX_API_PREVIEW_USERID));
            var msg = new WxSendParas
            {
                MpNews = new WxSendMpNews
                {
                    MediaId = mediaId
                }
            };
            var urlConfigName = string.Empty;
            if (string.IsNullOrWhiteSpace(perviewUserId))
            {
                msg.Filter = new WxSendFilter
                {
                    IsToAll = true
                };
                urlConfigName = nameof(AppConfigs.CONFIG_WX_API_URL_SENDALL);
            }
            else
            {
                msg.ToUser = perviewUserId;
                urlConfigName = nameof(AppConfigs.CONFIG_WX_API_URL_PREVIEW);
            }
            var msgStr = JsonConvert.SerializeObject(msg);
            var client = new HttpClient();
            var urlTemplate = await m_ConfigsService.Value.GetValueOrDefault(urlConfigName);
            if (string.IsNullOrWhiteSpace(urlTemplate))
            {
                throw new ServiceException(nameof(ServiceMessages.SiteConfigError));
            }
            var token = await GetToken();
            var url = urlTemplate!.Replace("$ACCESS_TOKEN", token);
            var res = await client.PostAsync<WxSendRes>(url, new StringContent(msgStr, Encoding.UTF8, "application/json"));
            if (res.HasError())
            {
                throw new ServiceException(nameof(ServiceMessages.ServerError));
            }
            return res.MsgId;
        }

        private async Task<T?> UploadFile<T>(string fileName, System.IO.Stream file, string urlConfig, string? type = null)
        where T : WxRes
        {
            using (var fs = file)
            {
                var wxEnabled = await m_ConfigsService.Value.GetValueOrDefault(nameof(AppConfigs.CONFIG_WX_ENABLED));
                if (string.IsNullOrWhiteSpace(wxEnabled))
                {
                    return null;
                }
                var urlTemplate = await m_ConfigsService.Value.GetValueOrDefault(urlConfig);
                if (string.IsNullOrWhiteSpace(urlTemplate))
                {
                    throw new ServiceException(nameof(ServiceMessages.SiteConfigError));
                }
                var msgStr = string.Empty;
                var token = await GetToken();
                var url = urlTemplate!.Replace("$ACCESS_TOKEN", token);
                if (!string.IsNullOrWhiteSpace(type))
                {
                    url = url.Replace("$TYPE", type);
                }
                var client = new HttpClient();
                var multiContent = BuildContent(fileName, fs);
                var res = await client.PostAsync<T>(url, multiContent);
                if (res.HasError())
                {
                    throw new ServiceException(nameof(ServiceMessages.ServerError));
                }
                return res;
            }
        }

        public async Task<string?> Upload(string fileName, System.IO.Stream file, string type)
        {
            var urlConfig = nameof(AppConfigs.CONFIG_WX_API_URL_UPLOAD);
            var res = await UploadFile<WxUploadRes>(fileName, file, urlConfig, type);
            if (res == null)
            {
                return null;
            }
            if (type == WxUploadTypes.Thumb)
            {
                return res.ThumbMediaId;
            }
            return res.MediaId;
        }

        public async Task<string?> UploadImg(string fileName, System.IO.Stream file)
        {
            var urlConfig = nameof(AppConfigs.CONFIG_WX_API_URL_UPLOAD_IMG);
            var res = await UploadFile<WxUploadImgRes>(fileName, file, urlConfig);
            if (res == null)
            {
                return null;
            }
            return res.Url;
        }


        private HttpContent BuildContent(string fileName, Stream file)
        {
            string boundary = "----" + DateTime.Now.Ticks.ToString("x");
            var content = new MultipartFormDataContent(boundary);
            var fileContent = new StreamContent(file);
            fileContent.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
            {
                Name = "\"media\"",
                FileName = "\"" + fileName + "\""
            };
            fileContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            content.Add(fileContent, "\"media\"", fileName);
            content.Headers.ContentType = MediaTypeHeaderValue.Parse(string.Format("multipart/form-data; boundary={0}", boundary));
            return content;
        }
    }

    public class WxDeleteMsgParas
    {
        [JsonProperty("msg_id")]
        public string? MsgId { get; set; }
    }

    public class WxSendParas
    {
        [JsonProperty("filter")]
        public WxSendFilter? Filter { get; set; }

        [JsonProperty("touser")]
        public string? ToUser { get; set; }

        [JsonProperty("mpnews")]
        public WxSendMpNews? MpNews { get; set; }

        [JsonProperty("msgtype")]
        public string MsgType { get; set; } = "mpnews";

        [JsonProperty("send_ignore_reprint")]
        public int SendIgnoreReprint { get; set; } = 0;
    }

    public class WxSendMpNews
    {
        [JsonProperty("media_id")]
        public string? MediaId { get; set; }

    }

    public class WxSendFilter
    {
        [JsonProperty("is_to_all")]
        public bool IsToAll { get; set; } = true;

    }


    public class WxUploadNewsArticle
    {
        [JsonIgnore]
        public List<string>? ThumbMedias { get; set; }

        [JsonProperty("thumb_media_id")]
        public string? ThumbMediaId { get; set; }

        [JsonProperty("author")]
        public string? Author { get; set; }

        [JsonProperty("title")]
        public string? Title { get; set; }

        [JsonProperty("content_source_url")]
        public string? ContentSourceUrl { get; set; }

        [JsonProperty("content")]
        public string? Content { get; set; }

        [JsonProperty("digest")]
        public string? Digest { get; set; }

        [JsonProperty("show_cover_pic")]
        public int? ShowCoverPic { get; set; } = 0;

        [JsonProperty("need_open_comment")]
        public int? NeedOpenComment { get; set; } = 0;

        [JsonProperty("only_fans_can_comment")]
        public int? OnlyFansCanComment { get; set; } = 0;
    }

    public class WxUploadNewsParas
    {
        [JsonProperty("articles")]
        public WxUploadNewsArticle[]? Articles { get; set; }
    }

    public class WxSendRes : WxRes
    {

        [JsonProperty("msg_id")]
        public string? MsgId { get; set; }
    }

    public class WxRes
    {
        public bool HasError()
        {
            return ErrorCode != null && ErrorCode.Value != 0;
        }

        [JsonProperty("errcode")]
        public int? ErrorCode { get; set; }

        [JsonProperty("errmsg")]
        public string? ErrorMessage { get; set; }
    }

    public class WxUploadImgRes : WxRes
    {
        [JsonProperty("url")]
        public string? Url { get; set; }
    }

    public class WxUploadRes : WxRes
    {
        [JsonProperty("thumb_media_id")]
        public string? ThumbMediaId { get; set; }

        [JsonProperty("media_id")]
        public string? MediaId { get; set; }
    }

    public class WxUploadNewsRes : WxRes
    {
        [JsonProperty("type")]
        public string? Type { get; set; }

        [JsonProperty("media_id")]
        public string? MediaId { get; set; }

        [JsonProperty("created_at")]
        public long? CreatedAt { get; set; }
    }
}