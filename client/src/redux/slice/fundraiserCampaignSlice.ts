import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from '../../utils/fetchData'
import { uploadImage } from '../../utils/imageHelper'
import { ICreateCampaignData, IDeleteCampaignData, IFundraiserCampaignState, IGetFundraiserCampaignsData, IUpdateFundraiserCampaignData } from '../../utils/Interface'
import { RootState } from '../store'

const initialState: IFundraiserCampaignState = {
  data: [],
  total_page: 1
}

export const createCampaign = createAsyncThunk(
  'fundraiser_campaign/create',
  async(data: ICreateCampaignData, thunkAPI) => {
    const state = (thunkAPI.getState() as RootState).fundraiser_campaign

    try {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          loading: true
        }
      })

      const image = await uploadImage(data.image, 'campaign')
      
      const res = await postDataAPI('campaign', { ...data, target_amount: Number(data.target_amount), type_id: Number(data.type), image }, data.access_token)
      
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: 'Campaign has been created successfully.'
        }
      })

      return {
        ...state,
        data: [{ ...res.data.campaign, type: res.data.type, type_id: res.data.type_id }, ...state.data]
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

export const getFundraiserCampaigns = createAsyncThunk(
  'fundraiser_campaign/get',
  async(data: IGetFundraiserCampaignsData, thunkAPI) => {
    const state = (thunkAPI.getState() as RootState).fundraiser_campaign

    try {
      const res = await getDataAPI(`campaign/fundraiser?page=${data.page}&limit=10`, data.access_token)

      return {
        ...state,
        data: res.data.campaigns,
        total_page: res.data.total_page
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

export const deleteCampaign = createAsyncThunk(
  'fundraiser_campaign/delete',
  async(data: IDeleteCampaignData, thunkAPI) => {
    const state = (thunkAPI.getState() as RootState).fundraiser_campaign

    try {
      const res = await deleteDataAPI(`campaign/${data.id}`, data.access_token)
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.message
        }
      })

      return {
        ...state,
        data: state.data.filter(item => item.id !== data.id)
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

export const updateCampaign = createAsyncThunk(
  'fundraiser_campaign/update',
  async(data: IUpdateFundraiserCampaignData, thunkAPI) => {
    const state = (thunkAPI.getState() as RootState).fundraiser_campaign

    try {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          loading: true
        }
      })

      let image = ''

      if (typeof data.image !== 'string') {
        image = await uploadImage((data.image) as File, 'campaign')
      }

      const res = await patchDataAPI(`campaign/${data.id}`, { ...data, target_amount: Number(data.target_amount), type_id: Number(data.type), image: image ? image : data.image }, data.access_token)
      
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: 'Campaign has been updated successfully.'
        }
      })

      return {
        ...state,
        data: state.data.map(item => item.id === data.id ? { ...res.data.campaign, type: res.data.type, type_id: res.data.type_id } : item)
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

const fundraiserCampaignSlice = createSlice({
  name: 'fundraiser_campaign',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        (action) => {
          return action.type.startsWith('fundraiser_campaign/') && action.type.endsWith('/fulfilled')
        },
        (_, action) => {
          return action.payload
        }
      )
  }
})

export default fundraiserCampaignSlice.reducer