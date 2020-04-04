using System;
using System.Linq;
using System.Threading.Tasks;

namespace ModothStudy.Generator
{
    public static class TypeExtensions
    {
        public static bool IsTaskType(this Type t)
        {
            return t == typeof(Task) || t == typeof(Task<>);
        }

        public static bool NeedReturn(this Type t)
        {
            return t != typeof(Task) && t != typeof(void);
        }

        public static string ToGenericSimpleName(this Type t)
        {
            if (!t.IsGenericType)
            {
                return t.FullName;
            }

            var genericTypeName = t.GetGenericTypeDefinition().FullName;
            return genericTypeName.Substring(0,
                genericTypeName.IndexOf('`'));

            ;
        }

        public static string ToSourceCodeType(this Type t)
        {
            if (!t.IsGenericType)
            {
                return t.FullName;
            }

            var genericTypeName = t.GetGenericTypeDefinition().FullName;
            genericTypeName = genericTypeName.Substring(0,
                genericTypeName.IndexOf('`'));

            var genericArgs = string.Join(",",
                t.GetGenericArguments()
                    .Select(ToSourceCodeType).ToArray());

            return genericTypeName + "<" + genericArgs + ">";
        }
    }
}