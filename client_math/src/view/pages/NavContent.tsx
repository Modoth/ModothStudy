import React from 'react'
import './NavContent.less'
import Login from './Login'
import { Switch, Route } from 'react-router-dom'
import Account from './Account'
import Library from './Library'

function NavContent () {
  return (
    <Switch>
      <Route path="/library">
        <Library />
      </Route>
      <Route path="/subject">
        <Subject />
      </Route>
      <Route path="/account">
        <Account />
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

function Home () {
  return <></>
}

function Subject () {
  return <></>
}

export default NavContent
