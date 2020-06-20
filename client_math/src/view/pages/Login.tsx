import React, { useState } from 'react'
import './Login.less'
import { useLangs, useLogin, useNotify, useUser } from '../../app/contexts'
import { Input, Space, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Configs } from '../../apis'
import { Redirect } from 'react-router-dom'

export default function Login () {
  const user = useUser()
  if (user) {
    return <Redirect to="/account" />
  }
  const langs = useLangs()
  const loginService = useLogin()
  const notify = useNotify()
  const [name, setName] = useState('')
  const [pwd, setPwd] = useState('')
  const tryLogin = async () => {
    if (!name || !pwd) {
      console.log(Configs.ServiceMessagesEnum.UserOrPwdError)
      return
    }
    notify!.setLoading(true)
    try {
      await loginService!.login(name, pwd)
    } catch (e) {
      notify!.errorKey(langs, e.message)
    }
    notify!.setLoading(false)
  }
  return (
    <Space direction="vertical" className="login">
      <Input
        value={name}
        onChange={(e) => {
          setName(e.target.value)
        }}
        placeholder={langs.get(Configs.UiLangsEnum.UserName)}
        suffix={<UserOutlined />}
      />
      <Input.Password
        value={pwd}
        onChange={(e) => {
          setPwd(e.target.value)
        }}
        placeholder={langs.get(Configs.UiLangsEnum.Password)}
        onPressEnter={tryLogin}
      />
      <Button className="login-btn" type="primary" onClick={tryLogin}>
        {langs.get(Configs.UiLangsEnum.Login)}
      </Button>
    </Space>
  )
}
