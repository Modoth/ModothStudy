import React, { useState } from 'react'
import './App.less'
import { BrowserRouter as Router } from 'react-router-dom'
import { UserContext, useServicesLocator } from '../app/Contexts'
import LoginService from '../app/LoginService'
import Nav from './pages/Nav'
import NavContent from './pages/NavContent'
import ILoginService, { ILoginUser } from '../app/ILoginService'
import IViewService from './services/IViewService'
import ServicesLocator from '../common/ServicesLocator'
import ServiceView from './pages/ServiceView'

export default function App () {
  const locator = useServicesLocator() as ServicesLocator
  const loginService: LoginService = (locator.locate(
    ILoginService
  ) as any) as LoginService
  const [user, setUser] = useState<ILoginUser | undefined>(loginService.user)
  loginService.setUser = setUser

  return (
    <>
      <ServiceView
        provide={(s) => locator.registerInstance(IViewService, s)}
      ></ServiceView>
      <UserContext.Provider value={user}>
        <Router>
          <Nav></Nav>
          <div className="nav-content-wrapper">
            <NavContent></NavContent>
          </div>
        </Router>
      </UserContext.Provider>
    </>
  )
}
