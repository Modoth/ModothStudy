import React, { useState } from 'react'
import './Account.less'
import { useLangs, useLogin, useNotify, useUser } from '../../app/contexts'
import { Space, Button, Avatar, Modal, Input } from 'antd'
import { Configs, LoginApi } from '../../apis'
import { Redirect } from 'react-router-dom'
import { tryRun as rewindRun } from '../../infras/ApiService'

export default function Account () {
  const user = useUser()
  if (!user) {
    return <Redirect to="/login" />
  }
  const langs = useLangs()
  const loginService = useLogin()
  const notify = useNotify()
  const logOut = async () => {
    notify!.setLoading(true)
    await loginService!.logout()
    notify!.setLoading(false)
  }
  const [newName, setNewName] = useState(user.nickName || user.name)
  const [changeNameVisible, setChangeNameVisible] = useState(false)
  const changeName = async () => {
    if (!newName || newName === user.nickName) {
      return
    }
    try {
      await rewindRun(() => new LoginApi().updateNickName(newName))
      user.nickName = newName
      setChangeNameVisible(false)
    } catch (e) {
      notify!.errorKey(langs, e.message)
    }
  }
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd1, setNewPwd1] = useState('')
  const [newPwd2, setNewPwd2] = useState('')
  const [changePwdVisible, setChangePwdVisible] = useState(false)
  const changePwd = async () => {
    if (!oldPwd) {
      notify!.errorKey(langs, Configs.ServiceMessagesEnum.UserOrPwdError)
      return
    }
    if (newPwd1 !== newPwd2) {
      notify!.errorKey(langs, Configs.UiLangsEnum.PasswordNotSame)
      return
    }
    try {
      console.log({ password: oldPwd, oldPassword: newPwd1 })
      await rewindRun(() => new LoginApi().updatePwd({ password: newPwd1, oldPassword: oldPwd }))
      setOldPwd(''); setNewPwd1(''); setNewPwd2(''); setChangePwdVisible(false)
    } catch (e) {
      notify!.errorKey(langs, e.message)
    }
  }
  return (
    <div className="account">
      <Avatar className="avatar" src={user.avatar || '/assets/avatar.png'} />
      <Button
        className="user-name"
        size="large"
        type="text"
        onClick={() => setChangeNameVisible(true)}
      >
        {user.nickName || user.name}
      </Button>
      <Button className="btn" type="text" onClick={() => setChangePwdVisible(true)}>
        {langs.get(Configs.UiLangsEnum.Modify) + langs.get(Configs.UiLangsEnum.Password)}
      </Button>
      <Button className="btn logout-btn" danger type="primary" onClick={logOut}>
        {langs.get(Configs.UiLangsEnum.Logout)}
      </Button>
      <Modal
        title={langs.get(Configs.UiLangsEnum.Modify) + langs.get(Configs.UiLangsEnum.UserName)}
        visible={changeNameVisible}
        onOk={changeName}
        onCancel={() => { setNewName(user.nickName || user.name); setChangeNameVisible(false) }}
        okText={langs.get(Configs.UiLangsEnum.Ok)}
        cancelText={langs.get(Configs.UiLangsEnum.Cancle)}
      >
        <Input value={newName} onChange={e => setNewName(e.target.value)}></Input>
      </Modal>
      <Modal
        title={langs.get(Configs.UiLangsEnum.Modify) + langs.get(Configs.UiLangsEnum.Password)}
        visible={changePwdVisible}
        onOk={changePwd}
        onCancel={() => { setOldPwd(''); setNewPwd1(''); setNewPwd2(''); setChangePwdVisible(false) }}
        okText={langs.get(Configs.UiLangsEnum.Ok)}
        cancelText={langs.get(Configs.UiLangsEnum.Cancle)}
      >
        <Space direction="vertical" className="change-pwd-panel">
          <Input.Password value={oldPwd} onChange={e => setOldPwd(e.target.value)} placeholder={langs.get(Configs.UiLangsEnum.Password)} ></Input.Password>
          <Input.Password value={newPwd1} onChange={e => setNewPwd1(e.target.value)} placeholder={langs.get(Configs.UiLangsEnum.NewPassword)} ></Input.Password>
          <Input.Password value={newPwd2} onChange={e => setNewPwd2(e.target.value)} placeholder={langs.get(Configs.UiLangsEnum.NewPassword)} ></Input.Password>
        </Space>
      </Modal>
    </div>
  )
}
