import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import App from './view/App'
import LangsService from './domain/LangsService'
import { LangsContext, NotifyContext, LoginContext } from './app/contexts'
import NotifyService from './infras/NotifyService'
import LoginService from './infras/LoginService'

const bootstrap = async () => {
  const langsService = new LangsService()
  const loginService = new LoginService()
  await Promise.all([langsService.load(), loginService.checkLogin()])
  const notifyService = new NotifyService()
  ReactDOM.render(
    <React.StrictMode>
      <LangsContext.Provider value={langsService}>
        <NotifyContext.Provider value={notifyService}>
          <LoginContext.Provider value={loginService}>
            <App />
          </LoginContext.Provider>
        </NotifyContext.Provider>
      </LangsContext.Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

bootstrap()
