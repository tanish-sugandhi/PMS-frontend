import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value:null
}

const TokenSlice = createSlice({
    name:'token',
    initialState,
    reducers: {
        setTokenSlice(state, action){
            state.value = action.payload;
        }
    }
})

export const { setTokenSlice } = TokenSlice.actions;
export default TokenSlice.reducer;