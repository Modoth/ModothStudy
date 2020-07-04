import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import App from './view/App'
import LangsService from './domain/LangsService'
import { ServicesLocatorProvider } from './app/Contexts'
import LoginService from './app/LoginService'
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'
import ServicesLocator from './common/ServicesLocator'
import IServicesLocator from './common/IServicesLocator'
import ILoginService from './app/ILoginService'
import ILangsService from './domain/ILangsService'
import ISubjectsService from './domain/ISubjectsService'
import SubjectsService from './domain/SubjectsService'
import IPluginInfo from './plugins/IPluginInfo'
import { MathPluginInfo } from './plugins/math'
import { FileApiService, IFileApiService } from './domain/FileApiService'
import IArticleListService, { ArticleListSingletonService } from './domain/IArticleListService'
import Langs from './view/Langs'

const buildServicesLocator = () => {
  const serviceLocator = new ServicesLocator()

  serviceLocator.registerInstance(IPluginInfo, new MathPluginInfo())
  serviceLocator.registerInstance(ILoginService, new LoginService())
  serviceLocator.registerInstance(ILangsService, new LangsService())
  serviceLocator.registerInstance(IArticleListService, new ArticleListSingletonService())
  serviceLocator.register(ISubjectsService, SubjectsService)
  serviceLocator.register(IFileApiService, FileApiService)

  return serviceLocator as IServicesLocator
}

const bootstrap = async () => {
  const serviceLocator = buildServicesLocator()
  const loginService = serviceLocator.locate(ILoginService)
  const langsService = serviceLocator.locate(ILangsService)
  const plugin = serviceLocator.locate(IPluginInfo)
  await Promise.all([langsService.load(Langs, plugin.langs), loginService.checkLogin()])

  ReactDOM.render(
    <React.StrictMode>
      <ServicesLocatorProvider value={serviceLocator}>
        <ConfigProvider locale={zhCN}>
          <App />
        </ConfigProvider>
      </ServicesLocatorProvider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

bootstrap()
