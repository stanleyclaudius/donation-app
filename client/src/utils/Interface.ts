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

export interface IFundraiserCampaignState {
  data: ICampaign[]
  total_page: number
}

export interface ICampaign {
  id: number
  type: string
  type_id: number
  fundraiser_name: string
  fundraiser_phone: string
  fundraiser_address: string
  fundraiser_description: string
  title: string
  description: string
  image: string
  collected_amount: number
  target_amount: number
  withdrawn_amount: number
  slug: string
  created_at: string
}

export interface IGetFundraiserCampaignsData {
  access_token: string
  page: number
}

export interface ICreateCampaignData {
  title: string
  type: number
  target_amount: number
  description: string
  image: File
  access_token: string
}

export interface IDeleteCampaignData {
  id: number
  access_token: string
}

export interface IUpdateFundraiserCampaignData {
  id: number
  title: string
  type: number
  target_amount: number
  description: string
  image: File | string
  access_token: string
}

export interface ICampaignDetailState {
  data: ICampaign | undefined,
  donations: IDonation[]
  withdraws: IWithdraw[]
}

export interface IDonation {
  id: number
  avatar: string
  name: string
  amount: number
  words: string
  is_anonymous: boolean
  created_at: string
}

export interface ICreateDonationData {
  campaign_id: number
  amount: number
  words: string
  is_anonymous: boolean
  auth: IAuthState
}

export interface ICreateWithdrawData {
  amount: number
  campaign_id: number
  access_token: string
}

export interface IWithdraw {
  amount: number
  created_at: string
}

export interface IFundraiserVerificationState {
  data: IFundraiser[]
  total_page: number
}

export interface IFundraiser {
  id: number
  user_id: number
  name: string
  avatar: string
  email: string
  phone: string
  address: string
  description: string
  created_at: string
}


export interface IGetFundraiserData {
  access_token: string
  page: number
}

export interface IChangeFundraiserStatusData {
  id: number
  access_token: string
}