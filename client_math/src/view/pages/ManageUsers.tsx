import React, { useContext, useState, useEffect } from 'react'
import './ManageUsers.less'
import { useUser, useNotify, useLangs } from '../../app/contexts'
import { Redirect } from 'react-router-dom'
import { rewindRun } from '../../infras/ApiService'
import { UsersApi, PagedResultUser, User, Configs } from '../../apis'
import { Pagination, Table, Button, Space, Input, Modal, Switch } from 'antd'
import { UserOutlined, PlusOutlined } from '@ant-design/icons'

export function ManageUsers () {
  const user = useUser()
  if (!user || !user.managePermission) {
    return <Redirect to="/login" />
  }
  const notify = useNotify()
  const langs = useLangs()
  const [users, setUsers] = useState<User[] | undefined>()
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const countPerPage = 10
  const fetchUsers = async (page:number) => {
    if (page === currentPage) {
      return
    }
    let res: PagedResultUser | undefined
    try {
      res = await rewindRun(() => new UsersApi().users(undefined, (page - 1) * currentPage, countPerPage))
    } catch (e) {
      notify!.errorKey(langs, e.message)
    }
    setUsers(res!.data!)
    setTotalPage(res!.total!)
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchUsers(1)
  }, [])
  const [addUserVisible, setAddUserVisible] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserPwd, setNewUserPwd] = useState('')
  const renderName = (_: string, user:User) => {
    return <span>{user.name}</span>
  }
  const clearAddUser = () => {
    setNewUserPwd('')
    setNewUserName('')
    setAddUserVisible(false)
  }
  const addUser = async () => {
    if (!newUserName || !newUserPwd) {
      return
    }
    try {
      const newUser = await rewindRun(() => new UsersApi().addUser({ name: newUserName, pwd: newUserPwd }))
      setUsers([...users!, newUser!])
      clearAddUser()
    } catch (e) {
        notify!.errorKey(langs, e.message)
    }
  }
  const renderRole = (_:string, user:User) => {
    return <span>{user.roleId}</span>
  }
  const toogleUserState = async (user:User) => {
    try {
      const setToNormal = user.state !== User.StateEnum.Normal
      await rewindRun(() => new UsersApi().changeUserState(user.id!, setToNormal))
      user.state = setToNormal ? User.StateEnum.Normal : User.StateEnum.Disabled
      setUsers([...users!])
    } catch (e) {
        notify!.errorKey(langs, e.message)
    }
  }
  const renderState = (_:string, user:User) => {
    return <Switch onClick={() => toogleUserState(user)} checked={user.state === User.StateEnum.Normal}></Switch>
  }
  return <div className="manage-users">
    <Table rowKey="name" columns={[
      {
        title: langs.get(Configs.UiLangsEnum.UserName),
        dataIndex: 'name',
        key: 'name',
        render: renderName
      },
      //   {
      //     title: langs.get(Configs.UiLangsEnum.Role),
      //     dataIndex: 'roleId',
      //     key: 'roleId',
      //     render: renderRole
      //   },
      {
        title: langs.get(Configs.UiLangsEnum.State),
        dataIndex: 'state',
        key: 'state',
        className: 'user-state-column',
        render: renderState
      }
    ]} dataSource={users} pagination={false} ></Table>
    <Button icon={<PlusOutlined />} className="btn-create" type="dashed" onClick={() => setAddUserVisible(true)}>{langs.get(Configs.UiLangsEnum.Create)}</Button>
    <Modal
      title={langs.get(Configs.UiLangsEnum.Create)}
      visible={addUserVisible}
      onOk={addUser}
      onCancel={clearAddUser}
      okText={langs.get(Configs.UiLangsEnum.Ok)}
      cancelText={langs.get(Configs.UiLangsEnum.Cancle)}
    >
      <Space direction="vertical" className="change-pwd-panel">
        <Input value={newUserName} onChange={e => setNewUserName(e.target.value)} suffix={<UserOutlined />} placeholder={langs.get(Configs.UiLangsEnum.UserName)} ></Input>
        <Input.Password value={newUserPwd} onChange={e => setNewUserPwd(e.target.value)} placeholder={langs.get(Configs.UiLangsEnum.Password)} ></Input.Password>
      </Space>
    </Modal>
    <Pagination className="pagination" onChange={(page) => fetchUsers(page)} total={totalPage}></Pagination>
  </div>
}
