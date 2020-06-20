import React, { useContext, useState, useEffect } from 'react'
import './ManageSubjects.less'
import { useUser, useNotify, useLangs } from '../../app/contexts'
import { Redirect } from 'react-router-dom'
import { rewindRun } from '../../infras/ApiService'
import { Configs, TagsApi, PagedResultTagItem, TagItem } from '../../apis'
import { Pagination, Table, Button, Space, Input, Modal } from 'antd'
import { PlusOutlined, DeleteFilled } from '@ant-design/icons'

export function ManageSubjects () {
  const user = useUser()
  if (!user || !user.managePermission) {
    return <Redirect to="/login" />
  }
  const notify = useNotify()
  const langs = useLangs()
  return <div className="manage-subjects">
  </div>
}
