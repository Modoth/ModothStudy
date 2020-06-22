import React from 'react'
import './NavContent.less'
import Login from './Login'
import { Switch, Route } from 'react-router-dom'
import Account from './Account'
import Library from './Library'
import { ManageUsers } from './ManageUsers'
import { ManageTags } from './ManageTags'
import { ManageSubjects } from './ManageSubjects'
import { useServicesLocator } from '../../app/Contexts'
import IPluginInfo from '../../plugins/IPluginInfo'
import Home from './Home'

function NavContent () {
  const locator = useServicesLocator()
  const plugin = locator.locate(IPluginInfo)
  return (
    <Switch>
      {
        plugin.types.map(t => <Route key={t.route} path={'/' + t.route}>
          <Library type={t}/>
        </Route>)
      }
      <Route path="/account">
        <Account />
      </Route>
      <Route path="/manage/users">
        <ManageUsers />
      </Route>
      <Route path="/manage/tags">
        <ManageTags />
      </Route>
      <Route path="/manage/subjects">
        <ManageSubjects />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}

export default NavContent
