import React, { useState, useEffect, Props, MouseEventHandler } from 'react'
import { useServicesLocator } from '../../app/Contexts'
import ILangsService, { LangKeys } from '../../domain/ILangsService'
import IViewService from '../services/IViewService'
import Subject from '../../domain/Subject'
import ISubjectsService from '../../domain/ISubjectsService'
import classNames from 'classnames'
import './RecentsView.less'
import { generateRandomStyle } from './common'
import IPluginInfo, { ArticleContentType } from '../../plugins/IPluginInfo'
import { useHistory } from 'react-router-dom'
import Article, { articleFromNodeItem } from '../../domain/Article'
import { rewindRun } from '../../common/ApiService'
import ITagsService, { TagNames } from '../../domain/ITagsService'
import { NodesApi, PagedResultNodeItem, Condition, Query } from '../../apis'
import ApiConfiguration from '../../common/ApiConfiguration'
import { Carousel } from 'antd'
import IArticleViewServie from '../services/IArticleViewService'

function RecentArticle(props: { article: Article, type: ArticleContentType, onClick?: MouseEventHandler<any>; }) {
  return (
    <div onClick={props.onClick} className={classNames(generateRandomStyle(), "recent-article-wraper")}>
      <div className="recent-article">
        <props.type.Viewer content={props.article.content!} files={props.article.files} type={props.type}></props.type.Viewer>
      </div>
    </div>
  )
}

export default function RecentsView() {
  const locator = useServicesLocator()
  const langs = locator.locate(ILangsService)
  const viewService = locator.locate(IViewService)
  const [articles, setArticles] = useState<Article[]>([])
  const [articleTypes, setArticleTypes] = useState(new Map<Article, ArticleContentType>())

  const history = useHistory();
  const goto = (id: string) => {
    const plugin = locator.locate(IPluginInfo)
    var type = plugin.types[0];
    if (!type) {
      return
    }
    history.push('/' + type.route + '/' + id)
  }
  const fetchArticles = async (page?: number) => {
    const typeTag = await locator.locate(ITagsService).get(TagNames.TypeTag)
    const plugin = locator.locate(IPluginInfo)
    const type = plugin.types[0];
    if (!type) {
      return
    }
    if (!typeTag) {
      return
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
            {
              type: Condition.TypeEnum.Equal,
              prop: typeTag!.name,
              value: type.name
            }
          ]
        },
        orderBy: "Created",
        orderByDesc: true
      }
      res = (await rewindRun(() =>
        api.queryNodes(
          query,
          undefined,
          0,
          5
        )
      ))!
    } catch (e) {
      viewService!.errorKey(langs, e.message)
      return false
    }
    const articles = res.data!.map(articleFromNodeItem)
    const s = locator.locate(IArticleViewServie)
    const tagsService = locator.locate(ITagsService)
    const allTags = await tagsService.all()
    const tagsDict = new Map(allTags.map((n) => [n.name!, n]))
    const types = new Map(articles.map(a => [a, s.getArticleType(type.Viewer, type.name, a.tagsDict, tagsDict)]))
    setArticleTypes(types)
    setArticles(articles)
  }
  useEffect(() => {
    fetchArticles()
  }, [])
  return (
    <div className="recents-view">
      <div className="title">{langs.get(LangKeys.Latest)}</div>
      <Carousel >
        {
          articles.map(article => <RecentArticle article={article} key={article.id} type={articleTypes.get(article)!} onClick={() => {
            locator.locate(IViewService).previewArticle(article, articleTypes.get(article)!)
          }}></RecentArticle>)
        }
      </Carousel>
    </div>

  )
}
