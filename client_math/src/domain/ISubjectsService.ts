import Subject from './Subject'

export default class ISubjectsService implements ISubjectsService {
  all (): Promise<Subject[]> {
    throw new Error('Method not implemented.')
  }

  add (name: string, parent?: Subject | undefined): Promise<Subject> {
    throw new Error('Method not implemented.')
  }

  delete (subject: Subject): Promise<void> {
    throw new Error('Method not implemented.')
  }

  rename (name: string, subject: Subject): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
