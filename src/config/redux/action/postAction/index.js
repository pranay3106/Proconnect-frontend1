import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
// import { TelemetryPlugin } from "next/dist/build/webpack/plugins/telemetry-plugin/telemetry-plugin";


export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async(_,thunkAPI) => {
        try {
            const response = await clientServer.get("/posts");

            return thunkAPI.fulfillWithValue(response.data);

            // return data;
        } catch (error) {
            return thunkAPI.rejectWithValue({ message: error.message });
        }
    }
);



export const createPost = (formData) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem("token")
    // formData.append("token",token);
//   for (let [key, value] of formData.entries()) {
//   console.log(key, value);  // Should show token, body, and media
// }

    const res = await clientServer.post("/post", formData); // ✅ Don't set headers manually
    
    dispatch({ type: "CREATE_POST_SUCCESS", payload: res.data });
    return { payload: res.data };
  } catch (err) {
    console.error("Create post failed:", err);
    return { error: err.response?.data?.message || "Failed to create post" };
  }
};



export const deletePost = createAsyncThunk(
    "post/deletePost",
    async(post_id,thunkAPI)=>{
        try{
            const response = await clientServer.delete("/delete_post",{
                data:{
                    token:localStorage.getItem("token"),
                    post_id:post_id.post_id

                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
        return thunkAPI.fulfillWithValue("Something went wrong")
    }
    }
)

export const incrementPostLike = createAsyncThunk(
    "post/incrementLike",
    async(post,thunkAPI)=>{

        try{
            const response = await clientServer.post("/increment_post_likes",{
                post_id:post.post_id
            })
            return thunkAPI.fulfillWithValue(response.data)
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message)
        }

    }
)

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      console.log("Fetching comments for:", postData.post_id, token);

      const response = await clientServer.get("/get_comments", {
        params: {
          post_id: postData.post_id,
          token:token,
        },
        // headers: {
        //   Authorization: `Bearer ${token}` // ✅ if backend requires auth/
        // }
      });
    //   console.log("post_id:", postData.post_id);


      return thunkAPI.fulfillWithValue({
        post_id: postData.post_id,  
        comments: response.data.comments || []
      });

    } catch (err) {
      console.error("getAllComments error:", err); // 🔍 log for dev
      return thunkAPI.rejectWithValue({ message: err.message });
    }
  }
);

    

export const postComment = createAsyncThunk(
    "post/postcomment",async(commentData,thunkAPI) =>{
    try{


        console.log({
            post_id:commentData.post_id,
            body:commentData.body
        })
        const response = await clientServer.post("/comment",{
            
         token:localStorage.getItem("token"),
         post_id:commentData.post_id,
         commentBody:commentData.body,
            
        }

        )
      console.log("comment data",response.data)
        return thunkAPI.fulfillWithValue(response.data)


    }
    catch(err){
            return rejectWithValue("something went wrong")
        }
    }
    )