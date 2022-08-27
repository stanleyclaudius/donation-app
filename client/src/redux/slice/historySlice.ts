import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getDataAPI } from '../../utils/fetchData'
import { IGetHistoryData, IHistoryState } from './../../utils/Interface'

const initialState: IHistoryState = {
  data: [],
  total_page: 1
}

export const getHistory = createAsyncThunk(
  'history/get',
  async(data: IGetHistoryData, thunkAPI) => {
    try {
      const res = await getDataAPI(`donation?page=${data.page}&limit=6`, data.access_token)

      return {
        data: res.data.donations,
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

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        (action) => {
          return action.type.startsWith('history/') && action.type.endsWith('/fulfilled')
        },
        (_, action) => {
          return action.payload
        }
      )
  }
})

export default historySlice.reducer