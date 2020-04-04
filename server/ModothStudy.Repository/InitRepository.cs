using System.Threading.Tasks;
using ModothStudy.RepositoryInterface;

namespace ModothStudy.Repository
{
    public class InitRepository : IInitRepository
    {
        public InitRepository(DataContextBase context)
        {
            Context = context;
        }

        private DataContextBase Context { get; }

        public async Task Init()
        {
            //await Context.Database.EnsureDeletedAsync();
            await Context.Database.EnsureCreatedAsync();
            //await Context.Database.MigrateAsync();
        }
    }
}