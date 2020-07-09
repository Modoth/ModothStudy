# IO.Swagger.Api.NodesApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**AllLevelNodes**](NodesApi.md#alllevelnodes) | **GET** /api/Nodes/AllLevelNodes | 
[**CreateNode**](NodesApi.md#createnode) | **GET** /api/Nodes/CreateNode | 
[**CreateOrUpdateBlogContent**](NodesApi.md#createorupdateblogcontent) | **PUT** /api/Nodes/CreateOrUpdateBlogContent | 
[**CreateRefNode**](NodesApi.md#createrefnode) | **GET** /api/Nodes/CreateRefNode | 
[**DeleteTempBlogFiles**](NodesApi.md#deletetempblogfiles) | **DELETE** /api/Nodes/DeleteTempBlogFiles | 
[**GetBlog**](NodesApi.md#getblog) | **GET** /api/Nodes/GetBlog | 
[**GetBlogCustomSolution**](NodesApi.md#getblogcustomsolution) | **GET** /api/Nodes/GetBlogCustomSolution | 
[**GetBlogDefaultSolution**](NodesApi.md#getblogdefaultsolution) | **GET** /api/Nodes/GetBlogDefaultSolution | 
[**GetBlogSolutions**](NodesApi.md#getblogsolutions) | **GET** /api/Nodes/GetBlogSolutions | 
[**GetBlogsByTag**](NodesApi.md#getblogsbytag) | **GET** /api/Nodes/GetBlogsByTag | 
[**Move**](NodesApi.md#move) | **POST** /api/Nodes/Move | 
[**NodeDir**](NodesApi.md#nodedir) | **GET** /api/Nodes/NodeDir | 
[**PathNodes**](NodesApi.md#pathnodes) | **GET** /api/Nodes/PathNodes | 
[**QueryNodes**](NodesApi.md#querynodes) | **POST** /api/Nodes/QueryNodes | 
[**RemoveNode**](NodesApi.md#removenode) | **DELETE** /api/Nodes/RemoveNode | 
[**RemoveTag**](NodesApi.md#removetag) | **DELETE** /api/Nodes/RemoveTag/tags | 
[**Rename**](NodesApi.md#rename) | **POST** /api/Nodes/Rename | 
[**SubNodesOrFilterAllSubNodes**](NodesApi.md#subnodesorfilterallsubnodes) | **GET** /api/Nodes/SubNodesOrFilterAllSubNodes | 
[**UpdateBlogContent**](NodesApi.md#updateblogcontent) | **PUT** /api/Nodes/UpdateBlogContent | 
[**UpdateBlogSolution**](NodesApi.md#updateblogsolution) | **PUT** /api/Nodes/UpdateBlogSolution | 
[**UpdateNodeGroupShared**](NodesApi.md#updatenodegroupshared) | **POST** /api/Nodes/UpdateNodeGroupShared | 
[**UpdateNodePublished**](NodesApi.md#updatenodepublished) | **POST** /api/Nodes/UpdateNodePublished | 
[**UpdateNodeShared**](NodesApi.md#updatenodeshared) | **POST** /api/Nodes/UpdateNodeShared | 
[**UpdateTag**](NodesApi.md#updatetag) | **POST** /api/Nodes/UpdateTag/tags | 
[**UpdateWxShare**](NodesApi.md#updatewxshare) | **POST** /api/Nodes/UpdateWxShare/share | 


<a name="alllevelnodes"></a>
# **AllLevelNodes**
> ApiResultPagedResultNodeItem AllLevelNodes (Guid? nodeId, int? skip = null, int? count = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class AllLevelNodesExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var nodeId = new Guid?(); // Guid? | 
            var skip = 56;  // int? |  (optional) 
            var count = 56;  // int? |  (optional) 

            try
            {
                ApiResultPagedResultNodeItem result = apiInstance.AllLevelNodes(nodeId, skip, count);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.AllLevelNodes: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**Guid?**](Guid?.md)|  | 
 **skip** | **int?**|  | [optional] 
 **count** | **int?**|  | [optional] 

### Return type

[**ApiResultPagedResultNodeItem**](ApiResultPagedResultNodeItem.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="createnode"></a>
# **CreateNode**
> ApiResultNodeItem CreateNode (string name, string type, Guid? parentId = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class CreateNodeExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var name = name_example;  // string | 
            var type = type_example;  // string | 
            var parentId = new Guid?(); // Guid? |  (optional) 

            try
            {
                ApiResultNodeItem result = apiInstance.CreateNode(name, type, parentId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.CreateNode: " + e.Message );
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
 **parentId** | [**Guid?**](Guid?.md)|  | [optional] 

### Return type

[**ApiResultNodeItem**](ApiResultNodeItem.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="createorupdateblogcontent"></a>
# **CreateOrUpdateBlogContent**
> ApiResult CreateOrUpdateBlogContent (string path, string content = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class CreateOrUpdateBlogContentExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var path = path_example;  // string | 
            var content = content_example;  // string |  (optional) 

            try
            {
                ApiResult result = apiInstance.CreateOrUpdateBlogContent(path, content);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.CreateOrUpdateBlogContent: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **path** | **string**|  | 
 **content** | **string**|  | [optional] 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/_*+json
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="createrefnode"></a>
# **CreateRefNode**
> ApiResultNodeItem CreateRefNode (string name = null, Guid? parentId = null, Guid? refId = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class CreateRefNodeExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var name = name_example;  // string |  (optional) 
            var parentId = new Guid?(); // Guid? |  (optional) 
            var refId = new Guid?(); // Guid? |  (optional) 

            try
            {
                ApiResultNodeItem result = apiInstance.CreateRefNode(name, parentId, refId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.CreateRefNode: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | **string**|  | [optional] 
 **parentId** | [**Guid?**](Guid?.md)|  | [optional] 
 **refId** | [**Guid?**](Guid?.md)|  | [optional] 

### Return type

[**ApiResultNodeItem**](ApiResultNodeItem.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="deletetempblogfiles"></a>
# **DeleteTempBlogFiles**
> ApiResult DeleteTempBlogFiles (Guid? blogId)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class DeleteTempBlogFilesExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var blogId = new Guid?(); // Guid? | 

            try
            {
                ApiResult result = apiInstance.DeleteTempBlogFiles(blogId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.DeleteTempBlogFiles: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **blogId** | [**Guid?**](Guid?.md)|  | 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getblog"></a>
# **GetBlog**
> ApiResultBlog GetBlog (Guid? blogId)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class GetBlogExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var blogId = new Guid?(); // Guid? | 

            try
            {
                ApiResultBlog result = apiInstance.GetBlog(blogId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.GetBlog: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **blogId** | [**Guid?**](Guid?.md)|  | 

### Return type

[**ApiResultBlog**](ApiResultBlog.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getblogcustomsolution"></a>
# **GetBlogCustomSolution**
> ApiResultBlog GetBlogCustomSolution (Guid? blogId)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class GetBlogCustomSolutionExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var blogId = new Guid?(); // Guid? | 

            try
            {
                ApiResultBlog result = apiInstance.GetBlogCustomSolution(blogId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.GetBlogCustomSolution: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **blogId** | [**Guid?**](Guid?.md)|  | 

### Return type

[**ApiResultBlog**](ApiResultBlog.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getblogdefaultsolution"></a>
# **GetBlogDefaultSolution**
> ApiResultBlog GetBlogDefaultSolution (Guid? blogId)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class GetBlogDefaultSolutionExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var blogId = new Guid?(); // Guid? | 

            try
            {
                ApiResultBlog result = apiInstance.GetBlogDefaultSolution(blogId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.GetBlogDefaultSolution: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **blogId** | [**Guid?**](Guid?.md)|  | 

### Return type

[**ApiResultBlog**](ApiResultBlog.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getblogsolutions"></a>
# **GetBlogSolutions**
> ApiResultIEnumerableBlog GetBlogSolutions (Guid? blogId)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class GetBlogSolutionsExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var blogId = new Guid?(); // Guid? | 

            try
            {
                ApiResultIEnumerableBlog result = apiInstance.GetBlogSolutions(blogId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.GetBlogSolutions: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **blogId** | [**Guid?**](Guid?.md)|  | 

### Return type

[**ApiResultIEnumerableBlog**](ApiResultIEnumerableBlog.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getblogsbytag"></a>
# **GetBlogsByTag**
> ApiResultPagedResultNodeItem GetBlogsByTag (string tag, string tagValue = null, int? count = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class GetBlogsByTagExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var tag = tag_example;  // string | 
            var tagValue = tagValue_example;  // string |  (optional) 
            var count = 56;  // int? |  (optional) 

            try
            {
                ApiResultPagedResultNodeItem result = apiInstance.GetBlogsByTag(tag, tagValue, count);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.GetBlogsByTag: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tag** | **string**|  | 
 **tagValue** | **string**|  | [optional] 
 **count** | **int?**|  | [optional] 

### Return type

[**ApiResultPagedResultNodeItem**](ApiResultPagedResultNodeItem.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="move"></a>
# **Move**
> ApiResult Move (Guid? nodeId = null, Guid? folderId = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class MoveExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var nodeId = new Guid?(); // Guid? |  (optional) 
            var folderId = new Guid?(); // Guid? |  (optional) 

            try
            {
                ApiResult result = apiInstance.Move(nodeId, folderId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.Move: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**Guid?**](Guid?.md)|  | [optional] 
 **folderId** | [**Guid?**](Guid?.md)|  | [optional] 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="nodedir"></a>
# **NodeDir**
> ApiResultNodeDir NodeDir (Guid? nodeId = null, string filter = null, int? skip = null, int? count = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class NodeDirExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var nodeId = new Guid?(); // Guid? |  (optional) 
            var filter = filter_example;  // string |  (optional) 
            var skip = 56;  // int? |  (optional) 
            var count = 56;  // int? |  (optional) 

            try
            {
                ApiResultNodeDir result = apiInstance.NodeDir(nodeId, filter, skip, count);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.NodeDir: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**Guid?**](Guid?.md)|  | [optional] 
 **filter** | **string**|  | [optional] 
 **skip** | **int?**|  | [optional] 
 **count** | **int?**|  | [optional] 

### Return type

[**ApiResultNodeDir**](ApiResultNodeDir.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="pathnodes"></a>
# **PathNodes**
> ApiResultIEnumerableNodeItem PathNodes (Guid? nodeId)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class PathNodesExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var nodeId = new Guid?(); // Guid? | 

            try
            {
                ApiResultIEnumerableNodeItem result = apiInstance.PathNodes(nodeId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.PathNodes: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**Guid?**](Guid?.md)|  | 

### Return type

[**ApiResultIEnumerableNodeItem**](ApiResultIEnumerableNodeItem.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="querynodes"></a>
# **QueryNodes**
> ApiResultPagedResultNodeItem QueryNodes (Query query, string filter = null, int? skip = null, int? count = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class QueryNodesExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var query = new Query(); // Query | 
            var filter = filter_example;  // string |  (optional) 
            var skip = 56;  // int? |  (optional) 
            var count = 56;  // int? |  (optional) 

            try
            {
                ApiResultPagedResultNodeItem result = apiInstance.QueryNodes(query, filter, skip, count);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.QueryNodes: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **query** | [**Query**](Query.md)|  | 
 **filter** | **string**|  | [optional] 
 **skip** | **int?**|  | [optional] 
 **count** | **int?**|  | [optional] 

### Return type

[**ApiResultPagedResultNodeItem**](ApiResultPagedResultNodeItem.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/_*+json
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="removenode"></a>
# **RemoveNode**
> ApiResult RemoveNode (Guid? nodeId)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class RemoveNodeExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var nodeId = new Guid?(); // Guid? | 

            try
            {
                ApiResult result = apiInstance.RemoveNode(nodeId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.RemoveNode: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**Guid?**](Guid?.md)|  | 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="removetag"></a>
# **RemoveTag**
> ApiResult RemoveTag (Guid? nodeId, Guid? tagId)



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
            var apiInstance = new NodesApi();
            var nodeId = new Guid?(); // Guid? | 
            var tagId = new Guid?(); // Guid? | 

            try
            {
                ApiResult result = apiInstance.RemoveTag(nodeId, tagId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.RemoveTag: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**Guid?**](Guid?.md)|  | 
 **tagId** | [**Guid?**](Guid?.md)|  | 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="rename"></a>
# **Rename**
> ApiResult Rename (Guid? nodeId = null, string newName = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class RenameExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var nodeId = new Guid?(); // Guid? |  (optional) 
            var newName = newName_example;  // string |  (optional) 

            try
            {
                ApiResult result = apiInstance.Rename(nodeId, newName);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.Rename: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**Guid?**](Guid?.md)|  | [optional] 
 **newName** | **string**|  | [optional] 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="subnodesorfilterallsubnodes"></a>
# **SubNodesOrFilterAllSubNodes**
> ApiResultPagedResultNodeItem SubNodesOrFilterAllSubNodes (Guid? nodeId = null, string filter = null, int? skip = null, int? count = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class SubNodesOrFilterAllSubNodesExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var nodeId = new Guid?(); // Guid? |  (optional) 
            var filter = filter_example;  // string |  (optional) 
            var skip = 56;  // int? |  (optional) 
            var count = 56;  // int? |  (optional) 

            try
            {
                ApiResultPagedResultNodeItem result = apiInstance.SubNodesOrFilterAllSubNodes(nodeId, filter, skip, count);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.SubNodesOrFilterAllSubNodes: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**Guid?**](Guid?.md)|  | [optional] 
 **filter** | **string**|  | [optional] 
 **skip** | **int?**|  | [optional] 
 **count** | **int?**|  | [optional] 

### Return type

[**ApiResultPagedResultNodeItem**](ApiResultPagedResultNodeItem.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="updateblogcontent"></a>
# **UpdateBlogContent**
> ApiResult UpdateBlogContent (Guid? blogId, string content = null, List<string> files = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UpdateBlogContentExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var blogId = new Guid?(); // Guid? | 
            var content = content_example;  // string |  (optional) 
            var files = new List<string>(); // List<string> |  (optional) 

            try
            {
                ApiResult result = apiInstance.UpdateBlogContent(blogId, content, files);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.UpdateBlogContent: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **blogId** | [**Guid?**](Guid?.md)|  | 
 **content** | **string**|  | [optional] 
 **files** | [**List&lt;string&gt;**](string.md)|  | [optional] 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/_*+json
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="updateblogsolution"></a>
# **UpdateBlogSolution**
> ApiResultGuid UpdateBlogSolution (Guid? blogId, string title = null, string content = null, List<string> files = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UpdateBlogSolutionExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var blogId = new Guid?(); // Guid? | 
            var title = title_example;  // string |  (optional) 
            var content = content_example;  // string |  (optional) 
            var files = new List<string>(); // List<string> |  (optional) 

            try
            {
                ApiResultGuid result = apiInstance.UpdateBlogSolution(blogId, title, content, files);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.UpdateBlogSolution: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **blogId** | [**Guid?**](Guid?.md)|  | 
 **title** | **string**|  | [optional] 
 **content** | **string**|  | [optional] 
 **files** | [**List&lt;string&gt;**](string.md)|  | [optional] 

### Return type

[**ApiResultGuid**](ApiResultGuid.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/_*+json
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="updatenodegroupshared"></a>
# **UpdateNodeGroupShared**
> ApiResult UpdateNodeGroupShared (Guid? nodeId = null, bool? shared = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UpdateNodeGroupSharedExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var nodeId = new Guid?(); // Guid? |  (optional) 
            var shared = true;  // bool? |  (optional) 

            try
            {
                ApiResult result = apiInstance.UpdateNodeGroupShared(nodeId, shared);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.UpdateNodeGroupShared: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**Guid?**](Guid?.md)|  | [optional] 
 **shared** | **bool?**|  | [optional] 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="updatenodepublished"></a>
# **UpdateNodePublished**
> ApiResult UpdateNodePublished (Guid? nodeId = null, DateTime? published = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UpdateNodePublishedExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var nodeId = new Guid?(); // Guid? |  (optional) 
            var published = 2013-10-20T19:20:30+01:00;  // DateTime? |  (optional) 

            try
            {
                ApiResult result = apiInstance.UpdateNodePublished(nodeId, published);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.UpdateNodePublished: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**Guid?**](Guid?.md)|  | [optional] 
 **published** | **DateTime?**|  | [optional] 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="updatenodeshared"></a>
# **UpdateNodeShared**
> ApiResult UpdateNodeShared (Guid? nodeId = null, bool? shared = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UpdateNodeSharedExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var nodeId = new Guid?(); // Guid? |  (optional) 
            var shared = true;  // bool? |  (optional) 

            try
            {
                ApiResult result = apiInstance.UpdateNodeShared(nodeId, shared);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.UpdateNodeShared: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**Guid?**](Guid?.md)|  | [optional] 
 **shared** | **bool?**|  | [optional] 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="updatetag"></a>
# **UpdateTag**
> ApiResult UpdateTag (Guid? nodeId, Guid? tagId, string value = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UpdateTagExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var nodeId = new Guid?(); // Guid? | 
            var tagId = new Guid?(); // Guid? | 
            var value = value_example;  // string |  (optional) 

            try
            {
                ApiResult result = apiInstance.UpdateTag(nodeId, tagId, value);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.UpdateTag: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**Guid?**](Guid?.md)|  | 
 **tagId** | [**Guid?**](Guid?.md)|  | 
 **value** | **string**|  | [optional] 

### Return type

[**ApiResult**](ApiResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="updatewxshare"></a>
# **UpdateWxShare**
> ApiResultNodeTag UpdateWxShare (Guid? nodeId, bool? share)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UpdateWxShareExample
    {
        public void main()
        {
            var apiInstance = new NodesApi();
            var nodeId = new Guid?(); // Guid? | 
            var share = true;  // bool? | 

            try
            {
                ApiResultNodeTag result = apiInstance.UpdateWxShare(nodeId, share);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.UpdateWxShare: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**Guid?**](Guid?.md)|  | 
 **share** | **bool?**|  | 

### Return type

[**ApiResultNodeTag**](ApiResultNodeTag.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

