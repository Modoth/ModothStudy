namespace ModothStudy.App.Common
{
    public class ApiResult
    {
        private static readonly ApiResult Fail = new ApiResult(false);

        private static readonly ApiResult Success = new ApiResult(true);

        public ApiResult(bool result, string? error = null)
        {
            Result = result;
            Error = error;
        }

        public string? Error { get; }

        public bool Result { get; }

        public static implicit operator ApiResult(bool result)
        {
            return result ? Success : Fail;
        }
    }

    public class ApiResult<T> : ApiResult
    {
        public ApiResult(bool result, T data, string? error = null) : base(result, error)
        {
            Data = data;
        }

        public T Data { get; }

        public static implicit operator ApiResult<T>(T data)
        {
            return new ApiResult<T>(true, data);
        }
    }
}