# IO.Swagger.Api.CommentApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**AddComment**](CommentApi.md#addcomment) | **POST** /api/Comment/AddComment | 
[**AddSubcomment**](CommentApi.md#addsubcomment) | **POST** /api/Comment/AddSubcomment | 
[**DeleteComment**](CommentApi.md#deletecomment) | **DELETE** /api/Comment/DeleteComment | 
[**GetBlogComments**](CommentApi.md#getblogcomments) | **GET** /api/Comment/GetBlogComments | 
[**GetSubcomments**](CommentApi.md#getsubcomments) | **GET** /api/Comment/GetSubcomments | 


<a name="addcomment"></a>
# **AddComment**
> ApiResultGuid AddComment (Guid? blogId, string detail)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class AddCommentExample
    {
        public void main()
        {
            var apiInstance = new CommentApi();
            var blogId = new Guid?(); // Guid? | 
            var detail = detail_example;  // string | 

            try
            {
                ApiResultGuid result = apiInstance.AddComment(blogId, detail);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling CommentApi.AddComment: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **blogId** | [**Guid?**](Guid?.md)|  | 
 **detail** | **string**|  | 

### Return type

[**ApiResultGuid**](ApiResultGuid.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="addsubcomment"></a>
# **AddSubcomment**
> ApiResult AddSubcomment (Guid? commentId, string detail)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class AddSubcommentExample
    {
        public void main()
        {
            var apiInstance = new CommentApi();
            var commentId = new Guid?(); // Guid? | 
            var detail = detail_example;  // string | 

            try
            {
                ApiResult result = apiInstance.AddSubcomment(commentId, detail);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling CommentApi.AddSubcomment: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **commentId** | [**Guid?**](Guid?.md)|  | 
 **detail** | **string**|  | 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="deletecomment"></a>
# **DeleteComment**
> ApiResult DeleteComment (Guid? commentId)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class DeleteCommentExample
    {
        public void main()
        {
            var apiInstance = new CommentApi();
            var commentId = new Guid?(); // Guid? | 

            try
            {
                ApiResult result = apiInstance.DeleteComment(commentId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling CommentApi.DeleteComment: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **commentId** | [**Guid?**](Guid?.md)|  | 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getblogcomments"></a>
# **GetBlogComments**
> ApiResultPagedResultCommentItem GetBlogComments (Guid? blogId, int? skip = null, int? count = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class GetBlogCommentsExample
    {
        public void main()
        {
            var apiInstance = new CommentApi();
            var blogId = new Guid?(); // Guid? | 
            var skip = 56;  // int? |  (optional) 
            var count = 56;  // int? |  (optional) 

            try
            {
                ApiResultPagedResultCommentItem result = apiInstance.GetBlogComments(blogId, skip, count);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling CommentApi.GetBlogComments: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **blogId** | [**Guid?**](Guid?.md)|  | 
 **skip** | **int?**|  | [optional] 
 **count** | **int?**|  | [optional] 

### Return type

[**ApiResultPagedResultCommentItem**](ApiResultPagedResultCommentItem.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getsubcomments"></a>
# **GetSubcomments**
> ApiResultPagedResultCommentItem GetSubcomments (Guid? commentId, int? skip = null, int? count = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class GetSubcommentsExample
    {
        public void main()
        {
            var apiInstance = new CommentApi();
            var commentId = new Guid?(); // Guid? | 
            var skip = 56;  // int? |  (optional) 
            var count = 56;  // int? |  (optional) 

            try
            {
                ApiResultPagedResultCommentItem result = apiInstance.GetSubcomments(commentId, skip, count);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling CommentApi.GetSubcomments: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **commentId** | [**Guid?**](Guid?.md)|  | 
 **skip** | **int?**|  | [optional] 
 **count** | **int?**|  | [optional] 

### Return type

[**ApiResultPagedResultCommentItem**](ApiResultPagedResultCommentItem.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

