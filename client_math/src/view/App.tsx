import React, { useState, useEffect } from 'react'
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
import { TagsApi } from '../apis'
import ApiConfiguration from '../common/ApiConfiguration'
import { rewindRun } from '../common/ApiService'
import ITextImageService from './services/ITextImageService'
import ITagsService, { TagNames } from '../domain/ITagsService'

let savedScrollTop = 0
let savedScrollElement: HTMLElement | null = null

export default function App() {
  const locator = useServicesLocator() as ServicesLocator
  const loginService: LoginService = (locator.locate(
    ILoginService
  ) as any) as LoginService
  const [user, setUser] = useState<ILoginUser | undefined>(loginService.user)
  loginService.setUser = setUser
  const ref = React.createRef<HTMLDivElement>()
  const fetchTitle = async () => {
    var titles = await locator.locate(ITagsService).getValues(TagNames.TitleTag)
    if (!titles.length) {
      return
    }
    var title = titles[Math.floor(Math.random() * titles.length)]
    document.title = title
    // const url = await locator.locate(ITextImageService).generate(title, 48, 'rgba(0,0,0,0.05)', -45)
    // document.body.style.backgroundImage = `url("${url}")`;
  }
  useEffect(() => {
    fetchTitle()
  }, [])
  return (
    <>
      <UserContext.Provider value={user}>
        <ServiceView
          provide={(s) => locator.registerInstance(IViewService, s)}
          setContentVisiable={(v) => {
            if (!ref.current) {
              return
            }
            if (v) {
              ref.current!.classList.remove('hidden')
              setTimeout(() => {
                if (savedScrollElement) {
                  savedScrollElement.scrollTo({ top: savedScrollTop, behavior: undefined })
                  console.log(savedScrollElement, savedScrollTop)
                }
              }, 50);
            } else {
              savedScrollElement = document.scrollingElement as HTMLElement
              if (savedScrollElement) {
                savedScrollTop = savedScrollElement?.scrollTop
                savedScrollElement?.scrollTo(0, 0)
                console.log(savedScrollElement, savedScrollTop)
              }
              ref.current!.classList.add('hidden')
            }
          }}
        ></ServiceView>
        <div ref={ref}>
          <Router >
            <Nav></Nav>
            <div className="nav-content-wrapper">
              <NavContent></NavContent>
            </div>
          </Router>
        </div>
      </UserContext.Provider>
    </>
  )
}
