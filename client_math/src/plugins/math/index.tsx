import React from 'react'
import IPluginInfo, { ArticleType } from '../IPluginInfo'
import ProblemViewer from './view/ProblemViewer'
import ProblemEditor from './view/ProblemEditor'
import CourseEditor from './view/CourseEditor'
import CourseViewer from './view/CourseViewer'
import { ApiOutlined, ApartmentOutlined } from '@ant-design/icons'
import Langs from './Langs'

export class MathPluginInfo implements IPluginInfo {
  private articleTypes: ArticleType[];
  constructor () {
    this.articleTypes = [
      {
        route: 'library',
        name: '题库',
        icon: <ApartmentOutlined />,
        Viewer: ProblemViewer,
        Editor: ProblemEditor,
        randomName: true
      },
      {
        route: 'subject',
        name: '专题',
        icon: <ApiOutlined />,
        Viewer: ProblemViewer,
        Editor: ProblemEditor
      }
    ]
  }

  get langs (): { [key: string]: string } {
    return Langs
  }

  get types (): ArticleType[] {
    return this.articleTypes
  }
}
