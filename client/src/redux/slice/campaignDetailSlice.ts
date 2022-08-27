import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getDataAPI, postDataAPI } from '../../utils/fetchData'
import { ICampaignDetailState, ICreateDonationData } from '../../utils/Interface'
import { RootState } from '../store'

const initialState: ICampaignDetailState = {
  data: undefined,
  donations: [],
  withdraws: []
}

export const createDonation = createAsyncThunk(
  'campaign_detail/donate',
  async(data: ICreateDonationData, thunkAPI) => {
    const state = (thunkAPI.getState() as RootState).campaign_detail

    try {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          loading: true
        }
      })

      const res = await postDataAPI('donation', { ...data, amount: Number(data.amount) }, data.auth.access_token)
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: 'Successfully donated to currenct campaign. Thank you :)'
        }
      })

      let newDonations = [{ ...res.data.donation, name: data.auth.user?.name, avatar: data.auth.user?.avatar }, ...state.donations]

      if (newDonations.length > 5) {
        newDonations.pop()
      }

      return {
        data: {
          ...state.data,
          collected_amount: Number(state.data!.collected_amount) + Number(data.amount)
        },
        donations: newDonations
      }
    } catch (err: any) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          error: err.response.data.error
        }
      })
    }
  }
)

export const getCampaignDetail = createAsyncThunk(
  'campaign_detail/get',
  async(slug: string, thunkAPI) => {
    try {
      const campaignRes = await getDataAPI(`campaign/${slug}`)
      const donationRes = await getDataAPI(`donation/${campaignRes.data.campaign.id}?page=1&limit=5`)
      const withdrawRes = await getDataAPI(`withdraw/${campaignRes.data.campaign.id}?page=1&limit=5`)

      return {
        data: campaignRes.data.campaign,
        donations: donationRes.data.donations,
        withdraws: withdrawRes.data.withdraws
      }
    } catch (err: any) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          error: err.response.data.error
        }
      })
    }
  }
)

const campaignDetailSlice = createSlice({
  name: 'campaign_detail',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        (action) => {
          return action.type.startsWith('campaign_detail/') && action.type.endsWith('/fulfilled')
        },
        (_, action) => {
          return action.payload
        }
      )
  }
})

export default campaignDetailSlice.reducer