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

const normalizeString = (slice: string) => {
    let newSlice = "";
    const ignoreChars = new Set(['⬚'])
    for (var i = 0; i < slice.length; i++) {
        if (slice.charCodeAt(i) >= 65281 && slice.charCodeAt(i) <= 65374) {
            newSlice += String.fromCharCode(slice.charCodeAt(i) - 65248)
        } else if (slice.charCodeAt(i) == 12288) {
            newSlice += ' ';
        } else if (ignoreChars.has(slice[i])) {
            continue
        }
        else {
            newSlice += slice[i];
        }
    }
    return newSlice;
}

const translateWordContent = (slice: string) => {
    return normalizeString(slice).replace(/[\x20-\x7Fα-ωΑ-Ω]+/g, e => e.match(/[a-zA-Zα-ωΑ-Ω]/) ? '$' + e + '$' : e)
}

export default function SectionEditor(props: {
    section: ArticleSectionVm,
    filesDict: Map<string, ArticleFile>,
    editing?: boolean
    onpaste: (file: File) => void
    onClick?: MouseEventHandler<any>
}) {
    const [filesDict] = useState(props.filesDict || new Map())
    const [content, setContent] = useState(props.section.content)
    const [refs] = useState<{ textArea?: HTMLTextAreaElement }>({})
    const ref = useRef<any>(null)
    const insertContent = (text: string) => {
        let oldContent = content || ''
        if (!refs.textArea) {
            console.log('Insert failed')
            setContent(oldContent + text)
            return
        }
        const textArea = refs.textArea!
        const [start, end] = [textArea.selectionStart, textArea.selectionEnd]
        setContent(oldContent.slice(0, start) + text + oldContent.slice(end))
    }
    props.section.callbacks.addFile = (file: ArticleFile) => {
        const text = `$$:${file.name}$$`
        filesDict.set(file.name!, file)
        insertContent(text)
    }
    props.section.callbacks.remoteFile = (file: ArticleFile) => {
        setContent(content?.replace(`$$:${file.name}$$`, ''))
        filesDict.delete(file.name!)
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
                onPaste={(e) => {
                    if (!e.clipboardData) {
                        return
                    }
                    const types = e.clipboardData.types.join(' ')
                    console.log(types)
                    switch (types) {
                        case 'text/plain text/html text/rtf':
                        case 'text/plain text/html text/rtf Files':
                            e.preventDefault()
                            e.clipboardData.items[0].getAsString(s => insertContent(translateWordContent(s)))
                            return
                        case 'Files':
                        case 'text/html Files':
                            e.preventDefault()
                            const file = e.clipboardData.files[0]
                            if (file && file.type.match(/image\/.*/) || file.type.match(/video\/.*/)) {
                                props.onpaste(file)
                            }
                            return
                    }
                }}
            ></TextArea>
        </div >
        :
        <SectionViewer onClick={props.onClick} section={Object.assign({}, props.section, { content })} filesDict={filesDict} pureViewMode={false}></SectionViewer>
    )
}