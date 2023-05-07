import { createSlice } from '@reduxjs/toolkit'
import { AppState } from './index'
import { HYDRATE } from 'next-redux-wrapper'

// Type for our state
export interface ChainState {
  chainId: string
}

// Initial state
const initialState: ChainState = {
  chainId: '',
}

// Actual Slice
export const chainSlice = createSlice({
  name: 'chain',
  initialState,
  reducers: {
    setChainId(state, action) {
      state.chainId = action.payload
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.chain,
      }
    },
  },
})

export const { setChainId } = chainSlice.actions
export const selectChainId = (state: AppState) => state.chain.chainId

export default chainSlice.reducer
