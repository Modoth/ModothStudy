export interface ArticleType {
    route:string;
    name:string;
    icon:React.ReactNode;
    Viewer : (props: ArticleViewProps) => JSX.Element;
    Editor: (props: ArticleViewProps) => JSX.Element;
    randomName?: boolean
}

export class ArticleViewProps {
    id:string
}

export default class IPluginInfo {
  get types (): ArticleType[] {
    throw new Error('Method not implemented.')
  }

  get langs (): { [key:string]:string } {
    throw new Error('Method not implemented.')
  }
}
