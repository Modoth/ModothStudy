import { Enum_Request_Method } from './enum.request.method'

export default {
    'Login_UpdateAvatar': {
        url: '/api/Login/UpdateAvatar',
        method: Enum_Request_Method.PUT
    },
    'Files_UploadFile': {
        url: '/api/Files/UploadFile',
        method: Enum_Request_Method.POST
    },
    'Configs_UpdateImageValue': {
        url: '/api/Configs/UpdateImageValue',
        method: Enum_Request_Method.PUT
    }
}