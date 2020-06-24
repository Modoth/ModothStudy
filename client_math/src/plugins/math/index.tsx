import React, { memo } from 'react'
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
        Viewer: memo(ProblemViewer) as any,
        Editor: memo(ProblemEditor) as any,
        randomName: true
      },
      {
        route: 'subject',
        name: '专题',
        icon: <ApiOutlined />,
        Viewer: memo(ProblemViewer) as any,
        Editor: memo(ProblemEditor) as any
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
