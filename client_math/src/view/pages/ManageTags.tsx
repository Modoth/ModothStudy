import React, { useContext, useState, useEffect } from 'react'
import './ManageTags.less'
import { useUser, useNotify, useLangs } from '../../app/contexts'
import { Redirect } from 'react-router-dom'
import { rewindRun } from '../../infras/ApiService'
import { Configs, TagsApi, PagedResultTagItem, TagItem } from '../../apis'
import { Pagination, Table, Button, Space, Input, Modal } from 'antd'
import { PlusOutlined, DeleteFilled } from '@ant-design/icons'

export function ManageTags () {
  const user = useUser()
  if (!user || !user.managePermission) {
    return <Redirect to="/login" />
  }
  const notify = useNotify()
  const langs = useLangs()
  const [tags, setTags] = useState<TagItem[] | undefined>()
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const countPerPage = 10
  const fetchTags = async (page:number) => {
    if (page === currentPage) {
      return
    }
    let res: PagedResultTagItem | undefined
    try {
      res = await rewindRun(() => new TagsApi().allTags(undefined, (page - 1) * currentPage, countPerPage))
    } catch (e) {
      notify!.errorKey(langs, e.message)
    }
    setTags(res!.data!)
    setTotalPage(res!.total!)
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchTags(1)
  }, [])
  const [addTagVisible, setAddTagVisible] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagValue, setNewTagValue] = useState('')
  const renderName = (_: string, tag:TagItem) => {
    return <span>{tag.name}</span>
  }
  const clearAddTag = () => {
    setNewTagValue('')
    setNewTagName('')
    setAddTagVisible(false)
  }
  const addTag = async () => {
    if (!newTagName || !newTagValue) {
      return
    }
    try {
      const newTag = await rewindRun(() => new TagsApi().addTag(newTagName, 'Enum', newTagValue))
      setTags([...tags!, newTag!])
      clearAddTag()
    } catch (e) {
        notify!.errorKey(langs, e.message)
    }
  }

  const [modifyUpdateValueVisible, setUpdateTagValueVisible] = useState(false)
  const [toUpdateTagValue, setToUpdateTagValue] = useState('')
  const [toUpdateTag, setToUpdateTag] = useState<TagItem|undefined>(undefined)
  const startUpdateTagValue = (tag:TagItem) => {
    setToUpdateTagValue(tag.values!)
    setToUpdateTag(tag)
    setUpdateTagValueVisible(true)
  }
  const endUpdateTagValue = () => {
    setUpdateTagValueVisible(false)
    setToUpdateTagValue('')
  }
  const updateTagValue = async () => {
    try {
      await rewindRun(() => new TagsApi().updateTagValues(toUpdateTag!.id!, toUpdateTagValue))
      toUpdateTag!.values = toUpdateTagValue
      setTags([...tags!])
      endUpdateTagValue()
    } catch (e) {
        notify!.errorKey(langs, e.message)
    }
  }
  const renderValue = (_:string, tag:TagItem) => {
    return <span onClick={() => startUpdateTagValue(tag)}>{tag.values}</span>
  }
  const deleteTag = async (tag:TagItem) => {
    try {
      await rewindRun(() => new TagsApi().removeTag(tag.id!))
      const idx = tags!.indexOf(tag)
      tags!.splice(idx, 1)
      setTags([...tags!])
    } catch (e) {
      notify!.errorKey(langs, e.message)
    }
  }
  const renderDelete = (_:string, tag:TagItem) => {
    return <Button type="text" onClick={() => deleteTag(tag)} danger icon={<DeleteFilled />} />
  }
  return <div className="manage-tags">
    <Table rowKey="name" columns={[
      {
        title: langs.get(Configs.UiLangsEnum.Tags),
        dataIndex: 'name',
        key: 'name',
        className: 'tag-name-column',
        render: renderName
      },
      {
        title: langs.get(Configs.UiLangsEnum.Values),
        dataIndex: 'values',
        key: 'values',
        render: renderValue
      },
      {
        title: '',
        key: 'delete',
        className: 'tag-delete-column',
        render: renderDelete
      }
    ]} dataSource={tags} pagination={false} ></Table>
    <Button icon={<PlusOutlined />} className="btn-create" type="dashed" onClick={() => setAddTagVisible(true)}>{langs.get(Configs.UiLangsEnum.Create)}</Button>
    <Modal
      title={langs.get(Configs.UiLangsEnum.Create)}
      visible={addTagVisible}
      onOk={addTag}
      onCancel={clearAddTag}
      okText={langs.get(Configs.UiLangsEnum.Ok)}
      cancelText={langs.get(Configs.UiLangsEnum.Cancle)}
    >
      <Space direction="vertical" className="change-pwd-panel">
        <Input value={newTagName} onChange={e => setNewTagName(e.target.value)} placeholder={langs.get(Configs.UiLangsEnum.Tags)} ></Input>
        <Input value={newTagValue} onChange={e => setNewTagValue(e.target.value)} placeholder={langs.get(Configs.UiLangsEnum.Values)} ></Input>
      </Space>
    </Modal>
    <Modal
      title={langs.get(Configs.UiLangsEnum.Modify)}
      visible={modifyUpdateValueVisible}
      onOk={updateTagValue}
      onCancel={endUpdateTagValue}
      okText={langs.get(Configs.UiLangsEnum.Ok)}
      cancelText={langs.get(Configs.UiLangsEnum.Cancle)}
    >
      <Space direction="vertical" className="change-pwd-panel">
        <Input value={toUpdateTagValue} onChange={e => setToUpdateTagValue(e.target.value)} placeholder={langs.get(Configs.UiLangsEnum.Values)} ></Input>
      </Space>
    </Modal>
    <Pagination className="pagination" onChange={(page) => fetchTags(page)} total={totalPage}></Pagination>
  </div>
}
