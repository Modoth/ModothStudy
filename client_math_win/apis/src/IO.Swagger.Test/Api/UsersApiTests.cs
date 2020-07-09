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
    ///  Class for testing UsersApi
    /// </summary>
    /// <remarks>
    /// This file is automatically generated by Swagger Codegen.
    /// Please update the test case below to test the API endpoint.
    /// </remarks>
    [TestFixture]
    public class UsersApiTests
    {
        private UsersApi instance;

        /// <summary>
        /// Setup before each unit test
        /// </summary>
        [SetUp]
        public void Init()
        {
            instance = new UsersApi();
        }

        /// <summary>
        /// Clean up after each unit test
        /// </summary>
        [TearDown]
        public void Cleanup()
        {

        }

        /// <summary>
        /// Test an instance of UsersApi
        /// </summary>
        [Test]
        public void InstanceTest()
        {
            // TODO uncomment below to test 'IsInstanceOfType' UsersApi
            //Assert.IsInstanceOfType(typeof(UsersApi), instance, "instance is a UsersApi");
        }

        
        /// <summary>
        /// Test AddUser
        /// </summary>
        [Test]
        public void AddUserTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //NewUser newUser = null;
            //var response = instance.AddUser(newUser);
            //Assert.IsInstanceOf<ApiResultUser> (response, "response is ApiResultUser");
        }
        
        /// <summary>
        /// Test ChangeUserRole
        /// </summary>
        [Test]
        public void ChangeUserRoleTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //Guid? id = null;
            //Guid? roleId = null;
            //var response = instance.ChangeUserRole(id, roleId);
            //Assert.IsInstanceOf<ApiResult> (response, "response is ApiResult");
        }
        
        /// <summary>
        /// Test ChangeUserState
        /// </summary>
        [Test]
        public void ChangeUserStateTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //Guid? id = null;
            //bool? normal = null;
            //var response = instance.ChangeUserState(id, normal);
            //Assert.IsInstanceOf<ApiResult> (response, "response is ApiResult");
        }
        
        /// <summary>
        /// Test Users
        /// </summary>
        [Test]
        public void UsersTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //string nameFilter = null;
            //int? skip = null;
            //int? count = null;
            //var response = instance.Users(nameFilter, skip, count);
            //Assert.IsInstanceOf<ApiResultPagedResultUser> (response, "response is ApiResultPagedResultUser");
        }
        
    }

}
