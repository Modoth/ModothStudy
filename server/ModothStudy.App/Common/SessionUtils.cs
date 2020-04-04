using System;
using Microsoft.AspNetCore.Http;

namespace ModothStudy.App.Common
{
    public static class SessionUtils
    {
        public static Guid? GetGuid(this ISession session, string key)
        {
            var str = session.GetString(key);
            if (str != null && Guid.TryParse(str, out var value))
            {
                return value;
            }
            return null;
        }
    }
}