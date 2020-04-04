using System;

namespace ModothStudy.Service.Common
{
    public class CacheServiceAttribute : Attribute
    {
        public CacheServiceAttribute(string? cacheKey = null, bool isGet = true, params string[] vars)
        {
            CacheKey = cacheKey;
            IsGet = isGet;
            Vars = vars;
        }

        public string? CacheKey { get; }

        public bool IsGet { get; }

        public string[] Vars { get; }
    }
}