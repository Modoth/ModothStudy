namespace ModothStudy.ServiceInterface.Common
{
    public class WeChatUser
    {
        public WeChatUser(string openId)
        {
            OpenId = openId;
        }
        public string OpenId { get; }
    }
}