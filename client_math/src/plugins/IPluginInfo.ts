import { ArticleFile, ArticleContent } from '../domain/Article'
import { TagItem } from '../apis'

export interface ArticleType {
    route:string;
    name:string;
    icon:React.ReactNode;
    Viewer : (props: ArticleContentViewerProps) => JSX.Element;
    Editor: (props: ArticleContentEditorProps) => JSX.Element;
    randomName?: boolean
}

export interface ArticleContentEditorRefs{
  addFile(file:ArticleFile):void
  remoteFile(file:ArticleFile):void
  updateTag(tag:TagItem, value?: string):void
  getEditedContent():ArticleContent
}

export class ArticleContentViewerProps {
  content: ArticleContent
  files?: ArticleFile[]
  tags?:TagItem[]
}

export class ArticleContentEditorProps extends ArticleContentViewerProps {
    refs: ArticleContentEditorRefs
}

export default class IPluginInfo {
  get types (): ArticleType[] {
    throw new Error('Method not implemented.')
  }

  get langs (): { [key:string]:string } {
    throw new Error('Method not implemented.')
  }
}
