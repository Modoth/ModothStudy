import React, { useState, useEffect } from 'react'
import './ManageUsers.less'
import { useUser, useServicesLocator } from '../../app/Contexts'
import { Redirect } from 'react-router-dom'
import { rewindRun } from '../../common/ApiService'
import { UsersApi, PagedResultUser, User, Configs } from '../../apis'
import { Pagination, Table, Button, Switch } from 'antd'
import { PlusOutlined, UserOutlined } from '@ant-design/icons'
import ILangsService from '../../domain/ILangsService'
import IViewService from '../services/IViewService'
import ApiConfiguration from '../../common/ApiConfiguration'

export function ManageUsers () {
  const user = useUser()
  if (!user || !user.managePermission) {
    return <Redirect to="/login" />
  }
  const locator = useServicesLocator()
  const langs = locator.locate(ILangsService)
  const viewService = locator.locate(IViewService)

  const [users, setUsers] = useState<User[] | undefined>()
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const countPerPage = 10

  const fetchUsers = async (page: number) => {
    if (page === currentPage) {
      return
    }
    let res: PagedResultUser | undefined
    try {
      res = await rewindRun(() =>
        new UsersApi(ApiConfiguration).users(undefined, (page - 1) * currentPage, countPerPage)
      )
    } catch (e) {
      viewService!.errorKey(langs, e.message)
    }
    setUsers(res!.data!)
    setTotalPage(Math.ceil(res!.total! / countPerPage))
    setCurrentPage(page)
  }

  const addUser = () => {
    viewService.prompt(
      langs.get(Configs.UiLangsEnum.Create),
      [
        {
          type: 'Text',
          icon: <UserOutlined />,
          value: '',
          hint: langs.get(Configs.UiLangsEnum.UserName)
        },
        {
          type: 'Password',
          value: '',
          hint: langs.get(Configs.UiLangsEnum.Password)
        }
      ],
      async (newUserName: string, newUserPwd: string) => {
        if (!newUserName || !newUserPwd) {
          return
        }
        try {
          const newUser = await rewindRun(() =>
            new UsersApi(ApiConfiguration).addUser({ name: newUserName, pwd: newUserPwd })
          )
          setUsers([...users!, newUser!])
          return true
        } catch (e) {
          viewService!.errorKey(langs, e.message)
        }
      }
    )
  }

  const toogleUserState = async (user: User) => {
    try {
      const setToNormal = user.state !== User.StateEnum.Normal
      await rewindRun(() =>
        new UsersApi(ApiConfiguration).changeUserState(user.id!, setToNormal)
      )
      user.state = setToNormal
        ? User.StateEnum.Normal
        : User.StateEnum.Disabled
      setUsers([...users!])
    } catch (e) {
      viewService!.errorKey(langs, e.message)
    }
  }

  useEffect(() => {
    fetchUsers(1)
  }, [])

  const renderName = (_: string, user: User) => {
    return <span>{user.name}</span>
  }

  const renderState = (_: string, user: User) => {
    return (
      <Switch
        onClick={() => toogleUserState(user)}
        checked={user.state === User.StateEnum.Normal}
      ></Switch>
    )
  }

  return (
    <div className="manage-users">
      <Table
        rowKey="name"
        columns={[
          {
            title: langs.get(Configs.UiLangsEnum.UserName),
            dataIndex: 'name',
            key: 'name',
            render: renderName
          },
          {
            title: langs.get(Configs.UiLangsEnum.State),
            dataIndex: 'state',
            key: 'state',
            className: 'user-state-column',
            render: renderState
          }
        ]}
        dataSource={users}
        pagination={false}
      ></Table>
      <Button
        icon={<PlusOutlined />}
        className="btn-create"
        type="dashed"
        onClick={addUser}
      >
        {langs.get(Configs.UiLangsEnum.Create)}
      </Button>
      {totalPage > 1 ? (
        <Pagination
          className="pagination"
          onChange={(page) => fetchUsers(page)}
          total={totalPage}
        ></Pagination>
      ) : null}
    </div>
  )
}
