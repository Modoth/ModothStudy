import React, { useState, useEffect, memo } from 'react'
import './Library.less'
import Subject from '../../domain/Subject'
import { useServicesLocator, useUser } from '../../app/Contexts'
import ISubjectsService from '../../domain/ISubjectsService'
import { TreeSelect, Button, Space, Radio, Pagination } from 'antd'
import ILangsService from '../../domain/ILangsService'
import {
  Configs,
  TagsApi,
  NodesApi,
  Condition,
  PagedResultNodeItem,
  Query,
  NodeTag,
  NodeItem
} from '../../apis'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { rewindRun } from '../../common/ApiService'
import IViewService from '../services/IViewService'
import { v4 as uuidv4 } from 'uuid'
import { ArticleType } from '../../plugins/IPluginInfo'
import ApiConfiguration from '../../common/ApiConfiguration'
import Article, { articleFromNodeItem } from '../../domain/Article'
import ArticleView from './ArticleView'
import ArticleList from './ArticleList'

const ArticleViewerMemo = memo(ArticleView)

export class SubjectViewModel extends Subject {
  get title() {
    return this.name
  }

  get key() {
    return this.id
  }

  get value() {
    return this.id
  }

  children?: SubjectViewModel[];

  parent?: SubjectViewModel;

  constructor(subject: Subject, allSubjects?: Map<string, SubjectViewModel>) {
    super()
    Object.assign(this, subject)
    if (allSubjects) {
      if (allSubjects.has(subject.path!)) {
        console.log('Subject circle error.')
        throw new Error(Configs.ServiceMessagesEnum.ClientError.toString())
      }
      allSubjects.set(subject.path!, this)
    }
    if (subject.children && subject.children.length) {
      this.children = []
      for (const c of subject.children) {
        const child = new SubjectViewModel(c, allSubjects)
        child.parent = this
        this.children.push(child)
      }
    }
  }
}

export class ArticleTag {
  constructor(
    public name: string,
    public values: string[],
    public id: string
  ) { }

  value?: string;
}

const TagNames = {
  ArticleTagsSurfix: '标签',
  TypeTag: '类型'
}

const getTagEnums = (values?: string) => {
  return values
    ? values
      .split(' ')
      .map((s) => s.trim())
      .filter((s) => s)
    : []
}

export class LibraryProps {
  type: ArticleType;
}
export default function Library(props: LibraryProps) {
  const user = useUser()
  const locator = useServicesLocator()
  const langs = locator.locate(ILangsService)
  const viewService = locator.locate(IViewService)

  const [subjects, setSubjects] = useState<SubjectViewModel[]>([])
  const [subjectsDict, setSubjectsDict] = useState<
    Map<string, SubjectViewModel>
  >(new Map())
  const [subjectsIdDict, setSubjectsIdDict] = useState<
    Map<string, SubjectViewModel>
  >(new Map())
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([])
  const fetchSubjects = async () => {
    const subjectsDict = new Map<string, SubjectViewModel>()
    const sbjs = (await locator.locate(ISubjectsService).all()).map(
      (s) => new SubjectViewModel(s, subjectsDict)
    )
    setSubjectsDict(subjectsDict)
    setSubjectsIdDict(new Map(Array.from(subjectsDict.values(), (s) => [s.id, s])))
    setSubjects(sbjs)
    setSelectedSubjectIds([])
  }

  const [typeTag, setTypeTag] = useState<ArticleTag | undefined>(undefined)
  const [tags, setTags] = useState<ArticleTag[]>([])
  const [nodeTags, setNodeTags] = useState(new Map<string, NodeTag>())
  const fetchTags = async () => {
    const allTags = (
      await rewindRun(() => new TagsApi(ApiConfiguration).allTags())!
    )?.data!
    const tagsDict = new Map(allTags.map((n) => [n.name!, n]))
    const typeTag = tagsDict.get(TagNames.TypeTag)
    if (typeTag) {
      setTypeTag(
        new ArticleTag(typeTag.name!, getTagEnums(typeTag.values), typeTag.id!)
      )
    }
    const articleTags = tagsDict.get(
      props.type.name + TagNames.ArticleTagsSurfix
    )
    if (!articleTags) {
      return
    }
    const tagNames = getTagEnums(articleTags.values)
    if (!tagNames.length) {
      return
    }
    setNodeTags(tagsDict)
    setTags(
      tagNames.map((name) => {
        const nodeTag = tagsDict.get(name)
        return new ArticleTag(name, getTagEnums(nodeTag?.values), nodeTag!.id!)
      })
    )
  }
  const updateTagValue = (idx: number, tag: ArticleTag, value?: string) => {
    tags.splice(idx, 1, { ...tag, value })
    setTags([...tags])
  }

  const [articles, setArticles] = useState<Article[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [articleHandlers] = useState<{ onDelete: { (id: string): void }, editingArticle?: Article }>(
    {} as any
  )
  const [totalCount, setTotalCount] = useState(0)
  const countPerPage = 10

  const convertArticle = (node: NodeItem) => {
    const article = articleFromNodeItem(node)
    const ppath = node.path!.slice(0, node.path!.lastIndexOf('/'))
    article.subjectId = subjectsDict.get(ppath)?.id
      ; (article as any)!.key = uuidv4()
    return article
  }

  const fetchArticles = async (page?: number) => {
    if (!typeTag) {
      return
    }
    if (page === undefined) {
      page = currentPage
    }
    const api = new NodesApi(ApiConfiguration)
    let res: PagedResultNodeItem = null!
    const dateConditions: Condition[] = []
    try {
      const query: Query = {
        where: {
          type: Condition.TypeEnum.And,
          children: [
            {
              type: Condition.TypeEnum.Equal,
              prop: 'Type',
              value: 'BlogNode'
            },
            ...(selectedSubjectIds.length
              ? [
                {
                  type: Condition.TypeEnum.Or,
                  children: selectedSubjectIds.map((sid) => ({
                    type: Condition.TypeEnum.StartsWith,
                    prop: 'Path',
                    value: subjectsIdDict.get(sid)!.path
                  }))
                }
              ]
              : []),
            {
              type: Condition.TypeEnum.Equal,
              prop: typeTag!.name,
              value: props.type.name
            },
            ...tags
              .filter((t) => t.value)
              .map((t) => ({
                type: Condition.TypeEnum.Equal,
                prop: t.name,
                value: t.value
              })),
            ...dateConditions
          ]
        }
      }
      res = (await rewindRun(() =>
        api.queryNodes(
          query,
          undefined,
          countPerPage * (page! - 1),
          countPerPage
        )
      ))!
    } catch (e) {
      viewService!.errorKey(langs, e.message)
      return false
    }
    setArticles(res.data!.map(convertArticle))
    setTotalCount(Math.ceil(res!.total!))
    setCurrentPage(page)
  }

  const updateArticleTag = async (
    article: Article,
    tag: ArticleTag,
    tagValue: string
  ) => {
    const api = new NodesApi(ApiConfiguration)
    try {
      await rewindRun(() => api.updateTag(article.id!, tag.id!, tagValue))
      if (!article.tagsDict) {
        article.tagsDict = new Map()
        article.tags = article.tags || []
      }
      if (!article.tagsDict.has(tag.name)) {
        const newTag: NodeTag = {
          id: tag.id,
          name: tag.name,
          type: NodeTag.TypeEnum.Enum,
          value: tagValue,
          values: tag.values.join(' ')
        }
        article.tags!.push(newTag)
        article.tagsDict.set(tag.name, newTag)
      } else {
        const updatedTag = article.tagsDict.get(tag.name)
        updatedTag!.value = tagValue
      }
    } catch (e) {
      viewService!.errorKey(langs, e.message)
    }
  }

  const addArticleWithTags = async (name: string) => {
    if (!name || !typeTag || !typeTag!.id) {
      return
    }
    try {
      const api = new NodesApi(ApiConfiguration)
      const parentId = selectedSubjectIds.length
        ? selectedSubjectIds[selectedSubjectIds.length - 1]
        : subjects[subjects.length - 1]?.id
      const newArticle = convertArticle(
        (await rewindRun(() => api.createNode(name, 'Blog', parentId)))!
      )
      await updateArticleTag(newArticle, typeTag, props.type.name)
      for (const tag of tags) {
        if (tag.value) {
          await updateArticleTag(newArticle, tag, tag.value)
        }
      }
      articleHandlers.editingArticle = newArticle
      setArticles([...articles, newArticle])
      return true
    } catch (e) {
      viewService!.errorKey(langs, e.message)
      return false
    }
  }

  const addArticle = () => {
    addArticleWithTags(uuidv4())
  }

  const deleteArticle = (id: string) => {
    viewService.prompt(langs.get(Configs.UiLangsEnum.Delete), [], async () => {
      try {
        const api = new NodesApi(ApiConfiguration)
        rewindRun(() => api.removeNode(id))
        const idx = articles.findIndex((a) => a.id === id)
        if (~idx) {
          articles.splice(idx, 1)
          setArticles([...articles])
        }
      } catch (e) {
        viewService!.errorKey(langs, e.message)
        return false
      }
      return true
    })
  }

  articleHandlers.onDelete = deleteArticle

  useEffect(() => {
    fetchSubjects().then(() => fetchTags())
  }, [])

  useEffect(() => {
    fetchArticles(1)
  }, [typeTag])

  console.log(totalCount)
  return (
    <div className="library">
      <Space className="filters" direction="vertical">
        {tags.map((tag, i) => (
          <Radio.Group
            className="tag-list"
            key={tag.name}
            defaultValue={tag.value}
            onChange={(e) => updateTagValue(i, tag, e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button className="tag-item" value={undefined}>
              {'全部'}
            </Radio.Button>
            {...tag.values.map((value) => (
              <Radio.Button className="tag-item" key={value} value={value}>
                {value}
              </Radio.Button>
            ))}
          </Radio.Group>
        ))}
        <div className="search-bar">
          <TreeSelect
            multiple
            className="search-subjects"
            onChange={(value) => setSelectedSubjectIds(value)}
            value={selectedSubjectIds}
            treeData={subjects}
            treeCheckable={true}
            showCheckedStrategy={'SHOW_PARENT'}
            style={{ width: '100%' }}
            placeholder={langs.get(Configs.UiLangsEnum.Subject)}
          />
          <Button
            className="search-btn"
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => fetchArticles(1)}
          ></Button>
        </div>
      </Space>
      <Space className="articles" direction="vertical">
        {articles.map((p) => (
          <ArticleViewerMemo
            key={(p as any)!.key}
            article={p}
            subjects={subjects}
            tags={tags}
            type={props.type}
            articleHandlers={articleHandlers}
            nodeTags={nodeTags}
          ></ArticleViewerMemo>
        ))}
        {user?.editPermission ? (
          <Button
            icon={<PlusOutlined />}
            className="btn-create"
            type="primary"
            onClick={addArticle}
          >
            {langs.get(Configs.UiLangsEnum.Create)}
          </Button>
        ) : null}
        {totalCount > countPerPage ? (
          <Pagination
            className="pagination"
            onChange={(page) => fetchArticles(page)}
            pageSize={countPerPage}
            current={currentPage}
            total={totalCount}
          ></Pagination>
        ) : null}
      </Space>
      <Space className="float-menus">
        <ArticleList></ArticleList>
      </Space>
    </div>
  )
}
