import { ArticleFile, ArticleContent } from '../domain/Article'
import { TagItem } from '../apis'

export interface ArticleType {
  route: string;
  name: string;
  icon: React.ReactNode;
  Viewer: (props: ArticleContentViewerProps) => JSX.Element;
  Editor: (props: ArticleContentEditorProps) => JSX.Element;
}

export interface ArticleContentEditorCallbacks<T> {
  addFile(file: ArticleFile): void
  remoteFile(file: ArticleFile): void
  getEditedContent(): T
}

export interface ArticleContentType {
  name: string,
  hidenSections: Set<string>,
  allSections: Set<string>
}

export class ArticleContentViewerProps {
  content: ArticleContent
  files?: ArticleFile[]
  tags?: TagItem[]
  type?: ArticleContentType
}

export class ArticleContentEditorProps extends ArticleContentViewerProps {
  callbacks: ArticleContentEditorCallbacks<ArticleContent>
  onpaste: (file: File) => void
}

export default class IPluginInfo {
  get types(): ArticleType[] {
    throw new Error('Method not implemented.')
  }

  get langs(): { [key: string]: string } {
    throw new Error('Method not implemented.')
  }
}
