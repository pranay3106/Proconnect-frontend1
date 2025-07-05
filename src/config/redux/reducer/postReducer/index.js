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
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,       // Reset entire post state
    resetPostId: (state) => {
      state.postId = "";              // Reset current postId to empty string
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching all posts
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
        state.message = action.payload?.message || "Failed to fetch posts.";
      })
      // Handle fetching comments for a specific post
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.postId = action.payload.post_id;
        state.comments = action.payload.comments;
      });
  },
});

export const { resetPostId, reset } = postSlice.actions;
export default postSlice.reducer;
