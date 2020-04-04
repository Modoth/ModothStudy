
using System;
using System.Security.Cryptography;
using System.Text;

namespace ModothStudy.Service.Common
{
    public static class PwdEncrypter
    {
        public static string Encrypt(string pwd)
        {
            var salt = "Salt for Modothstudy.";
            byte[] pwdAndSalt = Encoding.UTF8.GetBytes(pwd + salt);
            byte[] hashBytes = new SHA256Managed().ComputeHash(pwdAndSalt);
            var hashStr = Convert.ToBase64String(hashBytes);
            return hashStr;
        }
    }
}