import React, { useState } from 'react'
import {
  ArticleType,
  ArticleContentEditorCallbacks,
} from '../../plugins/IPluginInfo'
import Article, { ArticleFile, ArticleContent } from '../../domain/Article'
import { NodesApi, Configs, NodeTag } from '../../apis'
import ApiConfiguration from '../../common/ApiConfiguration'
import { rewindRun } from '../../common/ApiService'
import { useUser, useServicesLocator } from '../../app/Contexts'
import ILangsService, { LangKeys } from '../../domain/ILangsService'
import IViewService from '../services/IViewService'
import { Card, Button, Select, TreeSelect } from 'antd'
import {
  UploadOutlined,
  CheckOutlined,
  EditOutlined,
  FileAddOutlined,
  FileExcelOutlined,
  ContainerOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { IFileApiService, FileApiUrls } from '../../domain/FileApiService'
import { ArticleTag, SubjectViewModel } from './Library'
import './ArticleView.less'
import IArticleListService from '../../domain/IArticleListService'
import classNames from 'classnames'
import { generateRandomStyle } from './common'
import { TagNames } from '../../domain/ITagsService'
import IArticleViewServie from '../services/IArticleViewService'

const { Option } = Select

const generateNewFileNames = (name: string, existedName: Set<string>) => {
  while (existedName.has(name)) {
    let match = name.match(/^(.*?)(_(\d*))?(\.\w*)$/)
    if (match) {
      name = match[1] + '_' + ((parseInt(match[3]) || 0) + 1) + match[4]
    }
    else {
      return name
    }
  }
  return name
}

export default function ArticleView(props: {
  article: Article;
  articleHandlers: { onDelete: { (id: string): void }, editingArticle?: Article };
  type: ArticleType;
  subjects: SubjectViewModel[];
  tags: ArticleTag[];
  nodeTags: Map<string, NodeTag>
}) {
  const user = useUser()
  const locator = useServicesLocator()
  const langs = locator.locate(ILangsService)
  const viewService = locator.locate(IViewService)
  const articleListService = locator.locate(IArticleListService)
  const [files, setFiles] = useState(props.article.files)
  const [tagsDict, setTagsDict] = useState(props.article.tagsDict)
  const [subjectId, setSubjectId] = useState(props.article.subjectId)
  const [editing, setEditing] = useState(props.articleHandlers.editingArticle === props.article)
  const [editorRefs, setEditorRefs] = useState<ArticleContentEditorCallbacks<ArticleContent>>(
    {} as any
  )
  const [type, setType] = useState(locator.locate(IArticleViewServie).getArticleType(props.type.Viewer, props.type.name, tagsDict, props.nodeTags))
  const [inArticleList, setInArticleList] = useState(articleListService.has(props.article))
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

  const addFile = (file?: File) => {
    viewService.prompt(
      langs.get(Configs.UiLangsEnum.Import),
      [
        {
          type: 'File',
          value: file
        }
      ],
      async (file: File) => {
        try {
          viewService.setLoading(true)
          const fileApiService = locator.locate(IFileApiService)
          const api = new NodesApi(ApiConfiguration)
          const url = await fileApiService.fetch(FileApiUrls.Files_UploadFile, {
            blob: file
          })
          const newFiles = [...(files || [])]
          const newFileName = generateNewFileNames(file.name, new Set(newFiles.map(f => f.name!)))
          const newFile = { name: newFileName, url }
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
          viewService.setLoading(false)
          return true
        } catch (e) {
          viewService.setLoading(false)
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

  const toggleEditing = async () => {
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
      let newTag: NodeTag
      if (!newTags.has(tag.name)) {
        newTag = {
          id: tag.id,
          name: tag.name,
          type: NodeTag.TypeEnum.Enum,
          value: tagValue,
          values: tag.values.join(' ')
        }
        newTags.set(tag.name, newTag)
      } else {
        newTag = newTags.get(tag.name)
        newTag!.value = tagValue
      }
      tagsDict?.set(newTag.name!, newTag)
      if (newTag.name === props.type.name + TagNames.SubTypeSurfix) {
        setType(locator.locate(IArticleViewServie).getArticleType(props.type.Viewer, props.type.name, tagsDict, props.nodeTags))
      }
    } catch (e) {
      viewService!.errorKey(langs, e.message)
    }
  }
  const ref = React.createRef<HTMLDivElement>()
  // const shareArticle = async () => {
  //   if (!ref.current) {
  //     return
  //   }
  //   // const canvas = await html2canvas(ref.current)
  //   // const imgUrl = canvas.toDataURL('image/png')
  //   const imgUrl = await htmlToImage.toPng(ref.current)
  //   viewService.previewImage(imgUrl)
  // } 
  return (
    <Card className={classNames(generateRandomStyle(), "article-view")}>
      <div ref={ref} className="article-body">
        {editing ? (
          <props.type.Editor
            onpaste={addFile}
            content={content}
            files={files}
            callbacks={editorRefs}
            type={type}
          />
        ) : (
            <props.type.Viewer content={content} files={files} type={type} onClick={() => {
              locator.locate(IViewService).previewArticle({ content, files }, type)
            }} />
          )}
      </div>
      {editing ? (<div className="actions-tags-list">{[
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
      ]}</div>) : (user?.editPermission ? (<div className="actions-list">{[
        <Button type="link" ghost danger icon={<CloseOutlined />} onClick={() =>
          props.articleHandlers.onDelete(props.article.id!)
        } key="delete">{langs.get(Configs.UiLangsEnum.Delete)}</Button>,
        inArticleList ?
          <Button type="link" ghost icon={<ContainerOutlined />} onClick={() => {
            articleListService.remove(props.article)
            setInArticleList(articleListService.has(props.article))
          }}
            key={LangKeys.RemoveFromArticleList}>{langs.get(LangKeys.RemoveFromArticleList)}</Button> :
          <Button type="link" ghost icon={<ContainerOutlined />} onClick={() => {
            articleListService.add(props.article, type)
            setInArticleList(articleListService.has(props.article))
          }}
            key={LangKeys.AddToArticleList}>{langs.get(LangKeys.AddToArticleList)}</Button>,
        <Button type="link" ghost icon={<EditOutlined />} onClick={toggleEditing}
          key="edit">{langs.get(Configs.UiLangsEnum.Modify)}</Button>

      ]} </div>) : null)
      }
      {editing ? (
        <>
          <div className="files-list">
            <Button
              type="link"
              onClick={toggleEditing}
              key="endEdit"
              icon={<CheckOutlined />}
            >{langs.get(Configs.UiLangsEnum.Ok)}</Button>,
            <Button
              type="link"
              icon={<UploadOutlined />}
              onClick={() => addFile()}
            >{langs.get(Configs.UiLangsEnum.Import)}</Button>
            {/* {files?.length
              ? files!.map((file) => (
                <ArticleFileViewer
                  key={file.url}
                  file={file}
                  onClick={() => editorRefs.addFile(file)}
                  onDelete={() => deleteFile(file)}
                ></ArticleFileViewer>
              ))
              : null} */}
          </div>
        </>
      ) : null}
    </Card>
  )
}
