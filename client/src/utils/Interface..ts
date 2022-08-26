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