import React, { useContext } from 'react'
import './Nav.less'
import { Link } from 'react-router-dom'
import {
  LangsContext,
  useUser
} from '../../app/contexts'
import { Configs } from '../../apis'
import { Menu, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'

function Nav () {
  const langs = useContext(LangsContext)
  const user = useUser()
  return (
    <Menu mode="horizontal" className="nav">
      <Menu.Item>
        <Link to="/">{langs.get(Configs.UiLangsEnum.Home)}</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/library">{langs.get(Configs.UiLangsEnum.Library)}</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/subject">{langs.get(Configs.UiLangsEnum.Solution)}</Link>
      </Menu.Item>
      <Menu.Item disabled={true} className="menu-item-devider"></Menu.Item>
      <Menu.Item className="icon">
        {user ? (
          <Link to="/account">
            <Avatar className="avatar" src={user.avatar || '/assets/avatar.png'} />
          </Link>
        ) : (
          <Link to="/login">
            <UserOutlined />
          </Link>
        )}
      </Menu.Item>
    </Menu>
  )
}

export default Nav
