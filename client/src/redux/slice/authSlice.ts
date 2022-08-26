import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getDataAPI, postDataAPI } from '../../utils/fetchData'
import { IAuthState, ILoginData } from '../../utils/Interface'

const initialState: IAuthState = {}

export const login = createAsyncThunk(
  'auth/login',
  async(data: ILoginData, thunkAPI) => {
    try {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          loading: true
        }
      })

      const res = await postDataAPI('auth/login', data)
      localStorage.setItem('wecare_logged', 'true')

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: `Authenticated as ${res.data.user.name}`
        }
      })

      return {
        access_token: res.data.access_token,
        user: res.data.user
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

export const refreshToken = createAsyncThunk(
  'auth/refresh_token',
  async(_, thunkAPI) => {
    const logged = localStorage.getItem('wecare_logged')
    if (!logged) return

    const res = await getDataAPI('auth/refresh_token')
    return {
      access_token: res.data.access_token,
      user: res.data.user
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async(token: string, thunkAPI) => {
    try {
      const res = await getDataAPI('auth/logout', token)
      localStorage.removeItem('wecare_logged')

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.message
        }
      })

      return {}
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        (action) => {
          return action.type.startsWith('auth/') && action.type.endsWith('/fulfilled')
        },
        (_, action) => {
          return action.payload
        }
      )
  }
})

export default authSlice.reducer