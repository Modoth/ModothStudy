import React, { useState, useEffect } from 'react'
import './ManageSubjects.less'
import { useUser, useServicesLocator } from '../../app/Contexts'
import { Redirect } from 'react-router-dom'
import { Configs } from '../../apis'
import { Button, Table } from 'antd'
import {
  DeleteFilled,
  UploadOutlined,
  SisternodeOutlined,
  SubnodeOutlined
} from '@ant-design/icons'
import Subject from '../../domain/Subject'
import ISubjectsService from '../../domain/ISubjectsService'
import ILangsService from '../../domain/ILangsService'
import IViewService from '../services/IViewService'

const importTo = async (service: ISubjectsService, data: any[]) => {
  const addSubject = async (
    s: { title: string; children: any[] },
    parent?: Subject
  ) => {
    const subject = await service.add(s.title, parent)
    if (s.children) {
      for (const c of s.children) {
        await addSubject(c, subject)
      }
    }
  }
  for (const s of data) {
    await addSubject(s)
  }
}

export function ManageSubjects () {
  const user = useUser()
  if (!user || !user.managePermission) {
    return <Redirect to="/login" />
  }
  const locator = useServicesLocator()
  const langs = locator.locate(ILangsService)
  const viewService = locator.locate(IViewService)
  const [subjects, setSubjects] = useState<Subject[]>([])

  const fetchSubjects = async () => {
    const service: ISubjectsService = locator.locate(ISubjectsService)
    try {
      setSubjects(await service.all())
    } catch (e) {
      viewService!.errorKey(langs, e.message)
    }
  }

  const importSubjects = async () => {
    const service: ISubjectsService = locator.locate(ISubjectsService)
    try {
      await importTo(service, [])
    } catch (e) {
      viewService!.errorKey(langs, e.message)
    }
    await fetchSubjects()
  }

  const updateSubjectAncestors = (subject: Subject) => {
    while (true) {
      if (subject.parent) {
        const idx = subject.parent.children!.indexOf(subject)
        subject.parent.children!.splice(idx, 1, { ...subject })
        subject.parent.children = [...subject.parent.children!]
        subject = subject.parent!
      } else {
        subjects.splice(subjects.indexOf(subject), 1, { ...subject })
        break
      }
    }
  }

  const deleteSubject = (subject: Subject) => {
    viewService.prompt(langs.get(Configs.UiLangsEnum.Delete), [], async () => {
      const service: ISubjectsService = locator.locate(ISubjectsService)
      try {
        await service.delete(subject)
      } catch (e) {
        viewService!.errorKey(langs, e.message)
        return
      }
      if (subject.parent) {
        const idx = subject.parent.children!.indexOf(subject)
        subject.parent.children!.splice(idx, 1)
        subject.parent.children = [...subject.parent.children!]
        updateSubjectAncestors(subject.parent)
      } else {
        const idx = subjects!.indexOf(subject)
        subjects!.splice(idx, 1)
      }
      setSubjects([...subjects!])
      return true
    })
  }

  const addSubject = (parent?: Subject) => {
    viewService.prompt(
      langs.get(Configs.UiLangsEnum.Create),
      [{ type: 'Text', value: '', hint: langs.get(Configs.UiLangsEnum.Name) }],
      async (name: string) => {
        const service: ISubjectsService = locator.locate(ISubjectsService)
        let subject: Subject
        try {
          subject = await service.add(name, parent)
        } catch (e) {
          viewService!.errorKey(langs, e.message)
          return
        }
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(subject)
          updateSubjectAncestors(subject.parent!)
        } else {
          subjects.push(subject)
        }
        setSubjects([...subjects!])
        return true
      }
    )
  }

  const updateSubjectName = (subject: Subject) => {
    viewService.prompt(
      langs.get(Configs.UiLangsEnum.Delete),
      [
        {
          type: 'Text',
          value: subject.name,
          hint: langs.get(Configs.UiLangsEnum.Name)
        }
      ],
      async (newName: string) => {
        if (!newName) {
          return
        }
        const service: ISubjectsService = locator.locate(ISubjectsService)
        try {
          await service.rename(newName, subject)
        } catch (e) {
          viewService!.errorKey(langs, e.message)
          return
        }
        subject.name = newName
        if (subject.parent) {
          updateSubjectAncestors(subject)
        } else {
          const idx = subjects!.indexOf(subject)
          subjects!.splice(idx, 1, { ...subject })
        }
        setSubjects([...subjects!])
        return true
      }
    )
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  const renderName = (_: string, subject: Subject) => {
    return (
      <span onClick={() => updateSubjectName(subject)}>{subject.name}</span>
    )
  }
  const renderCreate = (_: string, subject: Subject) => {
    return (
      <Button
        type="link"
        onClick={() => addSubject(subject)}
        icon={<SubnodeOutlined />}
      />
    )
  }
  const renderDelete = (_: string, subject: Subject) => {
    return (
      <Button
        type="link"
        onClick={() => deleteSubject(subject)}
        danger
        icon={<DeleteFilled />}
      ></Button>
    )
  }
  return (
    <div className="manage-subjects">
      <Table
        rowKey="name"
        columns={[
          {
            dataIndex: 'name',
            key: 'name',
            render: renderName
          },
          {
            key: 'create',
            className: 'subject-create-column',
            render: renderCreate
          },
          {
            key: 'delete',
            className: 'subject-delete-column',
            render: renderDelete
          }
        ]}
        dataSource={subjects}
        pagination={false}
      ></Table>
      <Button
        icon={<SisternodeOutlined />}
        onClick={() => addSubject()}
        className="btn-create"
        type="primary"
      >
        {langs.get(Configs.UiLangsEnum.Create)}
      </Button>
      {/* {
      subjects.length ? null
        : <Button icon={<UploadOutlined />} className="btn-import" type="dashed" onClick={importSubjects}>{langs.get(Configs.UiLangsEnum.Import)}</Button>
    } */}
    </div>
  )
}
