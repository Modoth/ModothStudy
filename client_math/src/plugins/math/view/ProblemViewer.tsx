import React from 'react'
import { ArticleContentViewerProps } from '../../IPluginInfo'
import Latex from '../../../view/components/Latex'
import { v4 as uuidv4 } from 'uuid'
import { ArticleFile } from '../../../domain/Article'
import ArticleFileViewer from '../../../view/components/ArticleFileViewer'
import './ProblemViewer.less'

enum SliceType {
  Normal = 1,
  Inline = 2,
  Block = 3,
}

class SliceFile {
  constructor (public file: ArticleFile) {}
}

class ArticleSlice {
  public id: string;
  constructor (public type: SliceType, public content: string | SliceFile) {
    this.id = uuidv4()
  }
}

const SEP = '$'
const ESC = '\\'
const FILE_PREFIX = 'url:'

class ArticleSection {
  public slices: ArticleSlice[] = [];

  constructor (
    public name: string,
    section: string,
    files?: Map<string, ArticleFile>
  ) {
    let sliceStart = 0
    let sliceEnd = 0
    let nextType = SliceType.Normal
    let closeSeps: boolean | undefined
    const addSlice = (type: SliceType, start: number, end: number) => {
      const content = section.slice(start, end)
      if (type === SliceType.Normal) {
        if (content.trim()) {
          this.slices.push(new ArticleSlice(type, content))
        }
      } else if (content.startsWith(FILE_PREFIX)) {
        const fileUrl = content.slice(FILE_PREFIX.length)
        const file = files && files.get(fileUrl)
        if (file) {
          this.slices.push(new ArticleSlice(type, new SliceFile(file)))
        }
      } else {
        this.slices.push(new ArticleSlice(type, content))
      }
    }
    for (let i = 0; i < section.length; i++) {
      if (section[i] !== SEP || section[i - 1] === ESC) {
        continue
      }
      const currentType = nextType
      sliceEnd = i
      switch (currentType) {
        case SliceType.Normal:
          if (section[i + 1] === SEP) {
            i++
            nextType = SliceType.Block
          } else {
            nextType = SliceType.Inline
          }
          break
        case SliceType.Inline:
          nextType = SliceType.Normal
          break
        case SliceType.Block:
          if (section[i + 1] === SEP) {
            i++
            nextType = SliceType.Block
          } else {
            throw new Error('Broken file.')
          }
          break
      }
      addSlice(currentType, sliceStart, sliceEnd)
      if (!closeSeps) {
      }
      closeSeps = closeSeps === false
      sliceStart = i + 1
    }
    addSlice(SliceType.Normal, sliceStart, section.length)
  }
}

export default function ProblemViewer (props: ArticleContentViewerProps) {
  const filesDict = props.files ? new Map(props.files.map(f => [f.url, f])) : new Map()
  const sections = (props.content?.sections || []).map(
    (s) => new ArticleSection(s.name!, s.content || '', filesDict)
  )
  const renderSlice = (slice: ArticleSlice) => {
    switch (slice.type) {
      case SliceType.Inline:
      case SliceType.Block:
        if (typeof slice.content === 'object') {
          const file = slice.content as SliceFile
          return <ArticleFileViewer file={file.file}></ArticleFileViewer>
        }
        return (
          <Latex
            inline={slice.type === SliceType.Inline}
            content={slice.content as string}
          ></Latex>
        )
      default:
        return <span className="slice-content">{slice.content}</span>
    }
  }
  console.log(sections)
  return (
    <div className="problem-viewer">
      {sections.map((sec) => (
        <div key={sec.name}>
          {sec.slices.map((slice) => (
            <span key={slice.id}>{renderSlice(slice)}</span>
          ))}
        </div>
      ))}
    </div>
  )
}
