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
using System.IO;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using RestSharp;
using NUnit.Framework;

using IO.Swagger.Client;
using IO.Swagger.Api;
using IO.Swagger.Model;

namespace IO.Swagger.Test
{
    /// <summary>
    ///  Class for testing ConfigsApi
    /// </summary>
    /// <remarks>
    /// This file is automatically generated by Swagger Codegen.
    /// Please update the test case below to test the API endpoint.
    /// </remarks>
    [TestFixture]
    public class ConfigsApiTests
    {
        private ConfigsApi instance;

        /// <summary>
        /// Setup before each unit test
        /// </summary>
        [SetUp]
        public void Init()
        {
            instance = new ConfigsApi();
        }

        /// <summary>
        /// Clean up after each unit test
        /// </summary>
        [TearDown]
        public void Cleanup()
        {

        }

        /// <summary>
        /// Test an instance of ConfigsApi
        /// </summary>
        [Test]
        public void InstanceTest()
        {
            // TODO uncomment below to test 'IsInstanceOfType' ConfigsApi
            //Assert.IsInstanceOfType(typeof(ConfigsApi), instance, "instance is a ConfigsApi");
        }

        
        /// <summary>
        /// Test All
        /// </summary>
        [Test]
        public void AllTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //var response = instance.All();
            //Assert.IsInstanceOf<Dictionary<string, string>> (response, "response is Dictionary<string, string>");
        }
        
        /// <summary>
        /// Test AllConfigs
        /// </summary>
        [Test]
        public void AllConfigsTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //string filter = null;
            //int? skip = null;
            //int? count = null;
            //var response = instance.AllConfigs(filter, skip, count);
            //Assert.IsInstanceOf<ApiResultPagedResultConfigItem> (response, "response is ApiResultPagedResultConfigItem");
        }
        
        /// <summary>
        /// Test AllKeys
        /// </summary>
        [Test]
        public void AllKeysTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //var response = instance.AllKeys();
            //Assert.IsInstanceOf<Configs> (response, "response is Configs");
        }
        
        /// <summary>
        /// Test ResetValue
        /// </summary>
        [Test]
        public void ResetValueTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //Guid? id = null;
            //var response = instance.ResetValue(id);
            //Assert.IsInstanceOf<ApiResult> (response, "response is ApiResult");
        }
        
        /// <summary>
        /// Test UpdateImageValue
        /// </summary>
        [Test]
        public void UpdateImageValueTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //Guid? id = null;
            //System.IO.Stream _file = null;
            //var response = instance.UpdateImageValue(id, _file);
            //Assert.IsInstanceOf<ApiResultString> (response, "response is ApiResultString");
        }
        
        /// <summary>
        /// Test UpdateValue
        /// </summary>
        [Test]
        public void UpdateValueTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //Guid? id = null;
            //string value = null;
            //var response = instance.UpdateValue(id, value);
            //Assert.IsInstanceOf<ApiResult> (response, "response is ApiResult");
        }
        
    }

}
