/* 
 * api
 *
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v2.0
 * 
 * Generated by: https://github.com/swagger-api/swagger-codegen.git
 */

using System;
using System.Linq;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations;
using SwaggerDateConverter = IO.Swagger.Client.SwaggerDateConverter;

namespace IO.Swagger.Model
{
    /// <summary>
    /// Configs
    /// </summary>
    [DataContract]
    public partial class Configs :  IEquatable<Configs>, IValidatableObject
    {
        /// <summary>
        /// Defines AppConfigs
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public enum AppConfigsEnum
        {
            
            /// <summary>
            /// Enum MAXFILESIZE for value: CONFIG_MAX_FILE_SIZE
            /// </summary>
            [EnumMember(Value = "CONFIG_MAX_FILE_SIZE")]
            MAXFILESIZE = 1,
            
            /// <summary>
            /// Enum MENUS for value: CONFIG_MENUS
            /// </summary>
            [EnumMember(Value = "CONFIG_MENUS")]
            MENUS = 2,
            
            /// <summary>
            /// Enum EDITORSTYLES for value: CONFIG_EDITOR_STYLES
            /// </summary>
            [EnumMember(Value = "CONFIG_EDITOR_STYLES")]
            EDITORSTYLES = 3,
            
            /// <summary>
            /// Enum EDITORSTYLETAG for value: CONFIG_EDITOR_STYLE_TAG
            /// </summary>
            [EnumMember(Value = "CONFIG_EDITOR_STYLE_TAG")]
            EDITORSTYLETAG = 4,
            
            /// <summary>
            /// Enum DAILYTAG for value: CONFIG_DAILY_TAG
            /// </summary>
            [EnumMember(Value = "CONFIG_DAILY_TAG")]
            DAILYTAG = 5,
            
            /// <summary>
            /// Enum HEADTAG for value: CONFIG_HEAD_TAG
            /// </summary>
            [EnumMember(Value = "CONFIG_HEAD_TAG")]
            HEADTAG = 6,
            
            /// <summary>
            /// Enum SANDBOXAPPTAG for value: CONFIG_SANDBOX_APP_TAG
            /// </summary>
            [EnumMember(Value = "CONFIG_SANDBOX_APP_TAG")]
            SANDBOXAPPTAG = 7,
            
            /// <summary>
            /// Enum LOGO for value: CONFIG_LOGO
            /// </summary>
            [EnumMember(Value = "CONFIG_LOGO")]
            LOGO = 8,
            
            /// <summary>
            /// Enum BG for value: CONFIG_BG
            /// </summary>
            [EnumMember(Value = "CONFIG_BG")]
            BG = 9,
            
            /// <summary>
            /// Enum DEFAULTAVATAR for value: CONFIG_DEFAULT_AVATAR
            /// </summary>
            [EnumMember(Value = "CONFIG_DEFAULT_AVATAR")]
            DEFAULTAVATAR = 10,
            
            /// <summary>
            /// Enum TITLE for value: CONFIG_TITLE
            /// </summary>
            [EnumMember(Value = "CONFIG_TITLE")]
            TITLE = 11,
            
            /// <summary>
            /// Enum DOCTYPETAG for value: CONFIG_DOC_TYPE_TAG
            /// </summary>
            [EnumMember(Value = "CONFIG_DOC_TYPE_TAG")]
            DOCTYPETAG = 12,
            
            /// <summary>
            /// Enum SOLUTIONTYPETAG for value: CONFIG_SOLUTION_TYPE_TAG
            /// </summary>
            [EnumMember(Value = "CONFIG_SOLUTION_TYPE_TAG")]
            SOLUTIONTYPETAG = 13,
            
            /// <summary>
            /// Enum APPTAG for value: CONFIG_APP_TAG
            /// </summary>
            [EnumMember(Value = "CONFIG_APP_TAG")]
            APPTAG = 14,
            
            /// <summary>
            /// Enum SCRIPTTAG for value: CONFIG_SCRIPT_TAG
            /// </summary>
            [EnumMember(Value = "CONFIG_SCRIPT_TAG")]
            SCRIPTTAG = 15,
            
            /// <summary>
            /// Enum AUTOPLAYTAG for value: CONFIG_AUTOPLAY_TAG
            /// </summary>
            [EnumMember(Value = "CONFIG_AUTOPLAY_TAG")]
            AUTOPLAYTAG = 16,
            
            /// <summary>
            /// Enum PWDEXP for value: CONFIG_PWD_EXP
            /// </summary>
            [EnumMember(Value = "CONFIG_PWD_EXP")]
            PWDEXP = 17,
            
            /// <summary>
            /// Enum WXAPIURL for value: CONFIG_WX_API_URL
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_API_URL")]
            WXAPIURL = 18,
            
            /// <summary>
            /// Enum WXAPITOKEN for value: CONFIG_WX_API_TOKEN
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_API_TOKEN")]
            WXAPITOKEN = 19,
            
            /// <summary>
            /// Enum WXJSDOMAIN for value: CONFIG_WX_JS_DOMAIN
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_JS_DOMAIN")]
            WXJSDOMAIN = 20,
            
            /// <summary>
            /// Enum WXAPPID for value: CONFIG_WX_APP_ID
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_APP_ID")]
            WXAPPID = 21,
            
            /// <summary>
            /// Enum WXAPPSECRET for value: CONFIG_WX_APP_SECRET
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_APP_SECRET")]
            WXAPPSECRET = 22,
            
            /// <summary>
            /// Enum WXAPIURLTOKEN for value: CONFIG_WX_API_URL_TOKEN
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_API_URL_TOKEN")]
            WXAPIURLTOKEN = 23,
            
            /// <summary>
            /// Enum WXENABLED for value: CONFIG_WX_ENABLED
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_ENABLED")]
            WXENABLED = 24,
            
            /// <summary>
            /// Enum ICP for value: CONFIG_ICP
            /// </summary>
            [EnumMember(Value = "CONFIG_ICP")]
            ICP = 25,
            
            /// <summary>
            /// Enum WXAPIURLMENU for value: CONFIG_WX_API_URL_MENU
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_API_URL_MENU")]
            WXAPIURLMENU = 26,
            
            /// <summary>
            /// Enum WXAPIURLSENDALL for value: CONFIG_WX_API_URL_SENDALL
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_API_URL_SENDALL")]
            WXAPIURLSENDALL = 27,
            
            /// <summary>
            /// Enum WXAPIURLPREVIEW for value: CONFIG_WX_API_URL_PREVIEW
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_API_URL_PREVIEW")]
            WXAPIURLPREVIEW = 28,
            
            /// <summary>
            /// Enum WXAPIURLUPLOAD for value: CONFIG_WX_API_URL_UPLOAD
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_API_URL_UPLOAD")]
            WXAPIURLUPLOAD = 29,
            
            /// <summary>
            /// Enum WXAPIURLUPLOADIMG for value: CONFIG_WX_API_URL_UPLOAD_IMG
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_API_URL_UPLOAD_IMG")]
            WXAPIURLUPLOADIMG = 30,
            
            /// <summary>
            /// Enum WXAPIPREVIEWUSERID for value: CONFIG_WX_API_PREVIEW_USERID
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_API_PREVIEW_USERID")]
            WXAPIPREVIEWUSERID = 31,
            
            /// <summary>
            /// Enum WXAPIURLUPLOADNEWS for value: CONFIG_WX_API_URL_UPLOAD_NEWS
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_API_URL_UPLOAD_NEWS")]
            WXAPIURLUPLOADNEWS = 32,
            
            /// <summary>
            /// Enum WXAPIURLDELETEMSG for value: CONFIG_WX_API_URL_DELETE_MSG
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_API_URL_DELETE_MSG")]
            WXAPIURLDELETEMSG = 33,
            
            /// <summary>
            /// Enum HOMEURL for value: CONFIG_HOME_URL
            /// </summary>
            [EnumMember(Value = "CONFIG_HOME_URL")]
            HOMEURL = 34,
            
            /// <summary>
            /// Enum WXSHARETAG for value: CONFIG_WX_SHARE_TAG
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_SHARE_TAG")]
            WXSHARETAG = 35,
            
            /// <summary>
            /// Enum WXSHAREDEFAULTTHUMB for value: CONFIG_WX_SHARE_DEFAULT_THUMB
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_SHARE_DEFAULT_THUMB")]
            WXSHAREDEFAULTTHUMB = 36,
            
            /// <summary>
            /// Enum WXSHAREDEFAULTTHUMBID for value: CONFIG_WX_SHARE_DEFAULT_THUMB_ID
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_SHARE_DEFAULT_THUMB_ID")]
            WXSHAREDEFAULTTHUMBID = 37,
            
            /// <summary>
            /// Enum WXSHAREMAXARTICLECOUNT for value: CONFIG_WX_SHARE_MAX_ARTICLE_COUNT
            /// </summary>
            [EnumMember(Value = "CONFIG_WX_SHARE_MAX_ARTICLE_COUNT")]
            WXSHAREMAXARTICLECOUNT = 38
        }

        /// <summary>
        /// Gets or Sets AppConfigs
        /// </summary>
        [DataMember(Name="appConfigs", EmitDefaultValue=false)]
        public AppConfigsEnum? AppConfigs { get; set; }
        /// <summary>
        /// Defines ServiceMessages
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public enum ServiceMessagesEnum
        {
            
            /// <summary>
            /// Enum SiteConfigError for value: SiteConfigError
            /// </summary>
            [EnumMember(Value = "SiteConfigError")]
            SiteConfigError = 1,
            
            /// <summary>
            /// Enum FileToLarge for value: FileToLarge
            /// </summary>
            [EnumMember(Value = "FileToLarge")]
            FileToLarge = 2,
            
            /// <summary>
            /// Enum ClientError for value: ClientError
            /// </summary>
            [EnumMember(Value = "ClientError")]
            ClientError = 3,
            
            /// <summary>
            /// Enum ConflictRoleName for value: ConflictRoleName
            /// </summary>
            [EnumMember(Value = "ConflictRoleName")]
            ConflictRoleName = 4,
            
            /// <summary>
            /// Enum ConflictNodeName for value: ConflictNodeName
            /// </summary>
            [EnumMember(Value = "ConflictNodeName")]
            ConflictNodeName = 5,
            
            /// <summary>
            /// Enum ConflictUserName for value: ConflictUserName
            /// </summary>
            [EnumMember(Value = "ConflictUserName")]
            ConflictUserName = 6,
            
            /// <summary>
            /// Enum InvalidPwd for value: InvalidPwd
            /// </summary>
            [EnumMember(Value = "InvalidPwd")]
            InvalidPwd = 7,
            
            /// <summary>
            /// Enum InvalidRoleName for value: InvalidRoleName
            /// </summary>
            [EnumMember(Value = "InvalidRoleName")]
            InvalidRoleName = 8,
            
            /// <summary>
            /// Enum InvalidUserName for value: InvalidUserName
            /// </summary>
            [EnumMember(Value = "InvalidUserName")]
            InvalidUserName = 9,
            
            /// <summary>
            /// Enum InvalidNodeName for value: InvalidNodeName
            /// </summary>
            [EnumMember(Value = "InvalidNodeName")]
            InvalidNodeName = 10,
            
            /// <summary>
            /// Enum InvalidUserState for value: InvalidUserState
            /// </summary>
            [EnumMember(Value = "InvalidUserState")]
            InvalidUserState = 11,
            
            /// <summary>
            /// Enum NeedRelogin for value: NeedRelogin
            /// </summary>
            [EnumMember(Value = "NeedRelogin")]
            NeedRelogin = 12,
            
            /// <summary>
            /// Enum NoPermission for value: NoPermission
            /// </summary>
            [EnumMember(Value = "NoPermission")]
            NoPermission = 13,
            
            /// <summary>
            /// Enum NoSuchBaseRole for value: NoSuchBaseRole
            /// </summary>
            [EnumMember(Value = "NoSuchBaseRole")]
            NoSuchBaseRole = 14,
            
            /// <summary>
            /// Enum NoSuchPermission for value: NoSuchPermission
            /// </summary>
            [EnumMember(Value = "NoSuchPermission")]
            NoSuchPermission = 15,
            
            /// <summary>
            /// Enum NoSuchRole for value: NoSuchRole
            /// </summary>
            [EnumMember(Value = "NoSuchRole")]
            NoSuchRole = 16,
            
            /// <summary>
            /// Enum NoSuchUser for value: NoSuchUser
            /// </summary>
            [EnumMember(Value = "NoSuchUser")]
            NoSuchUser = 17,
            
            /// <summary>
            /// Enum NotLogin for value: NotLogin
            /// </summary>
            [EnumMember(Value = "NotLogin")]
            NotLogin = 18,
            
            /// <summary>
            /// Enum ServerError for value: ServerError
            /// </summary>
            [EnumMember(Value = "ServerError")]
            ServerError = 19,
            
            /// <summary>
            /// Enum UserOrPwdError for value: UserOrPwdError
            /// </summary>
            [EnumMember(Value = "UserOrPwdError")]
            UserOrPwdError = 20,
            
            /// <summary>
            /// Enum NoSuchFolder for value: NoSuchFolder
            /// </summary>
            [EnumMember(Value = "NoSuchFolder")]
            NoSuchFolder = 21,
            
            /// <summary>
            /// Enum NoSuchFile for value: NoSuchFile
            /// </summary>
            [EnumMember(Value = "NoSuchFile")]
            NoSuchFile = 22,
            
            /// <summary>
            /// Enum NoSuchNode for value: NoSuchNode
            /// </summary>
            [EnumMember(Value = "NoSuchNode")]
            NoSuchNode = 23,
            
            /// <summary>
            /// Enum InvalidFileType for value: InvalidFileType
            /// </summary>
            [EnumMember(Value = "InvalidFileType")]
            InvalidFileType = 24,
            
            /// <summary>
            /// Enum ConflictTagName for value: ConflictTagName
            /// </summary>
            [EnumMember(Value = "ConflictTagName")]
            ConflictTagName = 25,
            
            /// <summary>
            /// Enum NoSuchTag for value: NoSuchTag
            /// </summary>
            [EnumMember(Value = "NoSuchTag")]
            NoSuchTag = 26,
            
            /// <summary>
            /// Enum InvalidTagName for value: InvalidTagName
            /// </summary>
            [EnumMember(Value = "InvalidTagName")]
            InvalidTagName = 27,
            
            /// <summary>
            /// Enum InvalidTagValues for value: InvalidTagValues
            /// </summary>
            [EnumMember(Value = "InvalidTagValues")]
            InvalidTagValues = 28,
            
            /// <summary>
            /// Enum NoSuchLang for value: NoSuchLang
            /// </summary>
            [EnumMember(Value = "NoSuchLang")]
            NoSuchLang = 29,
            
            /// <summary>
            /// Enum InvalidQuery for value: InvalidQuery
            /// </summary>
            [EnumMember(Value = "InvalidQuery")]
            InvalidQuery = 30,
            
            /// <summary>
            /// Enum NoSuchComment for value: NoSuchComment
            /// </summary>
            [EnumMember(Value = "NoSuchComment")]
            NoSuchComment = 31
        }

        /// <summary>
        /// Gets or Sets ServiceMessages
        /// </summary>
        [DataMember(Name="serviceMessages", EmitDefaultValue=false)]
        public ServiceMessagesEnum? ServiceMessages { get; set; }
        /// <summary>
        /// Defines PermissionDescriptions
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public enum PermissionDescriptionsEnum
        {
            
            /// <summary>
            /// Enum MANAGE for value: PERMISSION_MANAGE
            /// </summary>
            [EnumMember(Value = "PERMISSION_MANAGE")]
            MANAGE = 1,
            
            /// <summary>
            /// Enum POSTBLOG for value: PERMISSION_POST_BLOG
            /// </summary>
            [EnumMember(Value = "PERMISSION_POST_BLOG")]
            POSTBLOG = 2,
            
            /// <summary>
            /// Enum REPLYSOLUTION for value: PERMISSION_REPLY_SOLUTION
            /// </summary>
            [EnumMember(Value = "PERMISSION_REPLY_SOLUTION")]
            REPLYSOLUTION = 3,
            
            /// <summary>
            /// Enum SHAREBLOG for value: PERMISSION_SHARE_BLOG
            /// </summary>
            [EnumMember(Value = "PERMISSION_SHARE_BLOG")]
            SHAREBLOG = 4,
            
            /// <summary>
            /// Enum COMMENT for value: PERMISSION_COMMENT
            /// </summary>
            [EnumMember(Value = "PERMISSION_COMMENT")]
            COMMENT = 5,
            
            /// <summary>
            /// Enum THIRDSHARE for value: PERMISSION_THIRD_SHARE
            /// </summary>
            [EnumMember(Value = "PERMISSION_THIRD_SHARE")]
            THIRDSHARE = 6
        }

        /// <summary>
        /// Gets or Sets PermissionDescriptions
        /// </summary>
        [DataMember(Name="permissionDescriptions", EmitDefaultValue=false)]
        public PermissionDescriptionsEnum? PermissionDescriptions { get; set; }
        /// <summary>
        /// Defines UiLangs
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public enum UiLangsEnum
        {
            
            /// <summary>
            /// Enum Home for value: Home
            /// </summary>
            [EnumMember(Value = "Home")]
            Home = 1,
            
            /// <summary>
            /// Enum Library for value: Library
            /// </summary>
            [EnumMember(Value = "Library")]
            Library = 2,
            
            /// <summary>
            /// Enum Subject for value: Subject
            /// </summary>
            [EnumMember(Value = "Subject")]
            Subject = 3,
            
            /// <summary>
            /// Enum Workbook for value: Workbook
            /// </summary>
            [EnumMember(Value = "Workbook")]
            Workbook = 4,
            
            /// <summary>
            /// Enum Name for value: Name
            /// </summary>
            [EnumMember(Value = "Name")]
            Name = 5,
            
            /// <summary>
            /// Enum UserName for value: UserName
            /// </summary>
            [EnumMember(Value = "UserName")]
            UserName = 6,
            
            /// <summary>
            /// Enum Import for value: Import
            /// </summary>
            [EnumMember(Value = "Import")]
            Import = 7,
            
            /// <summary>
            /// Enum Export for value: Export
            /// </summary>
            [EnumMember(Value = "Export")]
            Export = 8,
            
            /// <summary>
            /// Enum Password for value: Password
            /// </summary>
            [EnumMember(Value = "Password")]
            Password = 9,
            
            /// <summary>
            /// Enum Manage for value: Manage
            /// </summary>
            [EnumMember(Value = "Manage")]
            Manage = 10,
            
            /// <summary>
            /// Enum User for value: User
            /// </summary>
            [EnumMember(Value = "User")]
            User = 11,
            
            /// <summary>
            /// Enum Role for value: Role
            /// </summary>
            [EnumMember(Value = "Role")]
            Role = 12,
            
            /// <summary>
            /// Enum State for value: State
            /// </summary>
            [EnumMember(Value = "State")]
            State = 13,
            
            /// <summary>
            /// Enum Normal for value: Normal
            /// </summary>
            [EnumMember(Value = "Normal")]
            Normal = 14,
            
            /// <summary>
            /// Enum Disabled for value: Disabled
            /// </summary>
            [EnumMember(Value = "Disabled")]
            Disabled = 15,
            
            /// <summary>
            /// Enum Search for value: Search
            /// </summary>
            [EnumMember(Value = "Search")]
            Search = 16,
            
            /// <summary>
            /// Enum Create for value: Create
            /// </summary>
            [EnumMember(Value = "Create")]
            Create = 17,
            
            /// <summary>
            /// Enum Permission for value: Permission
            /// </summary>
            [EnumMember(Value = "Permission")]
            Permission = 18,
            
            /// <summary>
            /// Enum Delete for value: Delete
            /// </summary>
            [EnumMember(Value = "Delete")]
            Delete = 19,
            
            /// <summary>
            /// Enum RootNode for value: RootNode
            /// </summary>
            [EnumMember(Value = "RootNode")]
            RootNode = 20,
            
            /// <summary>
            /// Enum AddSolution for value: AddSolution
            /// </summary>
            [EnumMember(Value = "AddSolution")]
            AddSolution = 21,
            
            /// <summary>
            /// Enum Solution for value: Solution
            /// </summary>
            [EnumMember(Value = "Solution")]
            Solution = 22,
            
            /// <summary>
            /// Enum Folder for value: Folder
            /// </summary>
            [EnumMember(Value = "Folder")]
            Folder = 23,
            
            /// <summary>
            /// Enum Blog for value: Blog
            /// </summary>
            [EnumMember(Value = "Blog")]
            Blog = 24,
            
            /// <summary>
            /// Enum NoSolution for value: NoSolution
            /// </summary>
            [EnumMember(Value = "NoSolution")]
            NoSolution = 25,
            
            /// <summary>
            /// Enum Select for value: Select
            /// </summary>
            [EnumMember(Value = "Select")]
            Select = 26,
            
            /// <summary>
            /// Enum Ok for value: Ok
            /// </summary>
            [EnumMember(Value = "Ok")]
            Ok = 27,
            
            /// <summary>
            /// Enum Preview for value: Preview
            /// </summary>
            [EnumMember(Value = "Preview")]
            Preview = 28,
            
            /// <summary>
            /// Enum Cancle for value: Cancle
            /// </summary>
            [EnumMember(Value = "Cancle")]
            Cancle = 29,
            
            /// <summary>
            /// Enum ConfirmNameToDelete for value: ConfirmNameToDelete
            /// </summary>
            [EnumMember(Value = "ConfirmNameToDelete")]
            ConfirmNameToDelete = 30,
            
            /// <summary>
            /// Enum Tags for value: Tags
            /// </summary>
            [EnumMember(Value = "Tags")]
            Tags = 31,
            
            /// <summary>
            /// Enum Type for value: Type
            /// </summary>
            [EnumMember(Value = "Type")]
            Type = 32,
            
            /// <summary>
            /// Enum Value for value: Value
            /// </summary>
            [EnumMember(Value = "Value")]
            Value = 33,
            
            /// <summary>
            /// Enum Values for value: Values
            /// </summary>
            [EnumMember(Value = "Values")]
            Values = 34,
            
            /// <summary>
            /// Enum None for value: None
            /// </summary>
            [EnumMember(Value = "None")]
            None = 35,
            
            /// <summary>
            /// Enum Bool for value: Bool
            /// </summary>
            [EnumMember(Value = "Bool")]
            Bool = 36,
            
            /// <summary>
            /// Enum String for value: String
            /// </summary>
            [EnumMember(Value = "String")]
            String = 37,
            
            /// <summary>
            /// Enum Enum for value: Enum
            /// </summary>
            [EnumMember(Value = "Enum")]
            Enum = 38,
            
            /// <summary>
            /// Enum Number for value: Number
            /// </summary>
            [EnumMember(Value = "Number")]
            Number = 39,
            
            /// <summary>
            /// Enum Url for value: Url
            /// </summary>
            [EnumMember(Value = "Url")]
            Url = 40,
            
            /// <summary>
            /// Enum Private for value: Private
            /// </summary>
            [EnumMember(Value = "Private")]
            Private = 41,
            
            /// <summary>
            /// Enum Modify for value: Modify
            /// </summary>
            [EnumMember(Value = "Modify")]
            Modify = 42,
            
            /// <summary>
            /// Enum Key for value: Key
            /// </summary>
            [EnumMember(Value = "Key")]
            Key = 43,
            
            /// <summary>
            /// Enum DefaultValue for value: DefaultValue
            /// </summary>
            [EnumMember(Value = "DefaultValue")]
            DefaultValue = 44,
            
            /// <summary>
            /// Enum Reset for value: Reset
            /// </summary>
            [EnumMember(Value = "Reset")]
            Reset = 45,
            
            /// <summary>
            /// Enum Configs for value: Configs
            /// </summary>
            [EnumMember(Value = "Configs")]
            Configs = 46,
            
            /// <summary>
            /// Enum Login for value: Login
            /// </summary>
            [EnumMember(Value = "Login")]
            Login = 47,
            
            /// <summary>
            /// Enum Logout for value: Logout
            /// </summary>
            [EnumMember(Value = "Logout")]
            Logout = 48,
            
            /// <summary>
            /// Enum History for value: History
            /// </summary>
            [EnumMember(Value = "History")]
            History = 49,
            
            /// <summary>
            /// Enum Mine for value: Mine
            /// </summary>
            [EnumMember(Value = "Mine")]
            Mine = 50,
            
            /// <summary>
            /// Enum MySolution for value: MySolution
            /// </summary>
            [EnumMember(Value = "MySolution")]
            MySolution = 51,
            
            /// <summary>
            /// Enum SolutionTo for value: SolutionTo
            /// </summary>
            [EnumMember(Value = "SolutionTo")]
            SolutionTo = 52,
            
            /// <summary>
            /// Enum ReplySolution for value: ReplySolution
            /// </summary>
            [EnumMember(Value = "ReplySolution")]
            ReplySolution = 53,
            
            /// <summary>
            /// Enum ViewSolution for value: ViewSolution
            /// </summary>
            [EnumMember(Value = "ViewSolution")]
            ViewSolution = 54,
            
            /// <summary>
            /// Enum MySolutions for value: MySolutions
            /// </summary>
            [EnumMember(Value = "MySolutions")]
            MySolutions = 55,
            
            /// <summary>
            /// Enum ImageEditor for value: ImageEditor
            /// </summary>
            [EnumMember(Value = "ImageEditor")]
            ImageEditor = 56,
            
            /// <summary>
            /// Enum LoadMore for value: LoadMore
            /// </summary>
            [EnumMember(Value = "LoadMore")]
            LoadMore = 57,
            
            /// <summary>
            /// Enum Comment for value: Comment
            /// </summary>
            [EnumMember(Value = "Comment")]
            Comment = 58,
            
            /// <summary>
            /// Enum ChangePwd for value: ChangePwd
            /// </summary>
            [EnumMember(Value = "ChangePwd")]
            ChangePwd = 59,
            
            /// <summary>
            /// Enum NewPassword for value: NewPassword
            /// </summary>
            [EnumMember(Value = "NewPassword")]
            NewPassword = 60,
            
            /// <summary>
            /// Enum PasswordNotSame for value: PasswordNotSame
            /// </summary>
            [EnumMember(Value = "PasswordNotSame")]
            PasswordNotSame = 61,
            
            /// <summary>
            /// Enum LivePreview for value: LivePreview
            /// </summary>
            [EnumMember(Value = "LivePreview")]
            LivePreview = 62,
            
            /// <summary>
            /// Enum BlogEditor for value: BlogEditor
            /// </summary>
            [EnumMember(Value = "BlogEditor")]
            BlogEditor = 63,
            
            /// <summary>
            /// Enum DataWillNotSave for value: DataWillNotSave
            /// </summary>
            [EnumMember(Value = "DataWillNotSave")]
            DataWillNotSave = 64,
            
            /// <summary>
            /// Enum Python for value: Python
            /// </summary>
            [EnumMember(Value = "Python")]
            Python = 65,
            
            /// <summary>
            /// Enum CommentSuccess for value: CommentSuccess
            /// </summary>
            [EnumMember(Value = "CommentSuccess")]
            CommentSuccess = 66,
            
            /// <summary>
            /// Enum NoCommentsWelcomeToAdd for value: NoCommentsWelcomeToAdd
            /// </summary>
            [EnumMember(Value = "NoCommentsWelcomeToAdd")]
            NoCommentsWelcomeToAdd = 67,
            
            /// <summary>
            /// Enum Run for value: Run
            /// </summary>
            [EnumMember(Value = "Run")]
            Run = 68,
            
            /// <summary>
            /// Enum TmpFileWillNotSave for value: TmpFileWillNotSave
            /// </summary>
            [EnumMember(Value = "TmpFileWillNotSave")]
            TmpFileWillNotSave = 69,
            
            /// <summary>
            /// Enum NoWxTokenFound for value: NoWxTokenFound
            /// </summary>
            [EnumMember(Value = "NoWxTokenFound")]
            NoWxTokenFound = 70,
            
            /// <summary>
            /// Enum InvalidApiSignature for value: InvalidApiSignature
            /// </summary>
            [EnumMember(Value = "InvalidApiSignature")]
            InvalidApiSignature = 71,
            
            /// <summary>
            /// Enum Reference for value: Reference
            /// </summary>
            [EnumMember(Value = "Reference")]
            Reference = 72,
            
            /// <summary>
            /// Enum PwdDescription for value: PwdDescription
            /// </summary>
            [EnumMember(Value = "PwdDescription")]
            PwdDescription = 73,
            
            /// <summary>
            /// Enum PythonConsole for value: PythonConsole
            /// </summary>
            [EnumMember(Value = "PythonConsole")]
            PythonConsole = 74,
            
            /// <summary>
            /// Enum OpenFile for value: OpenFile
            /// </summary>
            [EnumMember(Value = "OpenFile")]
            OpenFile = 75,
            
            /// <summary>
            /// Enum SuccessToCopy for value: SuccessToCopy
            /// </summary>
            [EnumMember(Value = "SuccessToCopy")]
            SuccessToCopy = 76,
            
            /// <summary>
            /// Enum OpenFileFromThisApp for value: OpenFileFromThisApp
            /// </summary>
            [EnumMember(Value = "OpenFileFromThisApp")]
            OpenFileFromThisApp = 77
        }

        /// <summary>
        /// Gets or Sets UiLangs
        /// </summary>
        [DataMember(Name="uiLangs", EmitDefaultValue=false)]
        public UiLangsEnum? UiLangs { get; set; }
        /// <summary>
        /// Initializes a new instance of the <see cref="Configs" /> class.
        /// </summary>
        /// <param name="appConfigs">appConfigs.</param>
        /// <param name="serviceMessages">serviceMessages.</param>
        /// <param name="permissionDescriptions">permissionDescriptions.</param>
        /// <param name="uiLangs">uiLangs.</param>
        public Configs(AppConfigsEnum? appConfigs = default(AppConfigsEnum?), ServiceMessagesEnum? serviceMessages = default(ServiceMessagesEnum?), PermissionDescriptionsEnum? permissionDescriptions = default(PermissionDescriptionsEnum?), UiLangsEnum? uiLangs = default(UiLangsEnum?))
        {
            this.AppConfigs = appConfigs;
            this.ServiceMessages = serviceMessages;
            this.PermissionDescriptions = permissionDescriptions;
            this.UiLangs = uiLangs;
        }
        




        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class Configs {\n");
            sb.Append("  AppConfigs: ").Append(AppConfigs).Append("\n");
            sb.Append("  ServiceMessages: ").Append(ServiceMessages).Append("\n");
            sb.Append("  PermissionDescriptions: ").Append(PermissionDescriptions).Append("\n");
            sb.Append("  UiLangs: ").Append(UiLangs).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }
  
        /// <summary>
        /// Returns the JSON string presentation of the object
        /// </summary>
        /// <returns>JSON string presentation of the object</returns>
        public virtual string ToJson()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }

        /// <summary>
        /// Returns true if objects are equal
        /// </summary>
        /// <param name="input">Object to be compared</param>
        /// <returns>Boolean</returns>
        public override bool Equals(object input)
        {
            return this.Equals(input as Configs);
        }

        /// <summary>
        /// Returns true if Configs instances are equal
        /// </summary>
        /// <param name="input">Instance of Configs to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(Configs input)
        {
            if (input == null)
                return false;

            return 
                (
                    this.AppConfigs == input.AppConfigs ||
                    (this.AppConfigs != null &&
                    this.AppConfigs.Equals(input.AppConfigs))
                ) && 
                (
                    this.ServiceMessages == input.ServiceMessages ||
                    (this.ServiceMessages != null &&
                    this.ServiceMessages.Equals(input.ServiceMessages))
                ) && 
                (
                    this.PermissionDescriptions == input.PermissionDescriptions ||
                    (this.PermissionDescriptions != null &&
                    this.PermissionDescriptions.Equals(input.PermissionDescriptions))
                ) && 
                (
                    this.UiLangs == input.UiLangs ||
                    (this.UiLangs != null &&
                    this.UiLangs.Equals(input.UiLangs))
                );
        }

        /// <summary>
        /// Gets the hash code
        /// </summary>
        /// <returns>Hash code</returns>
        public override int GetHashCode()
        {
            unchecked // Overflow is fine, just wrap
            {
                int hashCode = 41;
                if (this.AppConfigs != null)
                    hashCode = hashCode * 59 + this.AppConfigs.GetHashCode();
                if (this.ServiceMessages != null)
                    hashCode = hashCode * 59 + this.ServiceMessages.GetHashCode();
                if (this.PermissionDescriptions != null)
                    hashCode = hashCode * 59 + this.PermissionDescriptions.GetHashCode();
                if (this.UiLangs != null)
                    hashCode = hashCode * 59 + this.UiLangs.GetHashCode();
                return hashCode;
            }
        }

        /// <summary>
        /// To validate all properties of the instance
        /// </summary>
        /// <param name="validationContext">Validation context</param>
        /// <returns>Validation Result</returns>
        IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> IValidatableObject.Validate(ValidationContext validationContext)
        {
            yield break;
        }
    }

}