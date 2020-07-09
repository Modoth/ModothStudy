# IO.Swagger.Api.RolesApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**AddPermissionToRole**](RolesApi.md#addpermissiontorole) | **POST** /api/Roles/permission | 
[**AddRole**](RolesApi.md#addrole) | **POST** /api/Roles | 
[**RemovePermissionFromRole**](RolesApi.md#removepermissionfromrole) | **DELETE** /api/Roles/permission | 
[**RemoveRole**](RolesApi.md#removerole) | **DELETE** /api/Roles | 
[**Roles**](RolesApi.md#roles) | **GET** /api/Roles | 


<a name="addpermissiontorole"></a>
# **AddPermissionToRole**
> ApiResultString AddPermissionToRole (Guid? roleId, string permission)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class AddPermissionToRoleExample
    {
        public void main()
        {
            var apiInstance = new RolesApi();
            var roleId = new Guid?(); // Guid? | 
            var permission = permission_example;  // string | 

            try
            {
                ApiResultString result = apiInstance.AddPermissionToRole(roleId, permission);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling RolesApi.AddPermissionToRole: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **roleId** | [**Guid?**](Guid?.md)|  | 
 **permission** | **string**|  | 

### Return type

[**ApiResultString**](ApiResultString.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="addrole"></a>
# **AddRole**
> ApiResultRole AddRole (NewRole newRole)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class AddRoleExample
    {
        public void main()
        {
            var apiInstance = new RolesApi();
            var newRole = new NewRole(); // NewRole | 

            try
            {
                ApiResultRole result = apiInstance.AddRole(newRole);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling RolesApi.AddRole: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **newRole** | [**NewRole**](NewRole.md)|  | 

### Return type

[**ApiResultRole**](ApiResultRole.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/_*+json
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="removepermissionfromrole"></a>
# **RemovePermissionFromRole**
> ApiResult RemovePermissionFromRole (Guid? roleId, string permission)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class RemovePermissionFromRoleExample
    {
        public void main()
        {
            var apiInstance = new RolesApi();
            var roleId = new Guid?(); // Guid? | 
            var permission = permission_example;  // string | 

            try
            {
                ApiResult result = apiInstance.RemovePermissionFromRole(roleId, permission);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling RolesApi.RemovePermissionFromRole: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **roleId** | [**Guid?**](Guid?.md)|  | 
 **permission** | **string**|  | 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="removerole"></a>
# **RemoveRole**
> ApiResult RemoveRole (Guid? id)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class RemoveRoleExample
    {
        public void main()
        {
            var apiInstance = new RolesApi();
            var id = new Guid?(); // Guid? | 

            try
            {
                ApiResult result = apiInstance.RemoveRole(id);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling RolesApi.RemoveRole: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**Guid?**](Guid?.md)|  | 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="roles"></a>
# **Roles**
> ApiResultPagedResultRole Roles ()



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class RolesExample
    {
        public void main()
        {
            var apiInstance = new RolesApi();

            try
            {
                ApiResultPagedResultRole result = apiInstance.Roles();
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling RolesApi.Roles: " + e.Message );
            }
        }
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ApiResultPagedResultRole**](ApiResultPagedResultRole.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

