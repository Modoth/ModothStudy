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
    ///  Class for testing RolesApi
    /// </summary>
    /// <remarks>
    /// This file is automatically generated by Swagger Codegen.
    /// Please update the test case below to test the API endpoint.
    /// </remarks>
    [TestFixture]
    public class RolesApiTests
    {
        private RolesApi instance;

        /// <summary>
        /// Setup before each unit test
        /// </summary>
        [SetUp]
        public void Init()
        {
            instance = new RolesApi();
        }

        /// <summary>
        /// Clean up after each unit test
        /// </summary>
        [TearDown]
        public void Cleanup()
        {

        }

        /// <summary>
        /// Test an instance of RolesApi
        /// </summary>
        [Test]
        public void InstanceTest()
        {
            // TODO uncomment below to test 'IsInstanceOfType' RolesApi
            //Assert.IsInstanceOfType(typeof(RolesApi), instance, "instance is a RolesApi");
        }

        
        /// <summary>
        /// Test AddPermissionToRole
        /// </summary>
        [Test]
        public void AddPermissionToRoleTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //Guid? roleId = null;
            //string permission = null;
            //var response = instance.AddPermissionToRole(roleId, permission);
            //Assert.IsInstanceOf<ApiResultString> (response, "response is ApiResultString");
        }
        
        /// <summary>
        /// Test AddRole
        /// </summary>
        [Test]
        public void AddRoleTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //NewRole newRole = null;
            //var response = instance.AddRole(newRole);
            //Assert.IsInstanceOf<ApiResultRole> (response, "response is ApiResultRole");
        }
        
        /// <summary>
        /// Test RemovePermissionFromRole
        /// </summary>
        [Test]
        public void RemovePermissionFromRoleTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //Guid? roleId = null;
            //string permission = null;
            //var response = instance.RemovePermissionFromRole(roleId, permission);
            //Assert.IsInstanceOf<ApiResult> (response, "response is ApiResult");
        }
        
        /// <summary>
        /// Test RemoveRole
        /// </summary>
        [Test]
        public void RemoveRoleTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //Guid? id = null;
            //var response = instance.RemoveRole(id);
            //Assert.IsInstanceOf<ApiResult> (response, "response is ApiResult");
        }
        
        /// <summary>
        /// Test Roles
        /// </summary>
        [Test]
        public void RolesTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //var response = instance.Roles();
            //Assert.IsInstanceOf<ApiResultPagedResultRole> (response, "response is ApiResultPagedResultRole");
        }
        
    }

}
