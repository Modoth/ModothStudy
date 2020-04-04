using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.Web.Generated
{
    public partial class DefaultConfigsService
    {
        public DefaultConfigsService()
        {
            ClientError = "内部错误";
            ConflictRoleName = "名称重复";
            ConflictNodeName = "名称重复";
            ConflictUserName = "名称重复";
            InvalidPwd = "无效密码";
            PwdDescription = "8-16位数字，大、小写字母或特殊符号";
            InvalidRoleName = "无效名称";
            InvalidUserName = "无效名称";
            InvalidNodeName = "无效名称";
            InvalidUserState = "无效状态";
            NeedRelogin = "请先登录";
            NoPermission = "没有权限";
            NoSuchBaseRole = "无此角色";
            NoSuchPermission = "无此权限";
            NoSuchRole = "无此角色";
            NoSuchUser = "无此用户";
            NotLogin = "未登录";
            ServerError = "内部错误";
            UserOrPwdError = "用户名或密码错误";
            NoSuchFolder = "无此文件夹";
            NoSuchNode = "无此节点";
            InvalidFileType = "无效文件类型";
            Library = "浏览";
            Name = "名称";
            UserName = "用户名";
            Password = "密码";
            PERMISSION_MANAGE = "管理";
            User = "用户";
            Manage = "管理";
            User = "用户";
            Role = "角色";
            State = "状态";
            Normal = "正常";
            Disabled = "禁用";
            Search = "搜索";
            Create = "创建";
            Permission = "权限";
            Delete = "删除";
            RootNode = "库";
            AddSolution = "添加答案";
            Folder = "目录";
            Blog = "文章";
            Reference = "引用";
            NoSolution = "没有答案";
            Solution = "答案";
            Select = "选择";
            Ok = "确定";
            Preview = "预览";
            Cancle = "取消";
            ConfirmNameToDelete = "确认删除名称";
            ConflictTagName = "名称冲突";
            NoSuchTag = "无此标签";
            InvalidTagName = "无效名称";
            Tags = "标签";
            Value = "值";
            Values = "值";
            Type = "类型";
            InvalidTagValues = "无效标签值";
            None = "无";
            Bool = "布尔";
            String = "字符串";
            Enum = "枚举";
            Number = "数字";
            Url = "链接";
            Private = "隐藏";
            Modify = "修改";
            NoSuchLang = "无此配置";
            Key = "键";
            DefaultValue = "默认值";
            Reset = "重置";
            Configs = "配置";
            InvalidQuery = "无效查询";
            PERMISSION_POST_BLOG = "新建博客";
            PERMISSION_SHARE_BLOG = "分享博客";
            PERMISSION_REPLY_SOLUTION = "回复问题";
            PERMISSION_THIRD_SHARE = "分享到第三方";
            Login = "登陆";
            Logout = "注销";
            History = "历史记录";
            Mine = "我的";
            MySolution = "我的答案";
            SiteConfigError = "网站配置错误";
            FileToLarge = "文件过大";
            SolutionTo = "解答:";
            ReplySolution = "开始作答";
            ViewSolution = "查看答案";
            MySolutions = "我的答案";
            BlogEditor = "文档编辑";
            ImageEditor = "图片编辑";
            PERMISSION_COMMENT = "回复";
            NoSuchComment = "无此回复";
            LoadMore = "加载更多";
            Comment = "评论";
            ChangePwd = "修改密码";
            NewPassword = "新密码";
            PasswordNotSame = "密码不一致";
            LivePreview = "实时预览";
            DataWillNotSave = "沙盒页面不保存数据";
            Python = "脚本";
            CommentSuccess = "评论成功";
            NoCommentsWelcomeToAdd = "暂无评论";
            Run = "运行";
            TmpFileWillNotSave = "临时数据不会保存";
            NoWxTokenFound = "未配置微信接口TOKEN";
            InvalidApiSignature = "错误接口签名";
            NoSuchFile = "无此文件，请重新上传";

            #region Config

            CONFIG_MENUS = "";
            CONFIG_EDITOR_STYLES = "";
            CONFIG_EDITOR_STYLE_TAG = "样式";
            CONFIG_DOC_TYPE_TAG = "类型";
            CONFIG_SOLUTION_TYPE_TAG = "题型";
            CONFIG_DAILY_TAG = "首页推荐";
            CONFIG_AUTOPLAY_TAG = "自动运行";
            CONFIG_MAX_FILE_SIZE = "500000";
            CONFIG_LOGO = "/assets/imgs/logo.svg";
            CONFIG_BG = "/assets/imgs/logo.svg";
            CONFIG_DEFAULT_AVATAR = "/assets/imgs/logo.svg";
            CONFIG_TITLE = "Modoth Study";
            CONFIG_APP_TAG = "应用";
            CONFIG_SCRIPT_TAG = "应用型";
            CONFIG_PWD_EXP = "^(?=.*[-`=[\\]\\\\;',./~!@#$%^&*()_+{}|:\\\"<>?])(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[-`=[\\]\\\\;',./~!@#$%^&*()_+{}|:\\\"<>?0-9a-zA-Z]{8,16}$";
            CONFIG_WX_API_URL = "";
            CONFIG_WX_API_TOKEN = "";
            CONFIG_WX_JS_DOMAIN = "";
            CONFIG_WX_APP_ID = "";
            CONFIG_WX_APP_SECRET = "";
            CONFIG_WX_API_URL_TOKEN = $"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${nameof(AppConfigs.CONFIG_WX_APP_ID)}&secret=${nameof(AppConfigs.CONFIG_WX_APP_SECRET)}";
            CONFIG_WX_ENABLED = "";
            CONFIG_ICP = "";
            CONFIG_WX_API_URL_MENU = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=$ACCESS_TOKEN";
            CONFIG_WX_API_URL_UPLOAD_NEWS = "https://api.weixin.qq.com/cgi-bin/media/uploadnews?access_token=$ACCESS_TOKEN";
            CONFIG_WX_API_URL_SENDALL = "https://api.weixin.qq.com/cgi-bin/message/mass/sendall?access_token=$ACCESS_TOKEN";
            CONFIG_WX_API_URL_PREVIEW = "https://api.weixin.qq.com/cgi-bin/message/mass/preview?access_token=$ACCESS_TOKEN";
            CONFIG_WX_API_URL_UPLOAD = "https://api.weixin.qq.com/cgi-bin/media/upload?access_token=$ACCESS_TOKEN&type=$TYPE";
            CONFIG_WX_API_URL_UPLOAD_IMG = "https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=$ACCESS_TOKEN";
            CONFIG_WX_API_URL_DELETE_MSG = "https://api.weixin.qq.com/cgi-bin/message/mass/delete?access_token=$ACCESS_TOKEN";
            CONFIG_WX_API_PREVIEW_USERID = "";
            CONFIG_HOME_URL = "";
            CONFIG_WX_SHARE_TAG = "微信";
            CONFIG_WX_SHARE_DEFAULT_THUMB = "";
            CONFIG_WX_SHARE_DEFAULT_THUMB_ID = "";
            CONFIG_WX_SHARE_MAX_ARTICLE_COUNT = "3";
            #endregion
        }
    }
}
