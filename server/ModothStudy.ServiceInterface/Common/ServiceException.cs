using System;

namespace ModothStudy.ServiceInterface.Common
{
    public class ServiceException : Exception
    {
        public ServiceException(string message) : base(message)
        {
        }
    }
}