import { RequestMethod } from './RequestMethod'

export default {
  Login_UpdateAvatar: {
    url: '/api/Login/UpdateAvatar',
    method: RequestMethod.PUT
  },
  Files_UploadFile: {
    url: '/api/Files/UploadFile',
    method: RequestMethod.POST
  },
  Configs_UpdateImageValue: {
    url: '/api/Configs/UpdateImageValue',
    method: RequestMethod.PUT
  }
}
