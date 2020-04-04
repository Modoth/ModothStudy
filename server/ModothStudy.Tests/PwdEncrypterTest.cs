using System;
using System.Diagnostics;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ModothStudy.Service.Common;

namespace ModothStudy.Tests
{
    [TestClass]
    public class PwdEncrypterTest
    {
        [TestMethod]
        public void EncryptTest1()
        {
            var pwd = "12315";
            var encrypted = PwdEncrypter.Encrypt(pwd);
            Console.WriteLine(encrypted);
            Assert.Equals(encrypted, pwd);
            Assert.AreNotEqual(encrypted, pwd);
        }
    }
}
