import { NodeItem, Condition, Query, NodesApi } from '../apis'
import Subject from './Subject'
import ISubjectsService from './ISubjectsService'
import { rewindRun } from '../common/ApiService'

const createSubject = (node:NodeItem) => {
  const sbj = new Subject()
  sbj.id = node.id!
  sbj.name = node.name!
  return sbj
}

const rootPath = '/adm'

const buildSubjects = (nodes: NodeItem[]) => {
  const subjects = new Map<string, [Subject, string|undefined]>()
  const rootSubjects : Subject[] = []
  for (const n of nodes) {
    const sbj = createSubject(n)
    const ppath = n.path?.slice(0, n.path.lastIndexOf('/'))
    subjects.set(n.path!, [sbj, ppath])
  }
  subjects.forEach(([sbj, ppath]) => {
    if (!ppath) {
      return
    }
    if (ppath !== rootPath) {
      sbj.parent = subjects.get(ppath)![0]
      sbj.parent.children = sbj.parent.children || []
      sbj.parent.children.push(sbj)
    } else {
      rootSubjects.push(sbj)
    }
  })

  return rootSubjects
}

const cloneSubject = (subject: Subject, parent?: Subject) => {
  const n = new Subject()
  n.id = subject.id
  n.name = subject.name
  n.parent = parent
  if (subject.children) {
    n.children = subject.children.map(c => cloneSubject(c, n))
  }

  return n
}

export default class SubjectsService implements ISubjectsService {
      private query : Query
      constructor () {
        this.query = {
          parent: rootPath,
          where: {
            type: Condition.TypeEnum.Equal,
            prop: 'Type',
            value: 'FolderNode'
          }
        }
      }

      async all (): Promise<Subject[]> {
        const api = new NodesApi()
        const nodes = (await rewindRun(() => api.queryNodes(this.query)))?.data!
        return buildSubjects(nodes)
      }

      async add (name: string, parent?: Subject, init?:boolean): Promise<Subject> {
        const api = new NodesApi()
        if (init) {
          const root = (await rewindRun(() => api.queryNodes(this.query, undefined, 0, 1))!)?.data![0]
          if (root) {
            await rewindRun(() => api.updateNodeShared(root.id, true))
          }
        }
        const res = await rewindRun(() => api.createNode(name, 'Folder', parent && parent.id))
        const sbj = createSubject(res!)
        sbj.parent = parent
        return sbj
      }

      async delete (subject: Subject): Promise<void> {
        const api = new NodesApi()
        await rewindRun(() => api.removeNode(subject.id))
      }

      async rename (name: string, subject: Subject): Promise<void> {
        const api = new NodesApi()
        await rewindRun(() => api.rename(subject.id, name))
      }
}
