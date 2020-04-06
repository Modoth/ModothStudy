using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModothStudy.Entity;
using ModothStudy.RepositoryInterface;
using ModothStudy.ServiceInterface.AppServices;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.CommonServices;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.ServiceInterface.Lang;

namespace ModothStudy.Service.EntityServices
{
    public class NodesService : INodesService
    {
        public readonly static char PATH_SEP = '/';
        private readonly IOperatorService _operatorService;
        private readonly IRepository<Node, Guid> _nodesRepository;
        private readonly IRepository<Tag, Guid> _tagsRepository;
        private readonly INodeQueryCompileService _queryCompiler;
        private readonly IUserPermissionsService _permissionService;
        private readonly IRepository<FileResource, Guid> _filesRepository;
        private readonly Lazy<IFileService> _fileService;

        public NodesService(IOperatorService operatorService,
                 IRepository<Node, Guid> nodesRepository,
                 IRepository<Tag, Guid> tagsRepository,
                 INodeQueryCompileService queryCompiler,
                 IUserPermissionsService permissionService,
                 IRepository<FileResource, Guid> fileRepository,
                 Lazy<IFileService> fileService)
        {
            _operatorService = operatorService;
            _nodesRepository = nodesRepository;
            _tagsRepository = tagsRepository;
            _queryCompiler = queryCompiler;
            _permissionService = permissionService;
            _filesRepository = fileRepository;
            _fileService = fileService;
        }

        public async Task<IQueryable<Node>> AllLevelNodes(Guid nodeId)
        {
            var user = await _operatorService.Operator();
            var node = await _nodesRepository.Retrieve()
            .WhereOwnedOrShared(user)
            .Where(n => n.Id == nodeId)
            .Include(n => n.User)
            .FirstOrDefaultAsync();
            var nodes = _nodesRepository.Retrieve();
            if (node is FolderNode)
            {
                nodes = nodes.Where(n => n == node ||
                (n.Path!.StartsWith(node.Path! + PATH_SEP) && n.User == node.User));
            }
            else
            {
                nodes = nodes.Where(n => n == node);
            }
            return nodes.WhereOwnedOrShared(user);
        }

        public async Task<IQueryable<Node>> GetBlogsByTag(string tag, string? tagValue)
        {
            var user = await _operatorService.Operator();
            var nodes = _nodesRepository.Retrieve().WhereOwnedOrShared(user)

            .Where(b => !(b is BlogNode) || ((BlogNode)b).SolutionTo == null);
            if (!string.IsNullOrWhiteSpace(tag))
            {
                if (!string.IsNullOrWhiteSpace(tagValue))
                {
                    nodes = nodes.Where(b => b.Tags != null && b.Tags.Any(t => t.Tag!.Name == tag && t!.Value == tagValue));
                }
                else
                {
                    nodes = nodes.Where(b => b.Tags != null && b.Tags.Any(t => t.Tag!.Name == tag));
                }
            }

            return nodes.OrderByDescending(b => b.Created);
        }

        public async Task<IQueryable<Node>> SubNodesOrFilterAllSubNodes(Guid? nodeId, string? filter, bool ownedOnly)
        {
            var user = ownedOnly ? await _operatorService.CheckOperator()
            : await _operatorService.Operator();
            var subs = nodeId.HasValue ? await SubNodesOrFilterAllSubNodes(user, nodeId.Value, filter)
            : await RootNodesOrFilterAllNodes(user, filter);
            if (ownedOnly)
            {
                subs = subs.Where(n => n.User == user);
            }
            else
            {
                subs = subs.WhereOwnedOrShared(user);
            }
            return subs.OrderBy(n => n.Path);
        }

        public async Task<IQueryable<Node>> PathNodes(Guid nodeId, bool ownedOnly)
        {
            var user = ownedOnly ? await _operatorService.CheckOperator()
            : await _operatorService.Operator();
            var node = await _nodesRepository.Retrieve().WhereOwnedOrShared(user).
            Include(n => n.User).Where(n => n.Id == nodeId).FirstOrDefaultAsync();
            if (node == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            var sups = _nodesRepository.Retrieve()
            .Where(n => n == node ||
            (n.User == node.User && node.Path!.StartsWith(n.Path + PATH_SEP)));
            if (ownedOnly)
            {
                sups = sups.Where(n => n.User == user);
            }
            else
            {
                sups = sups.WhereOwnedOrShared(user);
            }
            return sups.OrderBy(n => n.Path);
        }

        private async Task<IQueryable<Node>> RootNodesOrFilterAllNodes(User? user, string? filter)
        {
            if (user != null)
            {
                await GetOrCreateUserRootFolder(user!);
            }
            var nodes = _nodesRepository.Retrieve();

            if (string.IsNullOrWhiteSpace(filter))
            {
                nodes = nodes.Where(n => n.Parent == null).WhereOwnedOrShared(user);
            }
            else
            {
                nodes = nodes.WhereOwnedOrShared(user);
                filter = filter!.Trim();
                if (user != null)
                {
                    nodes = nodes.Where(n => n.User == user || n.Path!.StartsWith("/"));
                }
                else
                {
                    nodes = nodes.Where(n => n.Path!.StartsWith("/"));
                }
                nodes = nodes.Where(n =>
                n.Name!.Contains(filter, StringComparison.CurrentCultureIgnoreCase));
            }
            return nodes;
        }

        private async Task<IQueryable<Node>> SubNodesOrFilterAllSubNodes(User? user, Guid nodeId, string? filter)
        {
            var folder = await _nodesRepository.Retrieve()
            .WhereOwnedOrShared(user)
            .Where(n => n.Id == nodeId)
            .OfType<FolderNode>()
            .Include(n => n.User)
            .FirstOrDefaultAsync();
            if (folder == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchFolder));
            }
            var nodes = _nodesRepository.Retrieve().
            WhereOwnedOrShared(user);
            if (string.IsNullOrWhiteSpace(filter))
            {
                return nodes.Where(n => n.Parent == folder);
            }
            else
            {
                filter = filter!.Trim();
                nodes = nodes
                .Where(n => n.User == folder.User && n.Path!.StartsWith(folder.Path! + NodesService.PATH_SEP))
                .Where(n => n.Name!.Contains(filter, StringComparison.CurrentCultureIgnoreCase));
                return nodes;
            }
        }

        private bool ValidateNodeName(string name)
        {
            return !name.Contains(PATH_SEP) && !name.Contains("\\");
        }

        private string JoinPath(string basePath, string name)
        {
            return basePath + PATH_SEP + GetIndexedName(name);
        }

        private Dictionary<char, char> ChineseNumbers = new Dictionary<char, char>
        {
            ['零'] = '0',
            ['一'] = '1',
            ['二'] = '2',
            ['三'] = '3',
            ['四'] = '4',
            ['五'] = '5',
            ['六'] = '6',
            ['七'] = '7',
            ['八'] = '8',
            ['九'] = '9',
        };
        private string GetIndexedName(string name)
        {
            var indexed = new StringBuilder();
            foreach (var c in name)
            {
                if (ChineseNumbers.ContainsKey(c))
                {
                    indexed.Append(ChineseNumbers[c]);
                }
                indexed.Append(c);
            }
            return indexed.ToString();
        }

        private string GetIndexedPath(string path)
        {
            var names = path.Split(PATH_SEP);
            if (names.Length < 3)
            {
                return path;
            }
            var sb = new StringBuilder();
            sb.Append(names[0]);
            sb.Append(names[1]);
            for (var i = 2; i < names.Length; i++)
            {
                sb.Append(GetIndexedName(names[i]));
            }
            return String.Join(PATH_SEP, names);
        }

        public async Task<Node> AddFolder(Guid? parentId, string name)
        {
            var user = await _operatorService.CheckOperator();
            var folder = new FolderNode { };
            return await AddNode(parentId, name, folder, user);
        }

        private async Task<FolderNode> GetOrCreateFolderById(Guid? parentId, User user)
        {
            return parentId.HasValue ? await GetFolderById(parentId.Value, user)
                        : await GetOrCreateUserRootFolder(user);
        }

        private async Task<Node> AddNode(Guid? parentId, string name, Node newNode, User user)
        {
            var nodeNames = name.Split(PATH_SEP).Where(n => !string.IsNullOrWhiteSpace(n))
            .Select(n => n.Trim()).ToList();
            if (!nodeNames.Any())
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidNodeName));
            }
            var newNodeName = nodeNames.Last();
            if (!ValidateNodeName(newNodeName))
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidNodeName));
            }
            var parent = await GetOrCreateFolderById(parentId, user);
            for (var i = 0; i < nodeNames.Count - 1; i++)
            {
                var nodeName = nodeNames[i];
                var existedFolder = await _nodesRepository.Retrieve()
            .Where(n => n.Parent == parent && n.Name! == nodeName && n.User == parent.User)
            .FirstOrDefaultAsync();
                if (existedFolder != null)
                {
                    if (existedFolder is FolderNode)
                    {
                        parent = (FolderNode)existedFolder;
                        continue;
                    }
                    else
                    {
                        throw new ServiceException(nameof(ServiceMessages.InvalidNodeName));
                    }
                }
                var newFolder = new FolderNode
                {
                    Name = nodeName,
                    Parent = parent,
                    Shared = parent.Shared,
                    Path = JoinPath(parent.Path!, nodeName),
                    User = user,
                    Created = DateTime.Now
                };
                parent = newFolder;
            }
            var existedNode = await _nodesRepository.Retrieve()
            .Where(n => n.Parent == parent && n.Name! == newNodeName && n.User == parent.User)
            .FirstOrDefaultAsync();
            if (existedNode != null)
            {
                if (existedNode is FolderNode && newNode is FolderNode)
                {
                    return existedNode;
                }
                if (existedNode is FolderNode || newNode is FolderNode)
                {
                    throw new ServiceException(nameof(ServiceMessages.ConflictNodeName));
                }
            }
            newNode.Name = newNodeName;
            newNode.Parent = parent;
            newNode.Shared = parent.Shared;
            newNode.Path = JoinPath(parent.Path!, newNodeName);
            newNode.User = user;
            newNode.Created = DateTime.Now;
            return await _nodesRepository.Create(newNode);
        }

        private async Task<FolderNode> GetOrCreateUserRootFolder(User user)
        {
            string prefix = "";
            return await GetOrCreateUserDefaultFolder(prefix + PATH_SEP + user.Name, user);
        }

        private async Task<FolderNode> GetOrCreateUserSolutionsFolder(User user)
        {
            string prefix = "!";
            return await GetOrCreateUserDefaultFolder(prefix + PATH_SEP + user.Name, user);
        }

        private async Task<FolderNode> GetOrCreateUserDefaultFolder(string rootPath, User user)
        {
            var root = await _nodesRepository.Retrieve()
            .Where(n => n.Parent == null && n.Path == rootPath && n.User == user)
            .FirstOrDefaultAsync();
            if (root is FolderNode rootFolder)
            {
                return rootFolder;
            }
            var newRoot = new FolderNode { Path = rootPath, Name = user.Name, User = user };
            return (FolderNode)(await _nodesRepository.Create(newRoot));
        }

        private async Task<FolderNode> GetFolderById(Guid parentId, User user)
        {
            var node = await _nodesRepository.Retrieve().WhereOwned(user).Where(n => n.Id == parentId).FirstOrDefaultAsync();
            if (!(node is FolderNode))
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchFolder));
            }
            var parent = (FolderNode)node;
            return parent;
        }

        public async Task<Node> AddBlog(Guid? parentId, string name)
        {
            var user = await _operatorService.CheckOperator();
            var blog = new BlogNode();
            return await AddNode(parentId, name, blog, user);
        }

        public async Task<Node> AddReference(Guid? parentId, string? name, Guid refId)
        {
            var user = await _operatorService.CheckOperator();
            var refNode = await (await GetNodeById(refId)).Include(n => n.Reference).FirstOrDefaultAsync();
            if (refNode == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            if (refNode.Reference != null)
            {
                refNode = refNode.Reference;
            }
            var newNode = refNode is BlogNode ? (Node)new BlogNode() : new FolderNode();
            newNode.Reference = refNode;
            return await AddNode(parentId, string.IsNullOrWhiteSpace(name) ? refNode.Name! : name!, newNode, user);
        }

        public async Task RemoveNode(Guid nodeId)
        {
            var user = await _operatorService.CheckOperator();
            var node = await _nodesRepository.Retrieve()
            .Where(n => n.User == user && n.Id == nodeId)
            .Include(n => n.User)
            .FirstOrDefaultAsync();
            if (node == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            var children = _nodesRepository.Retrieve()
            .Where(n => n.User == node.User && n.Path!.StartsWith(node.Path! + PATH_SEP));
            await _nodesRepository.Delete(node, false);
            await _nodesRepository.Delete(children);
        }

        public async Task Rename(Guid nodeId, string newName)
        {
            if (!ValidateNodeName(newName))
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidNodeName));
            }
            var user = await _operatorService.CheckOperator();
            var node = await _nodesRepository.Retrieve()
            .Where(n => n.User == user && n.Id == nodeId && n.Parent != null)
            .Include(n => n.Parent)
            .FirstOrDefaultAsync();
            if (node == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            if (node is FolderNode)
            {
                var existedNode = await _nodesRepository.Retrieve()
                .Where(n => n.Parent == node && n.User == user && n.Name == newName).FirstOrDefaultAsync();
                if (existedNode != null)
                {
                    throw new ServiceException(nameof(ServiceMessages.ConflictNodeName));
                }
                var childrenPathSufix = node.Path + PATH_SEP;
                node.Path = JoinPath(node.Parent!.Path!, newName);
                node.Name = newName;
                await _nodesRepository.Update(node, false);
                var subsNodes = _nodesRepository.Retrieve()
                .Where(n => n.User == user && n.Path!.StartsWith(childrenPathSufix));
                foreach (var sub in subsNodes)
                {
                    sub.Path = JoinPath(node.Path, sub.Path!.Substring(childrenPathSufix.Length));
                }
                await _nodesRepository.Update(subsNodes);
            }
            else
            {
                node.Path = JoinPath(node.Parent!.Path!, newName); ;
                node.Name = newName;
                await _nodesRepository.Update(node);
            }
        }

        public async Task MoveNode(Guid nodeId, Guid? parentId)
        {
            var user = await _operatorService.CheckOperator();
            var node = await _nodesRepository.Retrieve()
            .Where(n => n.User == user && n.Id == nodeId && n.Parent != null)
            .Include(n => n.Parent)
            .FirstOrDefaultAsync();
            if (node == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            var folder = parentId.HasValue ?
            await _nodesRepository.Retrieve().OfType<FolderNode>()
            .Where(n => n.User == user && n.Id == parentId.Value).FirstOrDefaultAsync() :
            await GetOrCreateUserRootFolder(user);
            if (folder == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            if (node is FolderNode)
            {
                var existedNode = await _nodesRepository.Retrieve()
                .Where(n => n.User == user && n.Parent == folder && n.Name == node.Name).FirstOrDefaultAsync();
                if (existedNode != null)
                {
                    throw new ServiceException(nameof(ServiceMessages.ConflictNodeName));
                }
                node.Parent = folder;
                var childrenPathSufix = node.Path + PATH_SEP;
                node.Path = JoinPath(folder.Path!, node.Name!);
                await _nodesRepository.Update(node, false);
                var subsNodes = _nodesRepository.Retrieve()
                .Where(n => n.User == user && n.Path!.StartsWith(childrenPathSufix));
                foreach (var sub in subsNodes)
                {
                    sub.Path = JoinPath(node.Path, sub.Path!.Substring(childrenPathSufix.Length));
                }
                await _nodesRepository.Update(subsNodes);
            }
            else
            {
                node.Parent = folder;
                node.Path = JoinPath(folder.Path!, node.Name!);
                await _nodesRepository.Update(node);
            }
        }

        public async Task<IQueryable<Node>> GetNodeById(Guid nodeId)
        {
            var user = await _operatorService.Operator();
            return _nodesRepository.Retrieve().WhereOwnedOrShared(user).Where(n => n.Id == nodeId);
        }

        public async Task UpdateBlogContent(Guid blogId, string content, string[]? files)
        {
            var user = await _operatorService.CheckOperator();

            var blogNode = await _nodesRepository.Retrieve().WhereOwned(user).OfType<BlogNode>()
            .Include(b => b.Detail)
            .Include(b => b.Files).ThenInclude(f => f.File)
            .Where(n => n.Id == blogId).FirstOrDefaultAsync() as BlogNode;
            if (blogNode == default)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            if (blogNode.Detail == null)
            {
                blogNode.Detail = new BlogDetail();
            }
            blogNode.Detail.Content = content;
            await UpdateBlogFiles(blogNode, files);
            await _nodesRepository.Update(blogNode);
        }

        private async Task UpdateBlogFiles(BlogNode blog, string[]? filePaths)
        {
            if (blog.Files == null)
            {
                blog.Files = new List<BlogFile>();
            }
            var filesIndies = new Dictionary<FileResource, int>();
            if (filePaths != null && filePaths.Length > 0)
            {
                var filePathsSet = new HashSet<string>(filePaths);
                var files = await _filesRepository.Retrieve().Where(f => filePathsSet.Contains(f.Path))
                .ToDictionaryAsync(f => f.Path);

                for (var i = 0; i < filePaths.Length; i++)
                {
                    if (!files.ContainsKey(filePaths[i]))
                    {
                        throw new ServiceException(nameof(ServiceMessages.NoSuchFile));
                    }
                    filesIndies[files[filePaths[i]]] = i;
                }
            }

            foreach (var f in blog.Files)
            {
                f.Order = -1;
                if (filesIndies.ContainsKey(f.File!))
                {
                    f.Order = filesIndies[f.File!];
                    filesIndies.Remove(f.File!);
                }
            }
            foreach (var f in filesIndies.Keys)
            {
                blog.Files.Add(new BlogFile { Blog = blog, File = f, Order = filesIndies[f] });
            }
        }

        public async Task<Guid> UpdateBlogSolution(Guid blogId, string title, string content, string[]? files)
        {
            var user = await _operatorService.CheckOperator();
            var blog = await _nodesRepository.Retrieve().WhereOwnedOrShared(user).OfType<BlogNode>()
            .Where(n => n.Id == blogId)
            .Include(n => n.User)
            .FirstOrDefaultAsync();
            if (blog == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            if (user != blog.User)
            {
                var noPermissions = await _permissionService.CheckLackedPermissions(user.Id,
                 new[] { nameof(PermissionDescriptions.PERMISSION_REPLY_SOLUTION) });
                if (noPermissions.Any())
                {
                    throw new ServiceException(nameof(ServiceMessages.NoPermission));
                }
            }
            var solution = await _nodesRepository.Retrieve()
               .OfType<BlogNode>().Where(s => s.SolutionTo == blog && s.User == user)
               .Include(b => b.Detail)
                .Include(b => b.Files).ThenInclude(f => f.File).FirstOrDefaultAsync();
            if (solution == null)
            {
                var newSolution = new BlogNode { SolutionTo = blog };
                newSolution.Detail = new BlogDetail { Blog = newSolution, Content = content };
                var parent = await GetOrCreateUserSolutionsFolder(user);
                await AddNode(parent.Id, title, newSolution, user);
                return newSolution.Id;
            }
            if (solution.Detail == null)
            {
                solution.Detail = new BlogDetail { Blog = solution };
            }
            solution.Name = title;
            solution.Detail.Content = content;
            await _nodesRepository.Update(solution);
            return solution.Id;
        }

        public async Task<IQueryable<BlogNode>> GetBlogSolutions(Guid blogId)
        {
            var user = await _operatorService.Operator();
            var blog = await (await GetNodeById(blogId)).OfType<BlogNode>().FirstOrDefaultAsync();
            if (blog == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            return _nodesRepository.Retrieve().WhereOwnedOrShared(user)
            .OfType<BlogNode>()
            .Where(b => b.SolutionTo == blog);
        }

        public async Task<IQueryable<BlogNode>> GetBlogDefaultSolution(Guid blogId)
        {
            var user = await _operatorService.Operator();
            var blog = await (await GetNodeById(blogId)).OfType<BlogNode>().Include(b => b.User).FirstOrDefaultAsync();
            if (blog == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            return _nodesRepository.Retrieve().WhereOwnedOrShared(user).OfType<BlogNode>().Where(b => b.SolutionTo == blog && b.User == blog.User);
        }

        public async Task<IQueryable<BlogNode>> GetBlogCustomSolution(Guid blogId)
        {
            var user = await _operatorService.CheckOperator();
            var blog = await (await GetNodeById(blogId)).OfType<BlogNode>().FirstOrDefaultAsync();
            if (blog == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            return _nodesRepository.Retrieve().Where(n => n.User == user).OfType<BlogNode>().Where(b => b.SolutionTo == blog);
        }

        public async Task UpdateNodeShared(Guid nodeId, bool shared)
        {
            var user = await _operatorService.CheckOperator();
            var node = await (await GetNodeById(nodeId)).Where(n => n.User == user).FirstOrDefaultAsync();
            if (node == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            if (node.Shared == shared)
            {
                return;
            }
            if (node is FolderNode)
            {
                var subs = await _nodesRepository.Retrieve().Where(n => n.User == user &&
            n.Path!.StartsWith(node.Path! + PATH_SEP)).ToArrayAsync();
                foreach (var sub in subs)
                {
                    sub.Shared = shared;
                }
                await this._nodesRepository.Update(subs, false);
            }
            node.Shared = shared;
            await this._nodesRepository.Update(node);
            return;

        }

        public async Task AddTag(Guid nodeId, Guid tagId, string? value)
        {
            var user = await _operatorService.CheckOperator();
            var node = await this._nodesRepository.Retrieve()
            .Include(n => n.Tags).ThenInclude(t => t.Tag)
            .Where(n => n.Id == nodeId && n.User!.Id == user.Id).FirstOrDefaultAsync();
            if (node == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            var nodeTag = default(NodeTag);
            if (node.Tags == null)
            {
                node.Tags = new List<NodeTag>();
            }
            else
            {
                nodeTag = node.Tags.FirstOrDefault(t => t.Tag!.Id == tagId);
            }
            if (nodeTag == default)
            {
                var tag = await this._tagsRepository.Retrieve().Where(t => t.Id == tagId).FirstOrDefaultAsync();
                if (tag == null)
                {
                    throw new ServiceException(nameof(ServiceMessages.NoSuchTag));
                }
                nodeTag = new NodeTag { Node = node, Tag = tag };
                node.Tags.Add(nodeTag);
            }
            if (!this.CheckTagValue(nodeTag.Tag!, value))
            {
                throw new ServiceException(nameof(ServiceMessages.InvalidTagValues));
            }
            nodeTag.Value = value;
            await this._nodesRepository.Update(node);
        }

        private bool CheckTagValue(Tag tag, string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return true;
            }
            switch (tag.Type)
            {
                case TagType.Bool:
                    return false;
                case TagType.Enum:
                    return tag.Values == null ? false : tag.Values.Split(" ").Select(v => v.Trim()).Where(v => v != "").Contains(value);
                case TagType.Number:
                    int v;
                    return int.TryParse(value, out v);
                case TagType.String:
                    return true;
                case TagType.Url:
                    return true;
                case TagType.Private:
                    return true;
            }
            return false;

        }

        public async Task RemoveTag(Guid nodeId, Guid tagId)
        {
            var user = await _operatorService.CheckOperator();
            var node = await this._nodesRepository.Retrieve()
            .Include(n => n.Tags).ThenInclude(t => t.Tag)
            .Where(n => n.Id == nodeId && n.User!.Id == user.Id).FirstOrDefaultAsync();
            if (node == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            if (node.Tags == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchTag));
            }
            var nodeTag = node.Tags.FirstOrDefault(t => t.Tag!.Id == tagId);
            if (nodeTag == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchTag));
            }
            node.Tags.Remove(nodeTag);
            await this._nodesRepository.Update(node);
        }

        public async Task<IQueryable<Node>?> QueryNodes(Query? query, string? filter)
        {
            var user = await _operatorService.Operator();
            var nodes = _nodesRepository.Retrieve().WhereOwnedOrShared(user)
             .Where(b => !(b is BlogNode) || ((BlogNode)b).SolutionTo == null);
            if (query != null)
            {
                var parentPaths = default(IEnumerable<NodeParentId>);
                var parents = nodes.Where(n => n is FolderNode);
                if (!string.IsNullOrWhiteSpace(query.Parent))
                {
                    var indexedParentPath = GetIndexedPath(query.Parent!);
                    parentPaths = await nodes.Where(n => n is FolderNode && n.Path == indexedParentPath).Select(
                    n => new NodeParentId { Path = n.Path + PATH_SEP, UserId = n.User!.Id }
                ).ToArrayAsync();
                    if (parentPaths.Count() == 0)
                    {
                        // throw new ServiceException(nameof(ServiceMessages.InvalidQuery));
                        return null;
                    }
                }
                var queryFunc = this._queryCompiler.Compile(parentPaths, query);
                nodes = nodes.Where(queryFunc);
            }
            if (!string.IsNullOrWhiteSpace(filter))
            {
                filter = filter!.Trim();
                nodes = nodes.Where(n =>
                n.Name!.Contains(filter, StringComparison.CurrentCultureIgnoreCase));
            }
            if (query != null && !string.IsNullOrWhiteSpace(query.OrderBy))
            {
                Expression<Func<Node, Object>>? orderBy = default;
                switch (query.OrderBy)
                {
                    case nameof(Node.Name):
                        orderBy = node => node.Name!;
                        break;
                    case nameof(Node.Created):
                        orderBy = node => node.Created;
                        break;
                }
                if (orderBy == null)
                {
                    throw new ServiceException(nameof(ServiceMessages.InvalidQuery));
                }
                if (query.OrderByDesc == true)
                {
                    nodes = nodes.OrderByDescending(orderBy);
                }
                else
                {
                    nodes = nodes.OrderBy(orderBy);
                }
            }
            return nodes;
        }

        public async Task DeleteTempBlogFiles(Guid blogId)
        {
            var user = await _operatorService.CheckOperator();

            var blogNode = await _nodesRepository.Retrieve().WhereOwned(user).OfType<BlogNode>()
            .Include(b => b.Files).ThenInclude(f => f.File)
            .Where(n => n.Id == blogId).FirstOrDefaultAsync() as BlogNode;
            if (blogNode == default)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            var deletingFiles = blogNode.Files.Where(f => f.Order < 0).Select(f => f.File!);
            var fileService = _fileService.Value;
            await fileService.DeleteFiles(deletingFiles);
        }

        private (string?, string?) GetParentPath(string path)
        {
            var lastIdx = path.LastIndexOf('/');
            if (lastIdx < 0)
            {
                return (null, path);
            }
            return (path.Substring(0, lastIdx), path.Substring(lastIdx + 1, path.Length - lastIdx - 1));
        }

        public async Task CreateOrUpdateBlogContent(string path, string content)
        {
            var user = await _operatorService.CheckOperator();
            path = GetIndexedPath(path);
            var node = await _nodesRepository.Retrieve().Where(n => n.Path == path)
            .Include(n => n.User).FirstOrDefaultAsync();
            if (node != null)
            {
                if (node.User == user && node is BlogNode)
                {
                    var blogNode = await _nodesRepository.Retrieve().Where(n => n.Id == node.Id)
                    .OfType<BlogNode>().Include(b => b.Detail).FirstAsync();
                    if (blogNode.Detail == null)
                    {
                        blogNode.Detail = new BlogDetail();
                    }
                    blogNode.Detail.Content = content;
                    await _nodesRepository.Update(blogNode);
                    return;
                }
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            var nodeName = path.StartsWith(PATH_SEP) ? String.Join(PATH_SEP, path.Split(PATH_SEP).Skip(2)) : path;
            node = new BlogNode { Detail = new BlogDetail { Content = content } };
            await AddNode(null, nodeName, node, user);
        }

        public async Task UpdateNodeGroupShared(Guid nodeId, bool shared)
        {
            var user = await _operatorService.CheckOperator();
            var node = await (await GetNodeById(nodeId)).Where(n => n.User == user).FirstOrDefaultAsync();
            if (node == null)
            {
                throw new ServiceException(nameof(ServiceMessages.NoSuchNode));
            }
            if (node.GroupShared == shared)
            {
                return;
            }
            node.GroupShared = shared;
            await this._nodesRepository.Update(node);
            return;
        }
    }

    public static class NodesServiceFilters
    {
        public static IQueryable<Node> WhereOwnedOrShared(this IQueryable<Node> nodes, User? user) => user == null ? nodes.WhereShared() : nodes.WhereOwned(user);

        public static IQueryable<Node> WhereOwned(this IQueryable<Node> nodes, User user) => nodes.Where(n => n.User == user || n.Shared);

        public static IQueryable<Node> WhereOwnedOrGroupShared(this IQueryable<Node> nodes, User user) => nodes.Where(n => n.User == user || (n.GroupShared && n.User != null && n.User.Role != null && n.User.Role == user.Role));

        public static IQueryable<Node> WhereShared(this IQueryable<Node> nodes) => nodes.Where(n => n.Shared && n.User != null);
    }
}