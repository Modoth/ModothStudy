using System;
using System.Linq;
using System.Threading.Tasks;
using ModothStudy.Entity;

namespace ModothStudy.ServiceInterface.EntityServices
{
    public interface ITagsService
    {
        Task RemoveTag(Guid id);

        Task<Tag> AddTag(string name, TagType type, string? values);

        Task UpdateTagValues(Guid id, string values);

        Task UpdateTagName(Guid id, string name);

        IQueryable<Tag> AllTags(string? filter);
    }
}