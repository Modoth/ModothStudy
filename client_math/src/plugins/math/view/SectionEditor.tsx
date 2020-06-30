import React, { useState, useRef, MouseEventHandler } from 'react'
import { ArticleContentEditorCallbacks } from '../../IPluginInfo'
import './SectionEditor.less'
import { ArticleFile, ArticleSection } from '../../../domain/Article'
import SectionViewer from './SectionViewer'
import { Input } from 'antd'
import classNames from 'classnames'
const TextArea = Input.TextArea

export interface ArticleSectionVm extends ArticleSection {
    callbacks: ArticleContentEditorCallbacks<string>
}

export default function SectionEditor(props: {
    section: ArticleSectionVm,
    filesDict: Map<string, ArticleFile>,
    editing?: boolean
    onClick?: MouseEventHandler<any>
}) {
    const [content, setContent] = useState(props.section.content)
    const [refs] = useState<{ textArea?: HTMLTextAreaElement }>({})
    const ref = useRef<any>(null)
    props.section.callbacks.addFile = (file: ArticleFile) => {
        let oldContent = content || ''
        if (!refs.textArea) {
            console.log('Insert failed')
            setContent(oldContent + `$$:${file.name}$$`)
            return
        }
        const textArea = refs.textArea!
        const [start, end] = [textArea.selectionStart, textArea.selectionEnd]
        setContent(oldContent.slice(0, start) + `$$:${file.name}$$` + oldContent.slice(end))
    }
    props.section.callbacks.remoteFile = (file: ArticleFile) => {
        setContent(content?.replace(`$$:${file.name}$$`, ''))
    }
    props.section.callbacks.getEditedContent = () => {
        return content
    }
    return (props.editing ?
        <div className={classNames('section-editor', props.section.name)}>
            <label className="section-name">{props.section.name}</label>
            <TextArea
                autoFocus
                autoSize={{ minRows: 1 }}
                rows={1}
                className="section-content"
                value={content}
                onFocus={(e) => {
                    refs.textArea = e.target as HTMLTextAreaElement
                }}
                onChange={(e) => {
                    refs.textArea = e.target
                    setContent(e.target.value)
                }}
            ></TextArea>
        </div>
        :
        <SectionViewer onClick={props.onClick} section={Object.assign({}, props.section, { content })} filesDict={props.filesDict} pureViewMode={false}></SectionViewer>
    )
}