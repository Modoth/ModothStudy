import React, { useContext } from 'react'
import './Nav.less'
import { Link } from 'react-router-dom'
import {
  LangsContext,
  useUser
} from '../../app/contexts'
import { Configs } from '../../apis'
import { Menu, Avatar } from 'antd'
import { UserOutlined, HomeOutlined, ApiOutlined, ApartmentOutlined, SettingOutlined, TeamOutlined, TagsOutlined } from '@ant-design/icons'
const { SubMenu } = Menu
function Nav () {
  const langs = useContext(LangsContext)
  const user = useUser()
  return (
    <Menu mode="horizontal" className="nav">
      <Menu.Item icon={<HomeOutlined />}>
        <Link to="/">{langs.get(Configs.UiLangsEnum.Home)}</Link>
      </Menu.Item>
      <Menu.Item icon={<ApartmentOutlined />}>
        <Link to="/library">{ langs.get(Configs.UiLangsEnum.Workbook)}</Link>
      </Menu.Item>
      <Menu.Item icon={<ApiOutlined />}>
        <Link to="/subject">{ langs.get(Configs.UiLangsEnum.Subject)}</Link>
      </Menu.Item>
      <Menu.Item disabled={true} className="menu-item-devider"></Menu.Item>
      {
        user && user.managePermission ? <SubMenu icon={<SettingOutlined />} title={ langs.get(Configs.UiLangsEnum.Manage)}>
          <Menu.Item icon={<ApiOutlined />}>
            <Link to="/manage/subjects">{ langs.get(Configs.UiLangsEnum.Subject)}</Link>
          </Menu.Item>
          <Menu.Item icon={ <TagsOutlined />}>
            <Link to="/manage/tags">{ langs.get(Configs.UiLangsEnum.Tags)}</Link>
          </Menu.Item>
          <Menu.Item icon={<TeamOutlined />}>
            <Link to="/manage/users">{ langs.get(Configs.UiLangsEnum.User)}</Link>
          </Menu.Item>
        </SubMenu> : null
      }
      {
        user
          ? <Menu.Item className="nav-avatar-icon" icon={<Avatar className="avatar" src={user.avatar || '/assets/avatar.png'} />}>
            <Link to="/account"></Link>
          </Menu.Item>
          : <Menu.Item icon={<UserOutlined />}>
            <Link to="/login">{ langs.get(Configs.UiLangsEnum.Login)}</Link>
          </Menu.Item>
      }

    </Menu>
  )
}

export default Nav
