using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModothStudy.Entity;
using ModothStudy.RepositoryInterface;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.Service.EntityServices
{
    public class TagsService : ITagsService
    {
        private readonly IRepository<Tag, Guid> _tagsRepository;

        public TagsService(IRepository<Tag, Guid> tagsRepository)
        {
            this._tagsRepository = tagsRepository;
        }

        private bool InvalidName(string name)
        {
            return String.IsNullOrWhiteSpace(name);
        }

        private bool InvalidValues(string? values)
        {
            return String.IsNullOrWhiteSpace(values);
        }

        private void CheckValues(string? values)
        {
            if (InvalidValues(values))
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidTagValues));
            }
        }

        private async Task CheckName(string name)
        {
            if (InvalidName(name))
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidTagName));
            }
            var existedTag = await this._tagsRepository.Retrieve().Where(t => t.Name == name).FirstOrDefaultAsync();
            if (existedTag != null)
            {
                throw new ServiceException(nameof(ServiceMessages.ConflictTagName));
            }
        }
        public async Task<Tag> AddTag(string name, TagType type, string? values)
        {
            if (type == TagType.Enum)
            {
                this.CheckValues(values);
            }
            await this.CheckName(name);
            return await this._tagsRepository.Create(new Tag
            {
                Name = name,
                Type = type,
                Values = values
            });
        }

        public IQueryable<Tag> AllTags(string? filter)
        {
            var tags = this._tagsRepository.Retrieve();
            if (!String.IsNullOrWhiteSpace(filter))
            {
                tags = tags.Where(t => t.Name!.Contains(filter, StringComparison.InvariantCultureIgnoreCase));
            }
            return tags;
        }

        public async Task RemoveTag(Guid id)
        {
            var existedTag = await this._tagsRepository.Retrieve().Where(t => t.Id == id).FirstOrDefaultAsync();
            if (existedTag == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchTag));
            }
            await this._tagsRepository.Delete(existedTag);
        }

        public async Task UpdateTagName(Guid id, string name)
        {
            await this.CheckName(name);
            var existedTag = await this._tagsRepository.Retrieve().Where(t => t.Id == id).FirstOrDefaultAsync();
            if (existedTag == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchTag));
            }
            existedTag.Name = name;
            await this._tagsRepository.Update(existedTag);
        }

        public async Task UpdateTagValues(Guid id, string values)
        {
            var existedTag = await this._tagsRepository.Retrieve().Where(t => t.Id == id).FirstOrDefaultAsync();
            if (existedTag == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchTag));
            }
            if (existedTag.Type != TagType.Enum)
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidTagValues));
            }
            this.CheckValues(values);
            existedTag.Values = values;
            await this._tagsRepository.Update(existedTag);
        }
    }
}