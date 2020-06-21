import React, { useState, useRef } from 'react'
import './Account.less'
import { useUser, useServicesLocator } from '../../app/Contexts'
import { Space, Button, Avatar, Modal, Input } from 'antd'
import { Configs, LoginApi } from '../../apis'
import { Redirect } from 'react-router-dom'
import { rewindRun } from '../../common/ApiService'
import ImageEditor from '../components/ImageEditor'
import { FileApiService, FileApiUrls } from '../../domain/FileApiService'
import ILangsService from '../../domain/ILangsService'
import ILoginService from '../../app/ILoginService'
import IViewService from '../services/IViewService'

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
          await rewindRun(() => new LoginApi().updateNickName(newName))
          user.nickName = newName
          return true
        } catch (e) {
          viewService!.errorKey(langs, e.message)
        }
      }
    )
  }
  const [newAvatar, setNewAvatar] = useState<Blob | undefined>(undefined)
  const refFile = useRef<HTMLInputElement | null>(null)
  const [changeAvatarVisible, setChangeAvatarVisible] = useState(false)
  const cancleChangeAvatar = () => {
    if (refFile.current) {
      refFile.current.value = ''
    }
    setNewAvatar(undefined)
    setChangeAvatarVisible(false)
  }
  const changeAvatar = async (image?: Blob) => {
    if (!image) {
      cancleChangeAvatar()
      return
    }
    try {
      const url = await new FileApiService().fetch(
        FileApiUrls.Login_UpdateAvatar,
        { blob: image }
      )
      user.avatar = url
      loginService!.raiseUpdate()
    } catch (e) {
      viewService!.errorKey(langs, e.message)
    }
    cancleChangeAvatar()
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
            new LoginApi().updatePwd({ password: newPwd1, oldPassword: oldPwd })
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
      <div
        className="avatar-wraper"
        onClick={() => {
          refFile.current!.click()
        }}
      >
        <Avatar className="avatar" src={user.avatar || '/assets/avatar.png'} />
        <input
          type="file"
          className="hidden"
          ref={refFile}
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files && e.target.files![0]
            if (!file) {
              return
            }
            setNewAvatar(file)
            setChangeAvatarVisible(true)
          }}
        ></input>
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
      <Modal
        title={langs.get(Configs.UiLangsEnum.Modify)}
        visible={changeAvatarVisible}
        footer={null}
        bodyStyle={{ padding: 5 }}
        onCancel={cancleChangeAvatar}
      >
        <ImageEditor
          closed={changeAvatar}
          className="image-editor"
          image={newAvatar}
        ></ImageEditor>
      </Modal>
    </div>
  )
}
