import { ArticleFile, ArticleContent } from '../domain/Article'
import { TagItem } from '../apis'
import { MouseEventHandler } from 'react'
import IFormulaEditingService from '../domain/IFormulaEditingService'

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
  allSections: Set<string>,
  Viewer: (props: ArticleContentViewerProps) => JSX.Element;
}

export class ArticleContentViewerProps {
  content: ArticleContent
  files?: ArticleFile[]
  tags?: TagItem[]
  type?: ArticleContentType
  className?: string
  onClick?: MouseEventHandler<any>;
  showHiddens?: boolean;
}

export class ArticleContentEditorProps extends ArticleContentViewerProps {
  callbacks: ArticleContentEditorCallbacks<ArticleContent>
  onpaste: (file: File) => void
  formulaEditor?: IFormulaEditingService
}

export default class IPluginInfo {
  get types(): ArticleType[] {
    throw new Error('Method not implemented.')
  }

  get langs(): { [key: string]: string } {
    throw new Error('Method not implemented.')
  }
}
