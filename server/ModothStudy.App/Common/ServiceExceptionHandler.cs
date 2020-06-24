using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using ModothStudy.Entity;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ModothStudy.App.Common
{
    public class ServiceExceptionHandler
    {
        private static readonly JsonSerializerSettings JsonSerializerSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };

        private readonly RequestDelegate _next;

        public ServiceExceptionHandler(RequestDelegate next)
        {
            _next = next;
        }

        private static async Task HandleExceptionAsync(DateTime begin, DateTime end, HttpContext context,
            Exception exception)
        {
            var msg = nameof(ServiceMessages.ServerError);
            if (exception is ServiceException)
            {
                msg = exception.Message;
            }

            var logsService = context.RequestServices.GetService<ILogsService>();

            await logsService.LogError(begin, end, msg, JsonConvert.SerializeObject(new
            {
                context.Request.Path,
                context.Request.QueryString
            }));

            Console.WriteLine(exception.ToString());

            var result =
                JsonConvert.SerializeObject(new ApiResult(false, msg), JsonSerializerSettings);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.OK;
            await context.Response.WriteAsync(result);
        }

        public async Task Invoke(HttpContext context)
        {
            var begin = DateTime.Now;
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                var end = DateTime.Now;
                await HandleExceptionAsync(begin, end, context, ex);
            }
        }
    }
}