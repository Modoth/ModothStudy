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
    ///  Class for testing TagsApi
    /// </summary>
    /// <remarks>
    /// This file is automatically generated by Swagger Codegen.
    /// Please update the test case below to test the API endpoint.
    /// </remarks>
    [TestFixture]
    public class TagsApiTests
    {
        private TagsApi instance;

        /// <summary>
        /// Setup before each unit test
        /// </summary>
        [SetUp]
        public void Init()
        {
            instance = new TagsApi();
        }

        /// <summary>
        /// Clean up after each unit test
        /// </summary>
        [TearDown]
        public void Cleanup()
        {

        }

        /// <summary>
        /// Test an instance of TagsApi
        /// </summary>
        [Test]
        public void InstanceTest()
        {
            // TODO uncomment below to test 'IsInstanceOfType' TagsApi
            //Assert.IsInstanceOfType(typeof(TagsApi), instance, "instance is a TagsApi");
        }

        
        /// <summary>
        /// Test AddTag
        /// </summary>
        [Test]
        public void AddTagTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //string name = null;
            //string type = null;
            //string values = null;
            //var response = instance.AddTag(name, type, values);
            //Assert.IsInstanceOf<ApiResultTagItem> (response, "response is ApiResultTagItem");
        }
        
        /// <summary>
        /// Test AllTags
        /// </summary>
        [Test]
        public void AllTagsTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //string filter = null;
            //int? skip = null;
            //int? count = null;
            //var response = instance.AllTags(filter, skip, count);
            //Assert.IsInstanceOf<ApiResultPagedResultTagItem> (response, "response is ApiResultPagedResultTagItem");
        }
        
        /// <summary>
        /// Test RemoveTag
        /// </summary>
        [Test]
        public void RemoveTagTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //Guid? id = null;
            //var response = instance.RemoveTag(id);
            //Assert.IsInstanceOf<ApiResult> (response, "response is ApiResult");
        }
        
        /// <summary>
        /// Test UpdateTagName
        /// </summary>
        [Test]
        public void UpdateTagNameTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //Guid? id = null;
            //string name = null;
            //var response = instance.UpdateTagName(id, name);
            //Assert.IsInstanceOf<ApiResult> (response, "response is ApiResult");
        }
        
        /// <summary>
        /// Test UpdateTagValues
        /// </summary>
        [Test]
        public void UpdateTagValuesTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //Guid? id = null;
            //string values = null;
            //var response = instance.UpdateTagValues(id, values);
            //Assert.IsInstanceOf<ApiResult> (response, "response is ApiResult");
        }
        
    }

}
