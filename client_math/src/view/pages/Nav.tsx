import React, { useEffect, useState } from 'react'
import './Nav.less'
import { Link } from 'react-router-dom'
import { useUser, useServicesLocator } from '../../app/Contexts'
import { Configs } from '../../apis'
import { Menu, Avatar } from 'antd'
import {
  UserOutlined,
  HomeOutlined,
  ApiOutlined,
  ApartmentOutlined,
  SettingOutlined,
  TeamOutlined,
  TagsOutlined
} from '@ant-design/icons'
import ILangsService from '../../domain/ILangsService'
import IPluginInfo from '../../plugins/IPluginInfo'
import { generateRandomStyle } from './common'
import classNames from 'classnames'
import ITagsService, { TagNames } from '../../domain/ITagsService'
const { SubMenu } = Menu
function Nav() {
  const locator = useServicesLocator()
  const plugin = locator.locate(IPluginInfo)
  const langs = locator.locate(ILangsService)
  const [title,setTitile] = useState(langs.get(Configs.UiLangsEnum.Home))
  const user = useUser()
  const fetchTitle = async () => {
    var titles = await locator.locate(ITagsService).getValues(TagNames.TitleTag)
    if (!titles.length) {
      return
    }
    var title = titles[Math.floor(Math.random() * titles.length)]
    setTitile(title)
  }
  useEffect(() => {
    fetchTitle()
  }, [])
  return (
    <Menu mode="horizontal" className={classNames("nav", generateRandomStyle())}>
      <Menu.Item icon={<HomeOutlined />}>
        <Link to="/">{title}</Link>
      </Menu.Item>
      {
        plugin.types.map(t => <Menu.Item key={t.route} icon={t.icon}>
          <Link to={'/' + t.route}>{t.name}</Link>
        </Menu.Item>)
      }
      <Menu.Item disabled={true} className="menu-item-devider"></Menu.Item>
      {user && user.managePermission ? (
        <SubMenu
          icon={<SettingOutlined />}
          title={langs.get(Configs.UiLangsEnum.Manage)}
        >
          <Menu.Item icon={<ApiOutlined />}>
            <Link to="/manage/subjects">
              {langs.get(Configs.UiLangsEnum.Subject)}
            </Link>
          </Menu.Item>
          <Menu.Item icon={<TagsOutlined />}>
            <Link to="/manage/tags">{langs.get(Configs.UiLangsEnum.Tags)}</Link>
          </Menu.Item>
          <Menu.Item icon={<TeamOutlined />}>
            <Link to="/manage/users">
              {langs.get(Configs.UiLangsEnum.User)}
            </Link>
          </Menu.Item>
        </SubMenu>
      ) : null}
      {user ? (
        <Menu.Item
          className="nav-avatar-icon"
          icon={
            <Avatar
              className="avatar"
              src={user.avatar || '/assets/avatar.png'}
            />
          }
        >
          <Link to="/account"></Link>
        </Menu.Item>
      ) : (
          <Menu.Item icon={<UserOutlined />}>
            <Link to="/login">{langs.get(Configs.UiLangsEnum.Login)}</Link>
          </Menu.Item>
        )}
    </Menu>
  )
}

export default Nav
