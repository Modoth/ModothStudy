import React, { useState, useEffect } from 'react'
import { ArticleViewProps } from '../../IPluginInfo'
import { NodesApi } from '../../../apis'
import { rewindRun } from '../../../common/ApiService'

export default function ProblemViewer (props: ArticleViewProps) {
  const [content, setContent] = useState('')
  const fetchContent = async () => {
    const api = new NodesApi()
    const res = (await rewindRun(() => api.getBlog(props.id)))!
    setContent(res.content!)
  }
  useEffect(() => {
    fetchContent()
  }, [])
  return <div>{content}</div>
}
