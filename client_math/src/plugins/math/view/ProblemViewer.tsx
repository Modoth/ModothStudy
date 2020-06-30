import React, { useState } from 'react'
import { ArticleContentViewerProps } from '../../IPluginInfo'
import { ArticleSection } from '../../../domain/Article'
import './ProblemViewer.less'
import SectionViewer from './SectionViewer'

const getSections = (allSections: Set<string>, sections?: ArticleSection[]) => {
  const existedSections = sections ? new Map(sections.map(s => [s.name!, s])) : new Map<string, ArticleSection>()
  return Array.from(allSections, (name) => existedSections.get(name) || { name, content: '' } as ArticleSection)
}

export default function ProblemViewer(props: ArticleContentViewerProps) {
  const [filesDict] = useState(props.files ? new Map(props.files.map(f => [f.name!, f])) : new Map())
  const [sections] = useState((getSections(props.type?.allSections!, props.content!.sections!)))
  const [showHidden, setShowHidden] = useState(false)
  console.log(sections)
  return (
    <div className="problem-viewer" onClick={() => setShowHidden(!showHidden)}>
      {sections.filter(s => showHidden || !props.type?.hidenSections.has(s.name!)).map((section) => (
        <SectionViewer section={section} filesDict={filesDict} pureViewMode={true} />
      ))}
    </div>
  )
}
