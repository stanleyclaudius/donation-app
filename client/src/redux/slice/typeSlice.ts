import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from '../../utils/fetchData'
import { RootState } from '../store'
import { ICreateTypeData, IDeleteTypeData, ITypeState, IUpdateTypeData } from './../../utils/Interface'

const initialState: ITypeState = {
  data: [],
  total_page: 0,
}

export const createType = createAsyncThunk(
  'campaign_type/create',
  async(data: ICreateTypeData, thunkAPI) => {
    const state = (thunkAPI.getState() as RootState).campaign_type

    try {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          loading: true
        }
      })

      const res = await postDataAPI('type', data, data.access_token)
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: 'Type has been created successfully.'
        }
      })

      return {
        ...state,
        data: [res.data.type, ...state.data]
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

export const getType = createAsyncThunk(
  'campaign_type/get',
  async(page: number, thunkAPI) => {
    const state = (thunkAPI.getState() as RootState).campaign_type

    try {
      const res = await getDataAPI(`type?page=${page}&limit=10`)
      return {
        ...state,
        data: res.data.types,
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

export const deleteType = createAsyncThunk(
  'campaign_type/delete',
  async(data: IDeleteTypeData, thunkAPI) => {
    const state = (thunkAPI.getState() as RootState).campaign_type

    try {
      const res = await deleteDataAPI(`type/${data.id}`, data.access_token)
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

export const updateType = createAsyncThunk(
  'campaign_type/update',
  async(data: IUpdateTypeData, thunkAPI) => {
    const state = (thunkAPI.getState() as RootState).campaign_type

    try {
      const res = await patchDataAPI(`type/${data.id}`, { title: data.title }, data.access_token)
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: 'Campaign type has been update successfully.'
        }
      })

      return {
        ...state,
        data: state.data.map(item => item.id === data.id ? res.data.type : item)
      }
    } catch (err: any) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        error: err.response.data.error
      })
    }
  }
)

const typeSlice = createSlice({
  name: 'campaign_type',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        (action) => {
          return action.type.startsWith('campaign_type/') && action.type.endsWith('/fulfilled')
        },
        (_, action) => {
          return action.payload
        }
      )
  }
})

export default typeSlice.reducer