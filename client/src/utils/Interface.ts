import { ChangeEvent, FormEvent } from "react";

export type InputChange = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>

export type FormSubmit = FormEvent<HTMLFormElement>

export interface IAlertState {
  success?: string
  error?: string
  loading?: boolean
}

export interface IAuthState {
  access_token?: string
  user?: IUser
}

export interface IUser extends ILoginData {
  id: number
  name: string
  avatar: string
  role: string
}

export interface ILoginData {
  email: string
  password: string
}

export interface ITypeState {
  data: IType[]
  total_page: number
}

export interface IType {
  id: number
  title: string
  created_at: string
}

export interface ICreateTypeData {
  title: string
  access_token: string
}

export interface IDeleteTypeData {
  id: number
  access_token: string
}

export interface IUpdateTypeData extends ICreateTypeData {
  id: number
}