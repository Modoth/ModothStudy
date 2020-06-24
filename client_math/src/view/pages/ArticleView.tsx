import React, { useState } from 'react'
import {
  ArticleType,
  ArticleContentEditorRefs
} from '../../plugins/IPluginInfo'
import Article, { ArticleFile } from '../../domain/Article'
import { NodesApi, Configs, NodeTag } from '../../apis'
import ApiConfiguration from '../../common/ApiConfiguration'
import { rewindRun } from '../../common/ApiService'
import { useUser, useServicesLocator } from '../../app/Contexts'
import ILangsService from '../../domain/ILangsService'
import IViewService from '../services/IViewService'
import { Card, Button, Select, Space, TreeSelect } from 'antd'
import {
  PlusOutlined,
  CheckOutlined,
  EditOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { IFileApiService, FileApiUrls } from '../../domain/FileApiService'
import ArticleFileViewer from '../components/ArticleFileViewer'
import { ArticleTag, SubjectViewModel } from './Library'

const { Option } = Select

export default function ArticleView (props: {
  article: Article;
  articleHandlers: { onDelete: { (id: string): void } };
  type: ArticleType;
  subjects: SubjectViewModel[];
  tags: ArticleTag[];
}) {
  const user = useUser()
  const locator = useServicesLocator()
  const langs = locator.locate(ILangsService)
  const viewService = locator.locate(IViewService)
  const [files, setFiles] = useState(props.article.files)
  const [tagsDict, setTagsDict] = useState(props.article.tagsDict)
  const [subjectId, setSubjectId] = useState(props.article.subjectId)
  const [editing, setEditing] = useState(false)
  const [editorRefs, setEditorRefs] = useState<ArticleContentEditorRefs>(
    {} as any
  )

  const [content, setContent] = useState(props.article.content || {})

  const deleteFile = async (file: ArticleFile) => {
    try {
      const idx = files!.indexOf(file)
      if (idx < 0) {
        return
      }
      const api = new NodesApi(ApiConfiguration)
      files!.splice(idx, 1)
      const newFiles = [...files!]
      await rewindRun(() =>
        api.updateBlogContent(
          props.article.id!,
          JSON.stringify(JSON.stringify({ content, files: newFiles })),
          newFiles.map((f) => f.url!)
        )
      )
      setFiles(newFiles)
      editorRefs && editorRefs.remoteFile(file)
      return true
    } catch (e) {
      viewService!.errorKey(langs, e.message)
      return false
    }
  }

  const addFile = () => {
    viewService.prompt(
      langs.get(Configs.UiLangsEnum.Import),
      [
        {
          type: 'File',
          value: undefined
        }
      ],
      async (file: File) => {
        try {
          const fileApiService = locator.locate(IFileApiService)
          const api = new NodesApi(ApiConfiguration)
          const url = await fileApiService.fetch(FileApiUrls.Files_UploadFile, {
            blob: file
          })
          const newFiles = [...(files || [])]
          const newFile = { name: file.name, url }
          newFiles.push(newFile)
          await rewindRun(() =>
            api.updateBlogContent(
              props.article.id!,
              JSON.stringify(
                JSON.stringify({
                  content,
                  files: newFiles
                })
              ),
              newFiles.map((f) => f.url!)
            )
          )
          setFiles(newFiles)
          editorRefs && editorRefs.addFile(newFile)
          return true
        } catch (e) {
          viewService!.errorKey(langs, e.message)
          return false
        }
      }
    )
  }

  const updateSubjectId = async (sid: string) => {
    const api = new NodesApi(ApiConfiguration)
    try {
      await rewindRun(() => api.move(props.article.id!, sid))
      setSubjectId(sid)
    } catch (e) {
      viewService!.errorKey(langs, e.message)
    }
  }

  const toogleEditing = async () => {
    if (!editing) {
      setEditing(true)
      return
    }
    try {
      const api = new NodesApi(ApiConfiguration)
      const newContent = editorRefs.getEditedContent()
      if (
        newContent.sections !== undefined &&
        newContent.sections !== content?.sections
      ) {
        await rewindRun(() =>
          api.updateBlogContent(
            props.article.id!,
            JSON.stringify(
              JSON.stringify({ content: newContent, files: files })
            )
          )
        )
        setContent(newContent)
      }
      setEditing(false)
    } catch (e) {
      viewService!.errorKey(langs, e.message)
    }
  }

  const updateTag = async (tag: ArticleTag, tagValue: string) => {
    const api = new NodesApi(ApiConfiguration)
    try {
      await rewindRun(() =>
        api.updateTag(props.article.id!, tag.id!, tagValue)
      )
      const newTags = tagsDict || new Map()
      if (!newTags.has(tag.name)) {
        const newTag: NodeTag = {
          id: tag.id,
          name: tag.name,
          type: NodeTag.TypeEnum.Enum,
          value: tagValue,
          values: tag.values.join(' ')
        }
        newTags.set(tag.name, newTag)
      } else {
        const updatedTag = newTags.get(tag.name)
        updatedTag!.value = tagValue
      }
    } catch (e) {
      viewService!.errorKey(langs, e.message)
    }
  }
  return (
    <Card>
      {editing ? (
        <>
          <div className="files-list">
            <Button
              type="dashed"
              shape="round"
              icon={<PlusOutlined />}
              onClick={addFile}
            ></Button>
            {files?.length
              ? files!.map((file) => (
                <ArticleFileViewer
                  key={file.url}
                  file={file}
                  onClick={() => editorRefs.addFile(file)}
                  onDelete={() => deleteFile(file)}
                ></ArticleFileViewer>
              ))
              : null}
          </div>
        </>
      ) : null}

      <div className="article-body">
        {editing ? (
          <props.type.Editor content={content} files={props.article.files} refs={editorRefs} />
        ) : (
          <props.type.Viewer content={content} files={props.article.files} />
        )}
      </div>
      {user?.editPermission ? (
        <>
          <Space className="actions-list">
            {editing
              ? [
                <Button
                  type="link"
                  onClick={toogleEditing}
                  key="endEdit"
                  shape="round"
                  icon={<CheckOutlined />}
                ></Button>,
                <TreeSelect
                  key="subject"
                  onChange={updateSubjectId}
                  defaultValue={subjectId}
                  treeData={props.subjects}
                  placeholder={langs.get(Configs.UiLangsEnum.Subject)}
                />,
                ...props.tags.map((tag) => (
                  <Select
                    key={tag.name}
                    onChange={(value) => updateTag(tag, value)}
                    defaultValue={
                        tagsDict?.get(tag.name)?.value || `(${tag.name})`
                    }
                  >
                    <Option value={undefined!}>{`(${tag.name})`}</Option>
                      {...tag.values.map((v) => (
                        <Option key={v} value={v}>
                          {v}
                        </Option>
                      ))}
                  </Select>
                ))
              ]
              : [
                <EditOutlined
                  onClick={toogleEditing}
                  key="edit"
                  title={langs.get(Configs.UiLangsEnum.Modify)}
                />,
                <CloseOutlined
                  key="delete"
                  name={langs.get(Configs.UiLangsEnum.Delete)}
                  onClick={() =>
                    props.articleHandlers.onDelete(props.article.id!)
                  }
                />
              ]}
          </Space>
        </>
      ) : null}
    </Card>
  )
}
