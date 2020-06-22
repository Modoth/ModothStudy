import React, { useState, useEffect } from 'react'
import { ArticleViewProps } from '../../IPluginInfo'
import { NodesApi } from '../../../apis'
import { rewindRun } from '../../../common/ApiService'
import { Input, Button } from 'antd'
import { useServicesLocator } from '../../../app/Contexts'
import ILangsService from '../../../domain/ILangsService'
import IViewService from '../../../view/services/IViewService'

export default function ProblemEditor (props: ArticleViewProps) {
  const locator = useServicesLocator()
  const langs = locator.locate(ILangsService)
  const viewService = locator.locate(IViewService)
  const [content, setContent] = useState('')
  const fetchContent = async () => {
    const api = new NodesApi()
    const res = (await rewindRun(() => api.getBlog(props.id)))!
    setContent(res.content!)
  }
  const saveContent = async () => {
    const api = new NodesApi()
    try {
      await rewindRun(() => api.updateBlogContent(props.id, JSON.stringify(content)))
    } catch (e) {
      viewService!.errorKey(langs, e.message)
    }
  }
  useEffect(() => {
    fetchContent()
  }, [])
  return <div>
    <Input value={content} onChange={e => setContent(e.target.value)}></Input>
    <Button onClick={saveContent} >保存</Button>
  </div>
}
