namespace ModothStudy.App.Common
{
    public class PagedResult<TEntity>
    {
        public PagedResult(int total, TEntity[] data)
        {
            Total = total;
            Data = data;
        }
        public TEntity[] Data { get; set; }

        public int Total { get; set; }
    }
}