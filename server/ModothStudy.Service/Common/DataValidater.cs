using static System.String;

namespace ModothStudy.Service.Common
{
    public static class DataValidater
    {
        public static bool ValidateLoginName(string name)
        {
            return !IsNullOrWhiteSpace(name);
        }

        public static bool ValidatePwd(string pwd)
        {
            return !IsNullOrWhiteSpace(pwd);
        }

        public static bool ValidateRoleName(string name)
        {
            return !IsNullOrWhiteSpace(name);
        }

        public static bool ValidateUserName(string name)
        {
            return !IsNullOrWhiteSpace(name);
        }
    }
}