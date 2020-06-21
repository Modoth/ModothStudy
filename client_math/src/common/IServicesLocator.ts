export default class IServicesLocator {
  constructor () {
    throw new Error('Method not implemented.')
  }

  locate<TS> (ctor : {new():TS}): TS & IServicesLocator {
    throw new Error('Method not implemented.')
  }
}
