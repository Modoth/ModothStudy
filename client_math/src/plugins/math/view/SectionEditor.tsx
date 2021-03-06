import React, { useState, useRef, MouseEventHandler } from 'react'
import { ArticleContentEditorCallbacks } from '../../IPluginInfo'
import './SectionEditor.less'
import { ArticleFile, ArticleSection } from '../../../domain/Article'
import SectionViewer from './SectionViewer'
import { Input, Button } from 'antd'
import { FunctionOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import IFormulaEditingService from '../../../domain/IFormulaEditingService'
import { getSlices, SliceType, SliceFile } from './SectionCommon'
const TextArea = Input.TextArea

export interface ArticleSectionVm extends ArticleSection {
    callbacks: ArticleContentEditorCallbacks<string>
}

export class ILatexTranslator {
    test(slice: string): boolean {
        throw new Error('Method not implemented.')
    }

    translate(slice: string): string {
        throw new Error('Method not implemented.')
    }
}

export class DefaultLatexTranslator implements ILatexTranslator {
    test(_: string): boolean {
        return true
    }
    translate(slice: string): string {
        return slice.replace(/[\x20-\x7Fα-ωΑ-Ω]+/g, e => e.match(/[a-zA-Zα-ωΑ-Ω]/) ? '$' + e + '$' : e)
    }
}

export class WikipediaLatexTranslator implements ILatexTranslator {
    test(slice: string): boolean {
        return slice.indexOf('<math>') >= 0
    }
    translate(slice: string): string {
        return slice.replace(/\r?\n?<math>|<\/math>\r?\n?/g, () => '$')
    }
}

interface Formula {
    start: number;
    end: number;
    content: string;
    newFormula: boolean
}

const getFormulaAtPos = (content: string, pos: number): Formula | undefined => {
    var slices = getSlices(content)
    var slice = slices.find(s => s.end >= pos)
    if (!slice || slice.type === SliceType.Normal) {
        return { start: pos, end: pos, content: '', newFormula: true }
    }

    if (typeof slice.content !== 'string') {
        return
    }

    return { start: slice.start, end: slice.end, content: slice.content as string, newFormula: false }
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
    slice = normalizeString(slice)
    const translator: ILatexTranslator = [new WikipediaLatexTranslator()].find(t => t.test(slice)) || new DefaultLatexTranslator()
    return translator.translate(slice)
}

export default function SectionEditor(props: {
    section: ArticleSectionVm,
    filesDict: Map<string, ArticleFile>,
    editing?: boolean
    onpaste: (file: File) => void
    onClick?: MouseEventHandler<any>
    formulaEditor?: IFormulaEditingService
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
    const getFormula = (): Formula | undefined => {
        if (!refs.textArea) {
            return {
                start: content.length,
                end: content.length,
                content: '',
                newFormula: true
            }
        }
        const textArea = refs.textArea!
        return getFormulaAtPos(content, textArea.selectionStart)
    }
    const editFormula = async () => {
        const formula = getFormula()
        if (!formula) {
            return
        }
        {
            if (!refs.textArea) {
                return
            }
            const textArea = refs.textArea!
            textArea.setSelectionRange(formula.start, formula.start + (formula.content.length || 0))
            textArea.focus()
        }
        const newFormula = (await props.formulaEditor!.edit(formula.content)) || ' '
        if(formula.newFormula && (!newFormula || !newFormula.trim())){
            return;
        } 
        setContent(content.slice(0, formula.start) + (formula.newFormula ? `$${newFormula}$` : newFormula) + content.slice(formula.end))
        setTimeout(() => {
            if (!refs.textArea) {
                return
            }
            const textArea = refs.textArea!
            const start = formula.newFormula ? formula.start + 1 : formula.start;
            textArea.setSelectionRange(start, start + (newFormula?.length || 0))
            textArea.focus()
        }, 0);
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
                onKeyDown={(e) => {
                    if (e.key == 'f' && e.ctrlKey && !e.shiftKey && !e.metaKey && props.formulaEditor) {
                        editFormula()
                    }
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
            {
                props.formulaEditor ? <Button type="link" onClick={() => { editFormula() }} className="btn-formula" icon={<FunctionOutlined />}></Button> : null
            }
        </div >
        :
        <SectionViewer onClick={props.onClick} section={Object.assign({}, props.section, { content })} filesDict={filesDict} pureViewMode={false}></SectionViewer>
    )
}