import React, { useState, useEffect } from 'react'
import './ManageTags.less'
import { useUser, useServicesLocator } from '../../app/Contexts'
import { Redirect } from 'react-router-dom'
import { rewindRun } from '../../common/ApiService'
import { Configs, TagsApi, PagedResultTagItem, TagItem } from '../../apis'
import { Pagination, Table, Button } from 'antd'
import { PlusOutlined, DeleteFilled } from '@ant-design/icons'
import ILangsService from '../../domain/ILangsService'
import IViewService from '../services/IViewService'

export function ManageTags () {
  const user = useUser()
  if (!user || !user.managePermission) {
    return <Redirect to="/login" />
  }

  const locator = useServicesLocator()
  const langs = locator.locate(ILangsService)
  const viewService = locator.locate(IViewService)

  const [tags, setTags] = useState<TagItem[] | undefined>()
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const countPerPage = 10
  const fetchTags = async (page: number) => {
    if (page === currentPage) {
      return
    }
    let res: PagedResultTagItem | undefined
    try {
      res = await rewindRun(() =>
        new TagsApi().allTags(undefined, (page - 1) * currentPage, countPerPage)
      )
    } catch (e) {
      viewService!.errorKey(langs, e.message)
    }
    setTags(res!.data!)
    setTotalPage(Math.ceil(res!.total! / countPerPage))
    setCurrentPage(page)
  }

  const addTag = () => {
    viewService.prompt(
      langs.get(Configs.UiLangsEnum.Create),
      [
        { type: 'Text', value: '', hint: langs.get(Configs.UiLangsEnum.Tags) },
        {
          type: 'Text',
          value: '',
          hint: langs.get(Configs.UiLangsEnum.Values)
        }
      ],
      async (newTagName: string, newTagValue: string) => {
        if (!newTagName || !newTagValue) {
          return
        }
        try {
          const newTag = await rewindRun(() =>
            new TagsApi().addTag(newTagName, 'Enum', newTagValue)
          )
          setTags([...tags!, newTag!])
          return true
        } catch (e) {
          viewService!.errorKey(langs, e.message)
        }
      }
    )
  }

  const updateTagValues = (tag: TagItem) => {
    viewService.prompt(
      langs.get(Configs.UiLangsEnum.Modify),
      [
        {
          type: 'Text',
          value: tag.values,
          hint: langs.get(Configs.UiLangsEnum.Values)
        }
      ],
      async (values: string) => {
        try {
          await rewindRun(() =>
            new TagsApi().updateTagValues(tag!.id!, values)
          )
          tag!.values = values
          setTags([...tags!])
          return true
        } catch (e) {
          viewService!.errorKey(langs, e.message)
        }
      }
    )
  }

  const deleteTag = (tag: TagItem) => {
    viewService.prompt(
      langs.get(Configs.UiLangsEnum.Delete) + ': ' + tag.name,
      [],
      async () => {
        try {
          await rewindRun(() => new TagsApi().removeTag(tag.id!))
          const idx = tags!.indexOf(tag)
          tags!.splice(idx, 1)
          setTags([...tags!])
          return true
        } catch (e) {
          viewService!.errorKey(langs, e.message)
        }
      }
    )
  }

  useEffect(() => {
    fetchTags(1)
  }, [])

  const renderName = (_: string, tag: TagItem) => {
    return <span>{tag.name}</span>
  }

  const renderValue = (_: string, tag: TagItem) => {
    return <span onClick={() => updateTagValues(tag)}>{tag.values}</span>
  }

  const renderDelete = (_: string, tag: TagItem) => {
    return (
      <Button
        type="link"
        onClick={() => deleteTag(tag)}
        danger
        icon={<DeleteFilled />}
      />
    )
  }
  return (
    <div className="manage-tags">
      <Table
        rowKey="name"
        columns={[
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
        ]}
        dataSource={tags}
        pagination={false}
      ></Table>
      <Button
        icon={<PlusOutlined />}
        className="btn-create"
        type="primary"
        onClick={addTag}
      >
        {langs.get(Configs.UiLangsEnum.Create)}
      </Button>
      {totalPage > 1 ? (
        <Pagination
          className="pagination"
          onChange={(page) => fetchTags(page)}
          total={totalPage}
        ></Pagination>
      ) : null}
    </div>
  )
}
