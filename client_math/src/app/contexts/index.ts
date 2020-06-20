import React, { useContext } from 'react'
import LangsService from '../../domain/LangsService'
import INotifyService from '../INotifyService'
import ILoginService, { ILoginUser } from '../ILoginService'
export const LangsContext = React.createContext(new LangsService())
export const useLangs = () => useContext(LangsContext)

export const UserContext = React.createContext<ILoginUser|undefined>(undefined)
export const useUser = () => useContext(UserContext)

export const LoginContext = React.createContext<ILoginService|undefined>(undefined)
export const useLogin = () => useContext(LoginContext)

export const NotifyContext = React.createContext<INotifyService|undefined>(undefined)
export const useNotify = () => useContext(NotifyContext)
