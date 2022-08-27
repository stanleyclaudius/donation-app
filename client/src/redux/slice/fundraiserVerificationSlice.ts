import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { deleteDataAPI, getDataAPI, patchDataAPI } from './../../utils/fetchData'
import { IChangeFundraiserStatusData, IFundraiserVerificationState, IGetFundraiserData } from './../../utils/Interface'
import { RootState } from './../store'

const initialState: IFundraiserVerificationState = {
  data: [],
  total_page: 1
}

export const getFundraiser = createAsyncThunk(
  'fundraiser_verification/get',
  async(data: IGetFundraiserData, thunkAPI) => {
    try {
      const res = await getDataAPI(`fundraiser?page=${data.page}&limit=10`, data.access_token)

      return {
        data: res.data.fundraisers,
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

export const acceptFundraiser = createAsyncThunk(
  'fundraiser_verification/accept',
  async(data: IChangeFundraiserStatusData, thunkAPI) => {
    const state = (thunkAPI.getState() as RootState).fundraiser_verification

    try {
      const res = await patchDataAPI(`fundraiser/status/${data.id}`, { is_active: true }, data.access_token)
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

export const rejectFundraiser = createAsyncThunk(
  'fundraiser_verification/reject',
  async(data: IChangeFundraiserStatusData, thunkAPI) => {
    const state = (thunkAPI.getState() as RootState).fundraiser_verification

    try {
      const res = await deleteDataAPI(`fundraiser/${data.id}`, data.access_token)

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

const fundraiserVerificationSlice = createSlice({
  name: 'fundraiser_verification',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        (action) => {
          return action.type.startsWith('fundraiser_verification/') && action.type.endsWith('/fulfilled')
        },
        (_, action) => {
          return action.payload
        }
      )
  }
})

export default fundraiserVerificationSlice.reducer