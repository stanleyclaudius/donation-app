import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import alertSlice from './slice/alertSlice'
import authSlice from './slice/authSlice'
import typeSlice from './slice/typeSlice'
import fundraiserCampaignSlice from './slice/fundraiserCampaignSlice'
import campaignDetailSlice from './slice/campaignDetailSlice'
import fundraiserVerificationSlice from './slice/fundraiserVerificationSlice'
import historySlice from './slice/historySlice'

interface IProps {
  children: ReactNode
}

const store = configureStore({
  reducer: {
    alert: alertSlice,
    auth: authSlice,
    campaign_type: typeSlice,
    fundraiser_campaign: fundraiserCampaignSlice,
    campaign_detail: campaignDetailSlice,
    fundraiser_verification: fundraiserVerificationSlice,
    history: historySlice
  }
})

const ReduxProvider = ({ children }: IProps) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default ReduxProvider

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>