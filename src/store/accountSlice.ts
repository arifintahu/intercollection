import { createSlice } from '@reduxjs/toolkit'
import { AppState } from './index'
import { HYDRATE } from 'next-redux-wrapper'

// Type for our state
export interface AccountState {
  address: string
}

// Initial state
const initialState: AccountState = {
  address: '',
}

// Actual Slice
export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAddress(state, action) {
      state.address = action.payload
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.account,
      }
    },
  },
})

export const { setAddress } = accountSlice.actions
export const selectAddress = (state: AppState) => state.account.address

export default accountSlice.reducer
