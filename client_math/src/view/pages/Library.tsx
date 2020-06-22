import React, { useState, useEffect } from 'react'
import './Library.less'
import Subject from '../../domain/Subject'
import { useServicesLocator, useUser } from '../../app/Contexts'
import ISubjectsService from '../../domain/ISubjectsService'
import {
  TreeSelect,
  Button,
  Space,
  Radio,
  Input,
  Pagination,
  Card
} from 'antd'
import ILangsService from '../../domain/ILangsService'
import {
  Configs,
  TagsApi,
  NodesApi,
  Condition,
  PagedResultNodeItem,
  NodeItem,
  Query
} from '../../apis'
import { PlusOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons'
import { rewindRun } from '../../common/ApiService'
import IViewService from '../services/IViewService'
import { v4 as uuidv4 } from 'uuid'
import { ArticleType } from '../../plugins/IPluginInfo'

class SubjectViewModel extends Subject {
  get title () {
    return this.name
  }

  get key () {
    return this.id
  }

  get value () {
    return this.id
  }

  children?: SubjectViewModel[];

  parent?: SubjectViewModel;

  constructor (subject: Subject) {
    super()
    Object.assign(this, subject)
    if (subject.children && subject.children.length) {
      this.children = []
      for (const c of subject.children) {
        const child = new SubjectViewModel(c)
        child.parent = this
        this.children.push(child)
      }
    }
  }
}

class ArticleTag {
  constructor (
    public name: string,
    public values: string[],
    public id?: string
  ) {}

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
export default function Library (props: LibraryProps) {
  const user = useUser()
  const locator = useServicesLocator()
  const langs = locator.locate(ILangsService)
  const viewService = locator.locate(IViewService)

  const [subjects, setSubjects] = useState<SubjectViewModel[]>([])
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([])
  const fetchSubjects = async () => {
    const sbjs = (await locator.locate(ISubjectsService).all()).map(
      (s) => new SubjectViewModel(s)
    )
    setSubjects(sbjs)
    setSelectedSubjectIds([])
  }

  const yearsCount = 10
  const currentYear = new Date().getFullYear()
  const [timeTag, setTimeTag] = useState<ArticleTag>(
    new ArticleTag(
      '时间',
      Array.from({ length: yearsCount }, (_, i) => (currentYear - i).toString())
    )
  )
  const [typeTag, setTypeTag] = useState<ArticleTag | undefined>(undefined)
  const [tags, setTags] = useState<ArticleTag[]>([])
  const fetchTags = async () => {
    const nodeTags = (await rewindRun(() => new TagsApi().allTags())!)?.data!
    const tagsDict = new Map(nodeTags.map((n) => [n.name, n]))
    const typeTag = tagsDict.get(TagNames.TypeTag)
    if (typeTag) {
      setTypeTag(
        new ArticleTag(typeTag.name!, getTagEnums(typeTag.values), typeTag.id)
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
    setTags(
      tagNames.map((name) => {
        const nodeTag = tagsDict.get(name)
        return new ArticleTag(name, getTagEnums(nodeTag?.values), nodeTag?.id)
      })
    )
  }
  const updateTagValue = (idx: number, tag: ArticleTag, value?: string) => {
    tags.splice(idx, 1, { ...tag, value })
    setTags([...tags])
  }

  const [filter, setFilter] = useState('')
  const [articles, setArticles] = useState<NodeItem[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const countPerPage = 10

  const fetchArticles = async (page?: number) => {
    if (!typeTag) {
      return
    }
    if (page === undefined) {
      page = currentPage
    }
    const api = new NodesApi()
    let res: PagedResultNodeItem = null!
    const dateConditions:Condition[] = []
    if (timeTag.value) {
      const year = parseInt(timeTag.value)
      dateConditions.push({
        type: Condition.TypeEnum.And,
        children: [
          {
            type: Condition.TypeEnum.GreaterThanOrEqual,
            prop: 'Published',
            value: new Date(year, 0, 1).getTime().toString()
          }, {
            type: Condition.TypeEnum.LessThenOrEqual,
            prop: 'Published',
            value: new Date(year + 1, 0, 1).getTime().toString()
          }
        ]
      })
    }
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
            ...(selectedSubjectIds.length ? [{
              type: Condition.TypeEnum.Or,
              children: selectedSubjectIds.map(sid => ({
                type: Condition.TypeEnum.Equal,
                prop: 'ParentId',
                value: sid
              }))
            }] : []),
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
      console.log(query)
      res = (await rewindRun(() =>
        api.queryNodes(query, filter, currentPage * (page! - 1), countPerPage)
      ))!
    } catch (e) {
      viewService!.errorKey(langs, e.message)
      return false
    }
    setArticles(res.data!.map((n) => n))
    setTotalPage(Math.ceil(res!.total! / countPerPage))
    setCurrentPage(page)
  }

  const updateArticleTag = async (
    article: NodeItem,
    tag: ArticleTag,
    tagValue: string
  ) => {
    const api = new NodesApi()
    try {
      await rewindRun(() => api.updateTag(article.id!, tag.id!, tagValue))
    } catch (e) {
      viewService!.errorKey(langs, e.message)
    }
  }

  const updateArticlePublished = async (article: NodeItem, published: Date) => {
    const api = new NodesApi()
    try {
      await rewindRun(() => api.updateNodePublished(article.id!, published))
    } catch (e) {
      viewService!.errorKey(langs, e.message)
      return false
    }
  }

  const addArticleWithTags = async (name: string) => {
    if (!name || !typeTag || !typeTag!.id) {
      return
    }
    try {
      const api = new NodesApi()
      const parentId = selectedSubjectIds.length
        ? selectedSubjectIds[selectedSubjectIds.length - 1]
        : subjects[subjects.length - 1]?.id
      const newNode = (await rewindRun(() =>
        api.createNode(name, 'Blog', parentId)
      ))!
      await updateArticleTag(newNode, typeTag, props.type.name)
      for (const tag of tags) {
        if (tag.value) {
          await updateArticleTag(newNode, tag, tag.value)
        }
      }
      if (timeTag.value) {
        await updateArticlePublished(
          newNode,
          new Date(parseInt(timeTag.value), 0, 1)
        )
      }
      setArticles([...articles, newNode])
      return true
    } catch (e) {
      viewService!.errorKey(langs, e.message)
      return false
    }
  }

  const addArticle = () => {
    if (props.type.randomName) {
      addArticleWithTags(uuidv4())
      return
    }
    viewService.prompt(
      langs.get(Configs.UiLangsEnum.Create),
      [
        {
          type: 'Text',
          value: '',
          hint: langs.get(Configs.UiLangsEnum.Name)
        }
      ],
      addArticleWithTags
    )
  }

  const deleteArticle = (article: NodeItem) => {
    viewService.prompt(langs.get(Configs.UiLangsEnum.Delete), [], async () => {
      try {
        const api = new NodesApi()
        rewindRun(() => api.removeNode(article.id!))
        const idx = articles.indexOf(article)
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

  useEffect(() => {
    fetchSubjects()
    fetchTags()
  }, [])

  useEffect(() => {
    fetchArticles(1)
  }, [typeTag])

  return (
    <div className="library">
      <Space className="filters" direction="vertical">
        <TreeSelect
          multiple
          onChange={(value) => setSelectedSubjectIds(value)}
          value={selectedSubjectIds}
          treeData={subjects}
          treeCheckable={true}
          showCheckedStrategy={'SHOW_PARENT'}
          style={{ width: '100%' }}
          placeholder={langs.get(Configs.UiLangsEnum.Subject)}
        />
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

        <Radio.Group
          className="tag-list"
          defaultValue={timeTag.value}
          onChange={(e) => setTimeTag({ ...timeTag, value: e.target.value })}
          buttonStyle="solid"
        >
          <Radio.Button className="tag-item" value={undefined}>
            {'全部'}
          </Radio.Button>
          {...timeTag.values.map((value) => (
            <Radio.Button className="tag-item" key={value} value={value}>
              {value}
            </Radio.Button>
          ))}
        </Radio.Group>
        <Input.Search
          onChange={(e) => setFilter(e.target.value)}
          placeholder={langs.get(Configs.UiLangsEnum.Search)}
          onSearch={() => fetchArticles()}
          enterButton
        />
      </Space>
      <Space className="articles" direction="vertical">
        {articles.map((p) => (
          <Card
            key={p.id}
            actions={
              user?.editPermission
                ? [
                  <EditOutlined key="edit" />,
                  <CloseOutlined
                    key="delete"
                    onClick={() => deleteArticle(p)}
                  />
                ]
                : undefined
            }
          >
            <div>{p.content}</div>
          </Card>
        ))}
        <Button
          icon={<PlusOutlined />}
          className="btn-create"
          type="primary"
          onClick={addArticle}
        >
          {langs.get(Configs.UiLangsEnum.Create)}
        </Button>
        {totalPage > 1 ? (
          <Pagination
            className="pagination"
            onChange={(page) => fetchArticles(page)}
            total={totalPage}
          ></Pagination>
        ) : null}
      </Space>
    </div>
  )
}
