# IO.Swagger.Api.TagsApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**AddTag**](TagsApi.md#addtag) | **POST** /api/Tags/AddTag | 
[**AllTags**](TagsApi.md#alltags) | **GET** /api/Tags/AllTags | 
[**RemoveTag**](TagsApi.md#removetag) | **DELETE** /api/Tags/RemoveTag | 
[**UpdateTagName**](TagsApi.md#updatetagname) | **PUT** /api/Tags/UpdateTagName | 
[**UpdateTagValues**](TagsApi.md#updatetagvalues) | **PUT** /api/Tags/UpdateTagValues | 


<a name="addtag"></a>
# **AddTag**
> ApiResultTagItem AddTag (string name, string type, string values = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class AddTagExample
    {
        public void main()
        {
            var apiInstance = new TagsApi();
            var name = name_example;  // string | 
            var type = type_example;  // string | 
            var values = values_example;  // string |  (optional) 

            try
            {
                ApiResultTagItem result = apiInstance.AddTag(name, type, values);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling TagsApi.AddTag: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | **string**|  | 
 **type** | **string**|  | 
 **values** | **string**|  | [optional] 

### Return type

[**ApiResultTagItem**](ApiResultTagItem.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="alltags"></a>
# **AllTags**
> ApiResultPagedResultTagItem AllTags (string filter = null, int? skip = null, int? count = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class AllTagsExample
    {
        public void main()
        {
            var apiInstance = new TagsApi();
            var filter = filter_example;  // string |  (optional) 
            var skip = 56;  // int? |  (optional) 
            var count = 56;  // int? |  (optional) 

            try
            {
                ApiResultPagedResultTagItem result = apiInstance.AllTags(filter, skip, count);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling TagsApi.AllTags: " + e.Message );
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

[**ApiResultPagedResultTagItem**](ApiResultPagedResultTagItem.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="removetag"></a>
# **RemoveTag**
> ApiResult RemoveTag (Guid? id)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class RemoveTagExample
    {
        public void main()
        {
            var apiInstance = new TagsApi();
            var id = new Guid?(); // Guid? | 

            try
            {
                ApiResult result = apiInstance.RemoveTag(id);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling TagsApi.RemoveTag: " + e.Message );
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

<a name="updatetagname"></a>
# **UpdateTagName**
> ApiResult UpdateTagName (Guid? id, string name)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UpdateTagNameExample
    {
        public void main()
        {
            var apiInstance = new TagsApi();
            var id = new Guid?(); // Guid? | 
            var name = name_example;  // string | 

            try
            {
                ApiResult result = apiInstance.UpdateTagName(id, name);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling TagsApi.UpdateTagName: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**Guid?**](Guid?.md)|  | 
 **name** | **string**|  | 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="updatetagvalues"></a>
# **UpdateTagValues**
> ApiResult UpdateTagValues (Guid? id, string values)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UpdateTagValuesExample
    {
        public void main()
        {
            var apiInstance = new TagsApi();
            var id = new Guid?(); // Guid? | 
            var values = values_example;  // string | 

            try
            {
                ApiResult result = apiInstance.UpdateTagValues(id, values);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling TagsApi.UpdateTagValues: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**Guid?**](Guid?.md)|  | 
 **values** | **string**|  | 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

