import { createSlice } from "@reduxjs/toolkit";
// import { connection } from "next/server";
import { getAboutUser, getAllUsers, getConnectionRequest, getMyConnectonRequests, loginUser,registerUser } from "../../action/authAction/index";
import { getAllPosts } from "../../action/postAction";

//second step in state management
const initialState = {
 user:undefined,
 isError: false,
    isSuccess: false,
    isLoading: false,
    isLoggedIn:false,
    message: "",
    profilefetched: false,
    connections: [],
    connectionRequests: [],
    isTokenThere:false,
    allUsers:[], //changed all_users
    all_profiles_fetched:false

};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: ()=> 

            initialState,
            handleLoginUSer: (state) => {
            state.message = "Hello";
        },  
        emptyMessage: (state) => {
            state.message = "";
        },
        setTokenThere : (state)=>{
              state.isTokenThere = true     

        },
        setTokenNotThere:(state)=>{
           state.isTokenThere = false   

        }

    },
        
        

        extraReducers: (builder) => {
            builder
                .addCase(loginUser.pending, (state) => {
                    state.isLoading = true;
                    state.message="knoking on the door"
                })
                .addCase(loginUser.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.isSuccess = true;
                    state.isLoggedIn=true;
                    state.isError=false;
                    // state.user = action.payload;
                    state.message = "login is succesfully";
                })
                .addCase(loginUser.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                   state.message =
      typeof action.payload === "string"
        ? action.payload
        : (action.payload?.message || "Login failed. Please try again.");
})
                
                .addCase(registerUser.pending,(state)=>{
                    state.isLoading = true,
                    state.isError = false;
                    state.isSuccess = false;    
                    state.isLoggedIn = false;
                    state.message="registering you.."
                }

                )
                .addCase(registerUser.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.isSuccess = true;
                    state.isLoggedIn = true;    
                    state.isError = false;
                    state.user = action.payload.user;
                    state.message = "Registration successful";
                    
                })
                .addCase(registerUser.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.isSuccess = false;
                    state.isLoggedIn = false;
                    state.message = typeof action.payload === "string"
                    ? action.payload: (action.payload?.message || "Registration failed. Please try again.");


                })
                .addCase(getAboutUser.fulfilled,(state,action)=>{
                    // console.log("getAboutUser payload:", action.payload);
                    state.isLoading=false;
                    state.isError = false;;
                    state.profilefetched=true;
                    state.user=action.payload;
                    state.connections=action.payload.connections;
                    state.connectionRequests=action.payload.connectionRequests



                })
                .addCase(getAboutUser.rejected, (state, action) => {
                state.profilefetched = false;
                  })
                .addCase(getAllUsers.fulfilled,(state,action)=>{
                    state.isLoading=false;
                    state.isError=false;
                    state.allUsers = action.payload.profiles;
                    state.all_profiles_fetched=true;

                })
                .addCase(getConnectionRequest.fulfilled,(state,action)=>{
                    state.connections=action.payload;

                })
                .addCase(getConnectionRequest.rejected,(state,action)=>{
                    state.message= action.payload

                })
                .addCase(getMyConnectonRequests.fulfilled,(state,action)=>{
                    state.connectionRequests= action.payload

                })

                .addCase(getMyConnectonRequests.rejected,(state,action)=>{
                    state.message= action.payload

                })
        },
    },

)
export const { reset, handleLoginUSer,emptyMessage,setTokenThere,setTokenNotThere } = authSlice.actions;
export default authSlice.reducer;

