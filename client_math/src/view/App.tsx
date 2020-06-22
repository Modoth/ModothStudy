import React, { useState, useRef } from 'react'
import './App.less'
import { BrowserRouter as Router } from 'react-router-dom'
import { UserContext, useServicesLocator } from '../app/Contexts'
import { Spin, message, Modal, Input, Space } from 'antd'
import LoginService from '../app/LoginService'
import Nav from './pages/Nav'
import NavContent from './pages/NavContent'
import ILoginService, { ILoginUser } from '../app/ILoginService'
import IViewService, { IPromptField } from './services/IViewService'
import ILangsService from '../domain/ILangsService'
import ServicesLocator from '../common/ServicesLocator'
import ImageEditor from './components/ImageEditor'

class ViewService implements IViewService {
  errorKey (langs: ILangsService, key: any, timeout?: number | undefined): void {
    this.error(langs.get(key), timeout)
  }

  error (msg: string, timeout: number = 1000): void {
    message.error(msg, timeout / 1000)
  }

  constructor (public setLoading: any, public prompt: any) {}
}

export default function App () {
  const locator = useServicesLocator() as ServicesLocator

  const loginService: LoginService = (locator.locate(
    ILoginService
  ) as any) as LoginService
  const [user, setUser] = useState<ILoginUser | undefined>(loginService.user)
  loginService.setUser = setUser

  const refFile = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalImageField, setModalImageField] = useState(false)
  const [modalFileFieldData, setModalFileFieldData] = useState<
    Blob | undefined
  >(undefined)
  const [modalFields, setModalFileds] = useState<IPromptField<any, any>[]>([])
  const [onModalOk, setOnModalOk] = useState<{
    onOk(...p: any): Promise<boolean | undefined>;
  }>()

  const updateField = (
    i: number,
    field: IPromptField<any, any>,
    value: any
  ) => {
    modalFields.splice(i, 1, Object.assign({}, field, { value }))
    setModalFileds([...modalFields])
  }

  const applyModal = async () => {
    if (await onModalOk!.onOk(...modalFields.map((f) => f.value))) {
      cancleModal()
    }
  }

  const cancleModal = () => {
    refFile.current!.onchange = null
    refFile.current!.value = ''
    setModalTitle('')
    setModalVisible(false)
    setModalFileds([])
    setOnModalOk(undefined)
    setModalImageField(false)
    setModalFileFieldData(undefined)
  }

  const viewService = new ViewService(
    setLoading,
    (
      title: string,
      fields: IPromptField<any, any>[],
      onOk: (...paras: any) => Promise<boolean | undefined>
    ): void => {
      const imageField = fields.length === 1 && fields[0].type === 'Image'
      const textFileField =
        fields.length === 1 && fields[0].type === 'TextFile'
      const videoFileField = fields.length === 1 && fields[0].type === 'Video'
      const fileField = imageField || textFileField || videoFileField
      const setStates = () => {
        setModalTitle(title)
        setModalFileds(fields)
        setOnModalOk({ onOk })
        setModalVisible(true)
        setModalImageField(imageField)
        setModalFileFieldData(undefined)
      }
      if (!fileField) {
        setStates()
      } else {
        let accept = '*/*'
        let onchange: (file: File) => void
        if (imageField) {
          accept = 'image/*'
          onchange = (file) => {
            setStates()
            setModalFileFieldData(file)
          }
        } else if (textFileField) {
          accept = 'text/*'
          onchange = (file) => {
            const reader = new FileReader()
            reader.onload = () => {
              setStates()
              setModalFileds([{ ...fields[0], value: reader.result }])
            }
            reader.readAsText(file)
          }
        } else if (videoFileField) {
          accept = 'video/*'
          onchange = (file) => {
            onOk(file)
          }
        }
        refFile.current!.accept = fields[0].accept || accept
        refFile.current!.onchange = (e: any) => {
          const file = e.target.files && e.target.files![0]
          if (!file) {
            return
          }
          onchange && onchange(file)
        }
        refFile.current!.click()
      }
    }
  )
  locator.registerInstance(IViewService, viewService)

  return (
    <>
      <UserContext.Provider value={user}>
        <Spin spinning={loading} size="large">
          <Router>
            <Nav></Nav>
            <div className="nav-content-wrapper">
              <NavContent></NavContent>
            </div>
          </Router>
        </Spin>
      </UserContext.Provider>
      <input type="file" className="hidden" ref={refFile}></input>
      <Modal
        title={modalTitle}
        visible={modalVisible}
        onOk={applyModal}
        onCancel={cancleModal}
        footer={modalImageField ? null : undefined}
        bodyStyle={
          modalFields.length
            ? modalImageField
              ? { padding: 5 }
              : {}
            : { display: 'None' }
        }
      >
        <Space direction="vertical" className="modal-fields">
          {modalFields.map((field, i) => {
            switch (field.type) {
              case 'Text':
                return (
                  <Input
                    suffix={field.icon}
                    key={i}
                    value={field.value}
                    onChange={(e) => updateField(i, field, e.target.value)}
                    placeholder={field.hint}
                  ></Input>
                )
              case 'Password':
                return (
                  <Input.Password
                    suffix={field.icon}
                    key={i}
                    value={field.value}
                    onChange={(e) => updateField(i, field, e.target.value)}
                    placeholder={field.hint}
                  ></Input.Password>
                )
              case 'Image':
                return (
                  <ImageEditor
                    closed={(image) => {
                      updateField(i, field, image)
                      applyModal()
                    }}
                    image={modalFileFieldData}
                  ></ImageEditor>
                )
              case 'TextFile':
                return <textarea rows={10} value={field.value}></textarea>
              default:
                return <span key={i}>{field.value}</span>
            }
          })}
        </Space>
      </Modal>
    </>
  )
}