import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./UserSlice";
import tokenSlice from "./TokenSlice";
import authReducer from './AuthSlice';
export default configureStore ({
    reducer: {
        currentUser : userSlice,
        token : tokenSlice,
        auth: authReducer
    }
})