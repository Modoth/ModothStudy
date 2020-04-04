namespace ModothStudy.Entity
{
    public interface IEntity<TId> where TId : struct
    {
        TId Id { get; set; }
    }
}