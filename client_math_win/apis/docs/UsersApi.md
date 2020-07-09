# IO.Swagger.Api.UsersApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**AddUser**](UsersApi.md#adduser) | **POST** /api/Users | 
[**ChangeUserRole**](UsersApi.md#changeuserrole) | **PUT** /api/Users/role | 
[**ChangeUserState**](UsersApi.md#changeuserstate) | **PUT** /api/Users/state | 
[**Users**](UsersApi.md#users) | **GET** /api/Users | 


<a name="adduser"></a>
# **AddUser**
> ApiResultUser AddUser (NewUser newUser)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class AddUserExample
    {
        public void main()
        {
            var apiInstance = new UsersApi();
            var newUser = new NewUser(); // NewUser | 

            try
            {
                ApiResultUser result = apiInstance.AddUser(newUser);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling UsersApi.AddUser: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **newUser** | [**NewUser**](NewUser.md)|  | 

### Return type

[**ApiResultUser**](ApiResultUser.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/_*+json
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="changeuserrole"></a>
# **ChangeUserRole**
> ApiResult ChangeUserRole (Guid? id, Guid? roleId = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class ChangeUserRoleExample
    {
        public void main()
        {
            var apiInstance = new UsersApi();
            var id = new Guid?(); // Guid? | 
            var roleId = new Guid?(); // Guid? |  (optional) 

            try
            {
                ApiResult result = apiInstance.ChangeUserRole(id, roleId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling UsersApi.ChangeUserRole: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**Guid?**](Guid?.md)|  | 
 **roleId** | [**Guid?**](Guid?.md)|  | [optional] 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="changeuserstate"></a>
# **ChangeUserState**
> ApiResult ChangeUserState (Guid? id, bool? normal)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class ChangeUserStateExample
    {
        public void main()
        {
            var apiInstance = new UsersApi();
            var id = new Guid?(); // Guid? | 
            var normal = true;  // bool? | 

            try
            {
                ApiResult result = apiInstance.ChangeUserState(id, normal);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling UsersApi.ChangeUserState: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**Guid?**](Guid?.md)|  | 
 **normal** | **bool?**|  | 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="users"></a>
# **Users**
> ApiResultPagedResultUser Users (string nameFilter = null, int? skip = null, int? count = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UsersExample
    {
        public void main()
        {
            var apiInstance = new UsersApi();
            var nameFilter = nameFilter_example;  // string |  (optional) 
            var skip = 56;  // int? |  (optional) 
            var count = 56;  // int? |  (optional) 

            try
            {
                ApiResultPagedResultUser result = apiInstance.Users(nameFilter, skip, count);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling UsersApi.Users: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nameFilter** | **string**|  | [optional] 
 **skip** | **int?**|  | [optional] 
 **count** | **int?**|  | [optional] 

### Return type

[**ApiResultPagedResultUser**](ApiResultPagedResultUser.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

