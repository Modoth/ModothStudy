# IO.Swagger.Api.FilesApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**UploadFile**](FilesApi.md#uploadfile) | **POST** /api/Files/UploadFile | 


<a name="uploadfile"></a>
# **UploadFile**
> ApiResultString UploadFile (System.IO.Stream _file)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class UploadFileExample
    {
        public void main()
        {
            var apiInstance = new FilesApi();
            var _file = new System.IO.Stream(); // System.IO.Stream | 

            try
            {
                ApiResultString result = apiInstance.UploadFile(_file);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling FilesApi.UploadFile: " + e.Message );
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

