using System.Linq;
using Microsoft.AspNetCore.Mvc.Filters;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.App.Common
{
    public class ModelStateValidatorFilter : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {               
                throw new ServiceException(nameof(ServiceMessages.ClientError));
            }
        }
    }
}