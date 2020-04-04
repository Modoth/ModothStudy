using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModothStudy.Entity;
using ModothStudy.RepositoryInterface;

namespace ModothStudy.Repository
{
    public abstract class Repository<TEntity, TId> : IRepository<TEntity, TId>
        where TId : struct where TEntity : class, IEntity<TId>
    {
        protected Repository(DbContext context)
        {
            Context = context;
        }

        protected DbContext Context { get; }

        protected abstract DbSet<TEntity> Entities { get; }

        public async Task<TEntity> Create(TEntity entity, bool saveChanges = true)
        {
            var entry = await Entities.AddAsync(entity);
            if (saveChanges)
            {
                await Context.SaveChangesAsync();
            }

            return entry.Entity;
        }

        public async Task Create(IEnumerable<TEntity> entities, bool saveChanges = true)
        {
            await Entities.AddRangeAsync(entities);
            if (saveChanges)
            {
                await Context.SaveChangesAsync();
            }
        }

        public async Task Delete(TEntity entity, bool saveChanges = true)
        {
            Entities.Remove(entity);
            if (saveChanges)
            {
                await Context.SaveChangesAsync();
            }
        }

        public async Task Delete(IEnumerable<TEntity> entities, bool saveChanges = true)
        {
            Entities.RemoveRange(entities);
            if (saveChanges)
            {
                await Context.SaveChangesAsync();
            }
        }

        public IQueryable<TEntity> Retrieve()
        {
            return Entities;
        }

        public async Task SaveChanges()
        {
            await Context.SaveChangesAsync();
        }

        public async Task<TEntity> Update(TEntity entity, bool saveChanges = true)
        {
            var entry = Entities.Update(entity);
            if (saveChanges)
            {
                await Context.SaveChangesAsync();
            }

            return entry.Entity;
        }

        public async Task Update(IEnumerable<TEntity> entities, bool saveChanges = true)
        {
            Entities.UpdateRange(entities);
            if (saveChanges)
            {
                await Context.SaveChangesAsync();
            }
        }
    }
}