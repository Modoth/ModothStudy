using System;
using System.Diagnostics;
using System.IO;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ModothStudy.Service.Common;
using ModothStudy.Service.CommonServices;

namespace ModothStudy.Tests
{
    [TestClass]
    public class WxMenuConvertServiceTest
    {
        [TestMethod]
        public void ConvertTest1()
        {
            var menuStr = File.ReadAllText("menus.json");
            var converter = new WxMenuConvertService();
            Console.WriteLine(converter.Convert(menuStr, "http://localhost", "My home"));
        }
    }
}
