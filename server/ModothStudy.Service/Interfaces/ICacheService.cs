using System;
using System.Threading.Tasks;

namespace ModothStudy.Service.Interfaces
{
    public interface ICacheService
    {
        void Add(string key, object value);

        T? Get<T>(string key) where T : class;

        T? GetOrAdd<T>(string key, Func<T> getFunc) where T : class;

        Task<T?> GetOrAddAsync<T>(string key, Func<Task<T>> getFunc) where T : class;

        void Remove(string key);
    }
}