import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config/index.jsx";

//thunk to redirect  
//*****thunk like promise the fullfill thing gonna store in our store.js

//first step in sate management
export const loginUser = createAsyncThunk(
    "user/login",
    async(user,thunkAPI)=>{

        try{
            const  response = await clientServer.post("/login",{
                email :user.email,
                password : user.password
            })

            if(response.data.token){
    
                localStorage.setItem("token", response.data.token)

                 thunkAPI.dispatch(getAboutUser({ token : response.data.token}));


                  return thunkAPI.fulfillWithValue(
                        {message:"Login successful", token: response.data.token}
            );

            }else{
                return thunkAPI.rejectWithValue(
                   { message:"token not provided"}
                );
            }

           
               
        }catch(err){
            return thunkAPI.rejectWithValue(
                err.response
            );
    }
}
    
);


export const registerUser = createAsyncThunk(
    "user/register",
    async(user, thunkAPI) => {
        try {
            const response = await clientServer.post("/register", {
                email: user.email,
                password: user.password,
                username: user.username,
                name: user.name
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            } else {
                return thunkAPI.rejectWithValue(
                    { message: "Registration failed. Please try again." }
                );
            }

            return thunkAPI.fulfillWithValue(
                { user: response.data.user,
                    token:response.data.token,
                    message:response.data.message
                 }
            );

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response
            );
        }
    }
)

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async(user, thunkAPI) => {
        console.log(user)
        try {
            const response = await clientServer.get("/get_user_and_profile", {
                params:{
                token:user.token 
             } })

            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue({ message: error.message });
        }
    }
);

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async(user,thunkAPI)=>{
        try{
            const response = await clientServer.get("/user/get_all_users")
            console.log(" resss:", response.data)

            return thunkAPI.fulfillWithValue(response.data);

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const sendConnectionrequest = createAsyncThunk(
    "user/sendConnectionRequest",
    async(user,thunkAPI) =>{
        try{
            const response = await clientServer.post("/user/send_connection_request",{
                token:user.token,
                receiverId: user.user_id
            })

            thunkAPI.dispatch(getMyConnectonRequests({token:user.token}))
            console.log("responsefromSendConnection",response)
            return thunkAPI.fulfillWithValue(response.data)
        }
    catch(err){
        return thunkAPI.rejectWithValue({message:err.message})

    }
})

export const getConnectionRequest = createAsyncThunk(
    "/user/getConnectionRequests",
    async(user,thunkAPI)=>{
        try{
            const response = await clientServer.get("/user/getConnectionRequests",{
                params:{
                    token:user.token
                }
            })
        
        return thunkAPI.fulfillWithValue(response.data);
         } catch(err){
        return thunkAPI.rejectWithValue({message:message.err})

    }
}
)


export const getMyConnectonRequests = createAsyncThunk(
    "/user/getMyConnectionRequests",
    async(user,thunkAPI)=>{
        try{
            const response = await clientServer.get("/user/user_connection_request",{
                params:{
                    token:user.token
                }
            })
        
        return thunkAPI.fulfillWithValue(response.data);
         } catch(err){
        return thunkAPI.rejectWithValue({message:err.message})

    }
}
)


export const AcceptConnection = createAsyncThunk(
    "/user/acceptConnectionReq",
    async(user,thunkAPI)=>{
        try{
            const response = await clientServer.post("/user/accept_connection_Request",{
                
                    token:user.token,
                    requestId:user.connectionId, // connection_id: ?
                    action_type : user.action
                }
            )
            thunkAPI.dispatch(getConnectionRequest({token:user.token}))
            thunkAPI.dispatch(getMyConnectonRequests({token:user.token}))

        
        return thunkAPI.fulfillWithValue(response.data);
         } catch(err){
        return thunkAPI.rejectWithValue({message:err.message})

    }
}
)