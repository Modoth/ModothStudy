using System.Collections.Generic;
using System.Reflection;
using ModothStudy.Entity;

namespace ModothStudy.ServiceInterface.Lang
{
    public enum AppConfigs
    {
        CONFIG_MAX_FILE_SIZE,

        [ConfigType(ConfigType.Json)]
        CONFIG_MENUS,

        [ConfigType(ConfigType.Json)]
        CONFIG_EDITOR_STYLES,

        CONFIG_EDITOR_STYLE_TAG,

        CONFIG_DAILY_TAG,

        CONFIG_HEAD_TAG,

        CONFIG_SANDBOX_APP_TAG,


        [ConfigType(ConfigType.Image)]
        CONFIG_LOGO,

        [ConfigType(ConfigType.Image)]
        CONFIG_BG,

        [ConfigType(ConfigType.Image)]
        CONFIG_DEFAULT_AVATAR,

        CONFIG_TITLE,

        CONFIG_DOC_TYPE_TAG,

        CONFIG_SOLUTION_TYPE_TAG,

        CONFIG_APP_TAG,

        CONFIG_SCRIPT_TAG,

        CONFIG_AUTOPLAY_TAG,

        CONFIG_PWD_EXP,

        [PrivateConfig]
        CONFIG_WX_API_URL,

        [PrivateConfig]
        CONFIG_WX_API_TOKEN,

        [PrivateConfig]
        CONFIG_WX_JS_DOMAIN,

        [PrivateConfig]
        CONFIG_WX_APP_ID,

        [PrivateConfig]
        CONFIG_WX_APP_SECRET,

        [PrivateConfig]
        CONFIG_WX_API_URL_TOKEN,

        [ConfigType(ConfigType.Boolean)]
        CONFIG_WX_ENABLED,

        CONFIG_ICP,

        CONFIG_WX_API_URL_MENU,

        CONFIG_WX_API_URL_SENDALL,

        CONFIG_WX_API_URL_PREVIEW,

        CONFIG_WX_API_URL_UPLOAD,

        CONFIG_WX_API_URL_UPLOAD_IMG,

        [PrivateConfig]
        CONFIG_WX_API_PREVIEW_USERID,

        CONFIG_WX_API_URL_UPLOAD_NEWS,

        CONFIG_WX_API_URL_DELETE_MSG,

        CONFIG_HOME_URL,

        CONFIG_WX_SHARE_TAG,

        [PrivateConfig]
        [ConfigType(ConfigType.Image)]
        CONFIG_WX_SHARE_DEFAULT_THUMB,

        [PrivateConfig]
        CONFIG_WX_SHARE_DEFAULT_THUMB_ID,

        [PrivateConfig]
        CONFIG_WX_SHARE_MAX_ARTICLE_COUNT,
    }

    public class AppConfigsUtils
    {
        public static Dictionary<string, ConfigType> ConfigTypes;
        static AppConfigsUtils()
        {
            ConfigTypes = new Dictionary<string, ConfigType>();
            var fileds = typeof(AppConfigs).GetFields();
            foreach (var field in fileds)
            {
                var type = field.GetCustomAttribute<ConfigTypeAttribute>();
                if (type != null && type.ConfigType != ConfigType.None)
                {
                    ConfigTypes[field.Name] = type.ConfigType;
                }
            }
        }
    }
}