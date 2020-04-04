using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ModothStudy.Entity;

namespace ModothStudy.RepositoryInterface
{
    public interface IRepository<TEntity, TId> where TId : struct where TEntity : class, IEntity<TId>
    {
        Task<TEntity> Create(TEntity entity, bool saveChanges = true);

        Task Create(IEnumerable<TEntity> entities, bool saveChanges = true);

        Task Delete(TEntity entity, bool saveChanges = true);

        Task Delete(IEnumerable<TEntity> entities, bool saveChanges = true);

        IQueryable<TEntity> Retrieve();

        Task SaveChanges();

        Task<TEntity> Update(TEntity entity, bool saveChanges = true);

        Task Update(IEnumerable<TEntity> entities, bool saveChanges = true);
    }
}