import React from 'react'
import './Account.less'
import { useUser, useServicesLocator } from '../../app/Contexts'
import { Button, Avatar } from 'antd'
import { Configs, LoginApi } from '../../apis'
import { Redirect } from 'react-router-dom'
import { rewindRun } from '../../common/ApiService'
import { FileApiUrls, IFileApiService } from '../../domain/FileApiService'
import ILangsService from '../../domain/ILangsService'
import ILoginService from '../../app/ILoginService'
import IViewService from '../services/IViewService'
import ApiConfiguration from '../../common/ApiConfiguration'

export default function Account () {
  const user = useUser()
  if (!user) {
    return <Redirect to="/login" />
  }
  const locator = useServicesLocator()
  const langs = locator.locate(ILangsService)
  const loginService = locator.locate(ILoginService)
  const viewService = locator.locate(IViewService)

  const logOut = async () => {
    viewService!.setLoading(true)
    await loginService!.logout()
    viewService!.setLoading(false)
  }
  const changeName = () => {
    viewService.prompt(
      langs.get(Configs.UiLangsEnum.Modify) +
        langs.get(Configs.UiLangsEnum.UserName),
      [
        {
          type: 'Text',
          value: user.nickName || user.name,
          hint: langs.get(Configs.UiLangsEnum.UserName)
        }
      ],
      async (newName: string) => {
        if (!newName || newName === user.nickName) {
          return
        }
        try {
          await rewindRun(() =>
            new LoginApi(ApiConfiguration).updateNickName(newName)
          )
          user.nickName = newName
          return true
        } catch (e) {
          viewService!.errorKey(langs, e.message)
        }
      }
    )
  }

  const changeAvatar = () => {
    viewService.prompt(
      langs.get(Configs.UiLangsEnum.Modify),
      [{ type: 'Image', value: undefined }],
      async (image?: Blob) => {
        if (!image) {
          return true
        }
        try {
          const url = await locator
            .locate(IFileApiService)
            .fetch(FileApiUrls.Login_UpdateAvatar, { blob: image })
          user.avatar = url
          loginService!.raiseUpdate()
          return true
        } catch (e) {
          viewService!.errorKey(langs, e.message)
        }
      }
    )
  }

  const changePwd = () => {
    viewService.prompt(
      langs.get(Configs.UiLangsEnum.Modify) +
        langs.get(Configs.UiLangsEnum.Password),
      [
        {
          type: 'Password',
          value: '',
          hint: langs.get(Configs.UiLangsEnum.Password)
        },
        {
          type: 'Password',
          value: '',
          hint: langs.get(Configs.UiLangsEnum.NewPassword)
        },
        {
          type: 'Password',
          value: '',
          hint: langs.get(Configs.UiLangsEnum.NewPassword)
        }
      ],
      async (oldPwd: string, newPwd1: string, newPwd2: string) => {
        if (!oldPwd) {
          viewService!.errorKey(
            langs,
            Configs.ServiceMessagesEnum.UserOrPwdError
          )
          return
        }
        if (newPwd1 !== newPwd2) {
          viewService!.errorKey(langs, Configs.UiLangsEnum.PasswordNotSame)
          return
        }
        try {
          console.log({ password: oldPwd, oldPassword: newPwd1 })
          await rewindRun(() =>
            new LoginApi(ApiConfiguration).updatePwd({
              password: newPwd1,
              oldPassword: oldPwd
            })
          )
          return true
        } catch (e) {
          viewService!.errorKey(langs, e.message)
        }
      }
    )
  }

  return (
    <div className="account">
      <div className="avatar-wraper" onClick={changeAvatar}>
        <Avatar className="avatar" src={user.avatar || '/assets/avatar.png'} />
      </div>
      <Button
        className="user-name"
        size="large"
        type="text"
        onClick={changeName}
      >
        {user.nickName || user.name}
      </Button>
      <Button className="btn" type="text" onClick={changePwd}>
        {langs.get(Configs.UiLangsEnum.Modify) +
          langs.get(Configs.UiLangsEnum.Password)}
      </Button>
      <Button className="btn logout-btn" danger type="primary" onClick={logOut}>
        {langs.get(Configs.UiLangsEnum.Logout)}
      </Button>
    </div>
  )
}
