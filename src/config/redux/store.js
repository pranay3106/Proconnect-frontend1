import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./reducer/authReducer"
import postReducer from "./reducer/postReducer"
// 
// steps for state management
// submit action 
// handle acton in its reducer
// register move -> reducer,means register in store here


export const store = configureStore({
    reducer: {
        auth:authReducer,
        postReducer: postReducer,


        // Add your reducers here
        // e.g., user: userReducer,
    }
  
});