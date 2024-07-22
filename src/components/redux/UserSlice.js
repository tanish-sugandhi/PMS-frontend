import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value:null,
    userData: []

}

const UserSlice = createSlice({
    name:'currentUser',
    initialState,
    reducers: {
        setCurrentUser(state, action){
            state.value = action.payload;
        },
        setUserData(state, action){
            state.userData = action.payload;
        },
        addUserdata(state,action){
            state.userData.push(action.payload);
        }
    }
})

export const { setCurrentUser,setUserData,addUserdata } = UserSlice.actions;
export default UserSlice.reducer;
