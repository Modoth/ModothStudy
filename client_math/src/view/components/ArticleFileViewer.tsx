import React, { ReactNode } from 'react'
import './ArticleFileViewer.less'
import { ArticleFile } from '../../domain/Article'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'

export default function ArticleFileViewer (props: {
  align?: 'Left' | 'Center' | 'Right' | 'Stretch';
  onDelete?: { (): void };
  onClick?: { (): void };
  file: ArticleFile;
}) {
  const type = (props.file?.name || '').toLocaleLowerCase()
  const url = props.file?.url
  const endsWith = (...s: string[]) => s.some((i) => type.endsWith(i))
  let content: ReactNode | undefined
  if (endsWith('.png', '.jpg', '.jpeg', 'gif')) {
    content = <img src={url} />
  } else if (endsWith('.mp4')) {
    if (props.onClick) {
      content = <video
        src={`${url}#t=0.1`}
        onClick={(e) => {
          e.stopPropagation()
          props.onClick && props.onClick()
        }}
      ></video>
    } else {
      content = (
        <video
          src={`${url}#t=0.1`}
          controls
        ></video>
      )
    }
  } else {
    content = <span>{props.file?.name}</span>
  }
  return (
    <Tooltip title={props.file.name}>
      <div className="article-file" onClick={props.onClick}>
        {content}
        {props.onDelete ? (
          <Button
            type="primary"
            shape="circle"
            danger
            icon={<CloseOutlined />}
            size="small"
            className="btn-delete"
            onClick={(e) => {
              e.stopPropagation()
              props.onDelete && props.onDelete()
            }}
          ></Button>
        ) : null}
      </div>
    </Tooltip>
  )
}
