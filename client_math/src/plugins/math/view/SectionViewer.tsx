import React, { useState, MouseEventHandler } from 'react'
import Latex from '../../../view/components/Latex'
import { v4 as uuidv4 } from 'uuid'
import { ArticleFile, ArticleSection } from '../../../domain/Article'
import ArticleFileViewer from '../../../view/components/ArticleFileViewer'
import './SectionViewer.less'
import classNames from 'classnames'

enum SliceType {
    Normal = 1,
    Inline = 2,
    Block = 3,
}

class SliceFile {
    constructor(public file: ArticleFile) { }
}

class ArticleSlice {
    public id: string;
    constructor(public type: SliceType, public content: string | SliceFile) {
        this.id = uuidv4()
    }
}

const SEP = '$'
const ESC = '\\'
const FILE_PREFIX = ':'

class ArticleSectionVm {
    public slices: ArticleSlice[] = [];

    constructor(
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
                const fileKey = content.slice(FILE_PREFIX.length)
                const file = files && files.get(fileKey)
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
                        // throw new Error('Broken file.')
                        console.log('Broken file.')
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

const renderSlice = (slice: ArticleSlice, onClick?: any) => {
    switch (slice.type) {
        case SliceType.Inline:
        case SliceType.Block:
            if (typeof slice.content === 'object') {
                const file = slice.content as SliceFile
                return <ArticleFileViewer onClick={onClick} className="section-content" key={slice.id} file={file.file}></ArticleFileViewer>
            }
            return (
                <Latex key={slice.id}
                    className="section-content"
                    inline={slice.type === SliceType.Inline}
                    content={slice.content as string}
                ></Latex>
            )
        default:
            return <span key={slice.id} className="section-content slice-content">{slice.content}</span>
    }
}

export default function SectionViewer(props: {
    section: ArticleSection,
    filesDict: Map<string, ArticleFile>
    onClick?: MouseEventHandler<any>
    pureViewMode: boolean
}) {
    const [section] = useState(new ArticleSectionVm(props.section.name!, props.section.content || '', props.filesDict))
    console.log(section, props.section.content, props.filesDict)
    return <div onClick={props.onClick} className={classNames('section-viewer', section.name, props.pureViewMode ? 'view-mode' : 'edit-mode')} key={section.name}>
        <label className="section-name">{section.name}</label>
        {section.slices.map((slice) => renderSlice(slice, props.onClick))}
    </div>
}