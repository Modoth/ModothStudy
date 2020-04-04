using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModothStudy.App.Keys;
using ModothStudy.ServiceInterface.EntityServices;
using Microsoft.Extensions.DependencyInjection;

namespace ModothStudy.App.Common
{
    public static class ControllerUtils
    {
        public static IQueryable<TEntity> Page<TEntity>(this IQueryable<TEntity> entities, int? skip, int? count)
        {
            if (skip.HasValue && skip.Value > 0)
            {
                entities = entities.Skip(skip.Value);
            }

            if (count.HasValue && count.Value > 0)
            {
                entities = entities.Take(count.Value);
            }

            return entities;
        }
    }
}