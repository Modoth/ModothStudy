using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ModothStudy.Service.Interfaces;

namespace ModothStudy.Service.CommonServices
{
    public class CacheServiceSingleton : ICacheService
    {
        private readonly Dictionary<string, object> _values = new Dictionary<string, object>();

        public void Add(string key, object value)
        {
            _values[key] = value;
        }

        public T? Get<T>(string key) where T : class
        {
            if (_values.TryGetValue(key, out var value) && value != null)
            {
                return (T)value;
            }

            return default;
        }

        public T? GetOrAdd<T>(string key, Func<T> getFunc) where T : class
        {
            if (_values.TryGetValue(key, out var value) && value != null)
            {
                return (T)value;
            }

            var newValue = getFunc();
            _values[key] = newValue;
            return newValue;
        }

        public async Task<T?> GetOrAddAsync<T>(string key, Func<Task<T>> getFunc) where T : class
        {
            if (_values.TryGetValue(key, out var value) && value != null)
            {
                return (T)value;
            }

            var newValue = await getFunc();
            _values[key] = newValue;
            return newValue;
        }

        public void Remove(string key)
        {
            _values.Remove(key);
        }
    }
}