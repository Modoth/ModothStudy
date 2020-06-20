import React, { useState } from 'react'
import './App.less'
import { BrowserRouter as Router } from 'react-router-dom'
import { UserContext, useNotify, useLogin } from '../app/contexts'
import { Spin } from 'antd'
import NotifyService from '../infras/NotifyService'
import LoginService from '../infras/LoginService'
import Nav from './pages/Nav'
import NavContent from './pages/NavContent'
import { ILoginUser } from '../app/ILoginService'

function App () {
  let [user, setUser] = useState<ILoginUser | undefined>()
  const [loading, setLoading] = useState(false)
  const notifyService: NotifyService = useNotify()!
  notifyService.setLoading = setLoading
  const loginService: LoginService = useLogin() as LoginService
  loginService.setUser = setUser
  user = loginService.user
  return (
    <UserContext.Provider value={user}>
      <Spin spinning={loading} size="large">
        <Router>
          <Nav></Nav>
          <div className="nav-content-wrapper">
            <NavContent></NavContent>
          </div>
        </Router>
      </Spin>
    </UserContext.Provider>
  )
}

export default App
