# IO.Swagger.Api.LoginApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**Off**](LoginApi.md#off) | **GET** /api/Login/Off | 
[**On**](LoginApi.md#on) | **GET** /api/Login/On | 
[**PwdOn**](LoginApi.md#pwdon) | **POST** /api/Login/PwdOn | 
[**UpdateAvatar**](LoginApi.md#updateavatar) | **PUT** /api/Login/UpdateAvatar | 
[**UpdateNickName**](LoginApi.md#updatenickname) | **PUT** /api/Login/UpdateNickName | 
[**UpdatePwd**](LoginApi.md#updatepwd) | **PUT** /api/Login/UpdatePwd | 
[**WeChatAppId**](LoginApi.md#wechatappid) | **GET** /api/Login/WeChatAppId | 
[**WeChatOn**](LoginApi.md#wechaton) | **GET** /api/Login/WeChatOn | 


<a name="off"></a>
# **Off**
> ApiResult Off ()



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class OffExample
    {
        public void main()
        {
            var apiInstance = new LoginApi();

            try
            {
                ApiResult result = apiInstance.Off();
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling LoginApi.Off: " + e.Message );
            }
        }
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="on"></a>
# **On**
> ApiResultLoginUser On ()



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class OnExample
    {
        public void main()
        {
            var apiInstance = new LoginApi();

            try
            {
                ApiResultLoginUser result = apiInstance.On();
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling LoginApi.On: " + e.Message );
            }
        }
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ApiResultLoginUser**](ApiResultLoginUser.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="pwdon"></a>
# **PwdOn**
> ApiResultLoginUser PwdOn (UserLogin login)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class PwdOnExample
    {
        public void main()
        {
            var apiInstance = new LoginApi();
            var login = new UserLogin(); // UserLogin | 

            try
            {
                ApiResultLoginUser result = apiInstance.PwdOn(login);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling LoginApi.PwdOn: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **login** | [**UserLogin**](UserLogin.md)|  | 

### Return type

[**ApiResultLoginUser**](ApiResultLoginUser.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/_*+json
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="updateavatar"></a>
# **UpdateAvatar**
> ApiResultString UpdateAvatar (System.IO.Stream _file)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UpdateAvatarExample
    {
        public void main()
        {
            var apiInstance = new LoginApi();
            var _file = new System.IO.Stream(); // System.IO.Stream | 

            try
            {
                ApiResultString result = apiInstance.UpdateAvatar(_file);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling LoginApi.UpdateAvatar: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **_file** | **System.IO.Stream**|  | 

### Return type

[**ApiResultString**](ApiResultString.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="updatenickname"></a>
# **UpdateNickName**
> ApiResult UpdateNickName (string nickName)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UpdateNickNameExample
    {
        public void main()
        {
            var apiInstance = new LoginApi();
            var nickName = nickName_example;  // string | 

            try
            {
                ApiResult result = apiInstance.UpdateNickName(nickName);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling LoginApi.UpdateNickName: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nickName** | **string**|  | 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="updatepwd"></a>
# **UpdatePwd**
> ApiResult UpdatePwd (NewPwd newpwd)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UpdatePwdExample
    {
        public void main()
        {
            var apiInstance = new LoginApi();
            var newpwd = new NewPwd(); // NewPwd | 

            try
            {
                ApiResult result = apiInstance.UpdatePwd(newpwd);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling LoginApi.UpdatePwd: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **newpwd** | [**NewPwd**](NewPwd.md)|  | 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/_*+json
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="wechatappid"></a>
# **WeChatAppId**
> ApiResultString WeChatAppId ()



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class WeChatAppIdExample
    {
        public void main()
        {
            var apiInstance = new LoginApi();

            try
            {
                ApiResultString result = apiInstance.WeChatAppId();
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling LoginApi.WeChatAppId: " + e.Message );
            }
        }
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ApiResultString**](ApiResultString.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="wechaton"></a>
# **WeChatOn**
> ApiResultLoginUser WeChatOn (string code, bool? testLogin = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class WeChatOnExample
    {
        public void main()
        {
            var apiInstance = new LoginApi();
            var code = code_example;  // string | 
            var testLogin = true;  // bool? |  (optional) 

            try
            {
                ApiResultLoginUser result = apiInstance.WeChatOn(code, testLogin);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling LoginApi.WeChatOn: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | **string**|  | 
 **testLogin** | **bool?**|  | [optional] 

### Return type

[**ApiResultLoginUser**](ApiResultLoginUser.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

