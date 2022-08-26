import { createSlice } from '@reduxjs/toolkit'
import { IAlertState } from './../../utils/Interface.'

const initialState: IAlertState = {}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    alert: (_, action) => {
      return action.payload
    }
  }
})

export default alertSlice.reducer