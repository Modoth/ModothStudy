import React, { useEffect } from 'react'
import 'katex/dist/katex.min.css'
import katex from 'katex'

export default function Latex (props:{inline?:boolean, content?:string}) {
  const refElement = React.createRef<HTMLDivElement>()
  useEffect(() => {
    const content = props.content
    if (content && refElement.current) {
      katex.render(content, refElement.current, { throwOnError: false })
    }
  }, [])
  return <span className={props.inline ? 'inline-latex' : 'block-latex'} ref={refElement}>{props.content || ''}</span>
}
