import React, { useState } from 'react'
import { ArticleContentEditorProps } from '../../IPluginInfo'
import './ProblemEditor.less'
import { ArticleFile, ArticleSection } from '../../../domain/Article'
import SectionEditor, { ArticleSectionVm } from './SectionEditor'
import SectionViewer from './SectionViewer'

const getSections = (allSections: Set<string>, sections?: ArticleSection[]) => {
  const existedSections = sections ? new Map(sections.map(s => [s.name!, s])) : new Map<string, ArticleSectionVm>()
  return Array.from(allSections, (name) => Object.assign((existedSections.get(name) || { name, content: '' }), { callbacks: {} }) as ArticleSectionVm)
}

export default function ProblemEditor(props: ArticleContentEditorProps) {
  const [sections, setSections] = useState(getSections(props.type?.allSections!, props.content.sections))
  const [filesDict] = useState(props.files ? new Map(props.files.map(f => [f.name!, f])) : new Map())
  console.log(sections)
  const [currentSection, setCurrentSection] = useState<ArticleSectionVm | undefined>(undefined)
  const saveCurrentSectionAndChange = (next: ArticleSectionVm) => {
    if (currentSection) {
      currentSection.content = currentSection.callbacks.getEditedContent()
    }
    setCurrentSection(next)
  }
  props.callbacks.addFile = (file: ArticleFile) => {
    if (currentSection) {
      currentSection.callbacks.addFile(file)
    }
  }
  props.callbacks.remoteFile = (file: ArticleFile) => {
    for (const section of sections) {
      section.callbacks.remoteFile(file)
    }
  }
  props.callbacks.getEditedContent = () => {
    if (currentSection) {
      currentSection.content = currentSection.callbacks.getEditedContent()
    }
    return {
      sections: sections.map(s => ({ content: s.content, name: s.name }))
    }
  }
  console.log(props.type)
  return <div className="problem-editor">
    {sections.map(section =>
      <SectionEditor onClick={section === currentSection ? undefined : () => saveCurrentSectionAndChange(section)} section={section} filesDict={filesDict} editing={section === currentSection}></SectionEditor>
    )}
  </div >
}
