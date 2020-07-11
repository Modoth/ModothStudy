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
import ITextImageService, { TextImageServiceSingleton } from './view/services/ITextImageService'
import ITagsService, { TagsServiceSingleton } from './domain/ITagsService'
import IArticleViewServie, { ArticleViewServieSingleton } from './view/services/IArticleViewService'
import IAutoAccountService from './domain/IAutoAccountService'
import IFormulaEditingService from './domain/IFormulaEditingService'

const buildServicesLocator = () => {
  const serviceLocator = new ServicesLocator()

  serviceLocator.registerInstance(IPluginInfo, new MathPluginInfo())
  serviceLocator.registerInstance(ILoginService, new LoginService())
  serviceLocator.registerInstance(ILangsService, new LangsService())
  serviceLocator.registerInstance(IArticleListService, new ArticleListSingletonService())
  serviceLocator.registerInstance(ITextImageService, new TextImageServiceSingleton())
  serviceLocator.registerInstance(ITagsService, new TagsServiceSingleton())
  serviceLocator.registerInstance(IArticleViewServie, new ArticleViewServieSingleton())
  let w = window as any;
  if (w.autoAccountService) {
    serviceLocator.registerInstance(IAutoAccountService, w.autoAccountService)
  }
  if (w.formulaEditingService) {
    serviceLocator.registerInstance(IFormulaEditingService, w.formulaEditingService)
  }
  serviceLocator.register(ISubjectsService, SubjectsService)
  serviceLocator.register(IFileApiService, FileApiService)

  return serviceLocator as IServicesLocator
}

const bootstrap = async () => {
  const serviceLocator = buildServicesLocator()
  const loginService = serviceLocator.locate(ILoginService)
  const langsService = serviceLocator.locate(ILangsService)
  const plugin = serviceLocator.locate(IPluginInfo)
  const autoAccountService = serviceLocator.locate(IAutoAccountService)
  const account = await autoAccountService?.get()
  await Promise.all([langsService.load(Langs, plugin.langs), account && account.userName && account.password ?
    loginService.login(account.userName!, account.password!).catch((e)=>console.log(e)) : loginService.checkLogin()])
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
