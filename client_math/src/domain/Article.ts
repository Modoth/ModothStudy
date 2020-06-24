import { NodeTag, NodeItem } from '../apis'

export interface ArticleFile {
    name?:string;
    url?:string;
}

export interface ArticleSection{
    name?:string;
    type?: string;
    content: string;
}

export interface ArticleContent {
    sections?: ArticleSection[]
}

function tryParse (content:string) {
  try {
    return JSON.parse(content)
  } catch (e) {
    console.log(e)
  }
}

export function articleFromNodeItem (node:NodeItem) {
  const { content, files } = node.content ? tryParse(node.content) : {} as any
  const tagsDict = node.tags && new Map(node.tags.map(t => [t.name!, t]))
  const article : Article = Object.assign({}, node, { content, files, tagsDict }) as any as Article
  return article
}

export default interface Article {
    id?: string;
    subjectId?: string;
    name?: string;
    content?: ArticleContent;
    files?: ArticleFile[];
    tags?: Array<NodeTag>;
    tagsDict?: Map<string, NodeTag>;
  }
