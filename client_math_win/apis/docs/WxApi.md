# IO.Swagger.Api.WxApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**Get**](WxApi.md#get) | **GET** /api/Wx | 


<a name="get"></a>
# **Get**
> void Get (string signature = null, string timestamp = null, string nonce = null, string echostr = null)



### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class GetExample
    {
        public void main()
        {
            var apiInstance = new WxApi();
            var signature = signature_example;  // string |  (optional) 
            var timestamp = timestamp_example;  // string |  (optional) 
            var nonce = nonce_example;  // string |  (optional) 
            var echostr = echostr_example;  // string |  (optional) 

            try
            {
                apiInstance.Get(signature, timestamp, nonce, echostr);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling WxApi.Get: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **signature** | **string**|  | [optional] 
 **timestamp** | **string**|  | [optional] 
 **nonce** | **string**|  | [optional] 
 **echostr** | **string**|  | [optional] 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

