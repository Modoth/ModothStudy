# IO.Swagger.Api.ConfigsApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**All**](ConfigsApi.md#all) | **GET** /api/Configs/All | 
[**AllConfigs**](ConfigsApi.md#allconfigs) | **GET** /api/Configs/AllConfigs | 
[**AllKeys**](ConfigsApi.md#allkeys) | **GET** /api/Configs/AllKeys | 
[**ResetValue**](ConfigsApi.md#resetvalue) | **PUT** /api/Configs/ResetValue | 
[**UpdateImageValue**](ConfigsApi.md#updateimagevalue) | **PUT** /api/Configs/UpdateImageValue | 
[**UpdateValue**](ConfigsApi.md#updatevalue) | **PUT** /api/Configs/UpdateValue | 


<a name="all"></a>
# **All**
> Dictionary<string, string> All ()



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class AllExample
    {
        public void main()
        {
            var apiInstance = new ConfigsApi();

            try
            {
                Dictionary&lt;string, string&gt; result = apiInstance.All();
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ConfigsApi.All: " + e.Message );
            }
        }
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

**Dictionary<string, string>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="allconfigs"></a>
# **AllConfigs**
> ApiResultPagedResultConfigItem AllConfigs (string filter = null, int? skip = null, int? count = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class AllConfigsExample
    {
        public void main()
        {
            var apiInstance = new ConfigsApi();
            var filter = filter_example;  // string |  (optional) 
            var skip = 56;  // int? |  (optional) 
            var count = 56;  // int? |  (optional) 

            try
            {
                ApiResultPagedResultConfigItem result = apiInstance.AllConfigs(filter, skip, count);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ConfigsApi.AllConfigs: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **filter** | **string**|  | [optional] 
 **skip** | **int?**|  | [optional] 
 **count** | **int?**|  | [optional] 

### Return type

[**ApiResultPagedResultConfigItem**](ApiResultPagedResultConfigItem.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="allkeys"></a>
# **AllKeys**
> Configs AllKeys ()



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class AllKeysExample
    {
        public void main()
        {
            var apiInstance = new ConfigsApi();

            try
            {
                Configs result = apiInstance.AllKeys();
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ConfigsApi.AllKeys: " + e.Message );
            }
        }
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**Configs**](Configs.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="resetvalue"></a>
# **ResetValue**
> ApiResult ResetValue (Guid? id)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class ResetValueExample
    {
        public void main()
        {
            var apiInstance = new ConfigsApi();
            var id = new Guid?(); // Guid? | 

            try
            {
                ApiResult result = apiInstance.ResetValue(id);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ConfigsApi.ResetValue: " + e.Message );
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

<a name="updateimagevalue"></a>
# **UpdateImageValue**
> ApiResultString UpdateImageValue (Guid? id, System.IO.Stream _file)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UpdateImageValueExample
    {
        public void main()
        {
            var apiInstance = new ConfigsApi();
            var id = new Guid?(); // Guid? | 
            var _file = new System.IO.Stream(); // System.IO.Stream | 

            try
            {
                ApiResultString result = apiInstance.UpdateImageValue(id, _file);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ConfigsApi.UpdateImageValue: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**Guid?**](Guid?.md)|  | 
 **_file** | **System.IO.Stream**|  | 

### Return type

[**ApiResultString**](ApiResultString.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="updatevalue"></a>
# **UpdateValue**
> ApiResult UpdateValue (Guid? id, string value)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UpdateValueExample
    {
        public void main()
        {
            var apiInstance = new ConfigsApi();
            var id = new Guid?(); // Guid? | 
            var value = value_example;  // string | 

            try
            {
                ApiResult result = apiInstance.UpdateValue(id, value);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ConfigsApi.UpdateValue: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**Guid?**](Guid?.md)|  | 
 **value** | **string**|  | 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/_*+json
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

