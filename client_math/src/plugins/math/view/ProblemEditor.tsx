import React, { useState } from 'react'
import { ArticleContentEditorProps } from '../../IPluginInfo'
import TextArea from 'antd/lib/input/TextArea'
import './ProblemEditor.less'
import { ArticleFile } from '../../../domain/Article'

export default function ProblemEditor (props: ArticleContentEditorProps) {
  const [content, setContent] = useState(props.content?.sections?.[0]?.content)
  const addFile = (file: ArticleFile) => {
    setContent(content + `$$url:${file.url}$$`)
  }
  const remoteFile = (file: ArticleFile) => {
    setContent(content?.replace(`$$url:${file.url}$$`, ''))
  }
  props.refs.addFile = addFile
  props.refs.remoteFile = remoteFile
  props.refs.getEditedContent = () => ({
    sections: [{ name: '', content: content! }]
  })

  return (
    <div className="problem-editor">
      <TextArea
        rows={10}
        className="content"
        value={content}
        onChange={(e) => {
          const content = e.target.value
          setContent(content)
        }}
      ></TextArea>
    </div>
  )
}
