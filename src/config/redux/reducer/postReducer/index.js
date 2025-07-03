import { reset,reducer } from "../authReducer";
import { createSlice } from "@reduxjs/toolkit";
import { getAllComments, getAllPosts } from "../../action/postAction";





const initialState = {
    posts: [],
    isLoading: false,
    isError: false,
    message: "",
    postFetched: false,
    loggedIn: false,
    comments: [],
    postId: "",
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers:{
        reset: () => initialState,
        resetPostId: (state) => {
            state.postId = ""
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true;
                state.message = "Fetching posts...";
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload.posts.reverse();
                state.postFetched = true;
                state.isError = false;
                state.message = "Posts fetched successfully.";
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message || "Failed to fetch posts.";
            })
            .addCase(getAllComments.fulfilled,(state,action)=>{
                state.postId=action.payload.post_id;//.post_id if req
                state.comments =action.payload.comments;
            })
    },
});

export default postSlice.reducer;
export const { resetPostId } = postSlice.actions;
