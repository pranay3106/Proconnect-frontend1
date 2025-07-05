import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import {
  getAboutUser,
  getAllUsers,
} from "@/config/redux/action/authAction";

import {
  createPost,
  deletePost,
  getAllComments,
  getAllPosts,
  incrementPostLike,
  postComment,
} from "@/config/redux/action/postAction";

import { setTokenThere } from "@/config/redux/reducer/authReducer";
import { resetPostId } from "@/config/redux/reducer/postReducer";

import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/Dashboard";
import styles from "./index.module.css";
import { Base_Url } from "@/config";

const DEFAULT_PROFILE_PIC =
  "https://res.cloudinary.com/duvlhhzaq/image/upload/v1751558256/default_mkj0mm.jpg";

export default function Dashboard() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.postReducer);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [commentText, setCommentText] = useState("");

  // Fetch user and posts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setTokenThere());
      dispatch(getAboutUser({ token }));
      dispatch(getAllPosts());
      dispatch(getAllUsers());
    }
  }, [dispatch]);

  // Preview uploaded file
  useEffect(() => {
    if (!fileContent) return setPreviewUrl(null);
    const objectUrl = URL.createObjectURL(fileContent);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [fileContent]);

  const handleUpload = async () => {
    console.log("Uploading post. postContent:", postContent, typeof postContent);
    console.log("Uploading post. fileContent:", fileContent);

    if (!postContent.trim() && !fileContent) return;

    const formData = new FormData();
    formData.append("body", postContent || "");
    formData.append("token", localStorage.getItem("token"));
    if (fileContent) formData.append("media", fileContent);

    const result = await dispatch(createPost(formData));
    console.log("Post uploaded, response payload:", result?.payload);
    if (result?.payload?.media) {
      console.log("Uploaded media filename:", result.payload.media);
      console.log("Full media URL:", `${Base_Url}/uploads/${result.payload.media}`);
    }

    setPostContent("");
    setFileContent(null);
    setPreviewUrl(null);
    dispatch(getAllPosts());
  };

  const getProfileImageUrl = (user) => {
    if (!user) return DEFAULT_PROFILE_PIC;
    const pic = typeof user === "string" ? user : user.profilePicture;
    // {console.log("thisss:",user)}
    return pic?.startsWith("http") ? pic : `${Base_Url}/uploads/${pic|| ""}`;
  };
 

  const getPostMediaUrl = (media) =>
    media?.trim() || null;

  if (!authState.user?.userId) {
    return (
      <UserLayout>
        <DashboardLayout>
          <h2>Loading...</h2>
        </DashboardLayout>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollComponenet}>
          <div className={styles.Wrapper}>
            {/* Create Post */}
            <div className={styles.createPostContainer}>
              <img
                className={styles.userProfile}
                src={getProfileImageUrl(authState.user?.userId?.profilePicture)}
                alt="Your Profile"
              />
              <textarea
                className={styles.textAreaContent}
                placeholder="What's in your mind"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />

              {previewUrl && (
                <div className={styles.mediaPreview}>
                  {fileContent.type.startsWith("video/") ? (
                    <video src={previewUrl} controls width={150} />
                  ) : (
                    <img src={previewUrl} alt="Preview" width={150} />
                  )}
                </div>
              )}

              <label htmlFor="fileUpload">
                <div className={styles.fab}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 4.5v15m7.5-7.5h-15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </label>
              <input
                id="fileUpload"
                type="file"
                hidden
                accept="image/*,video/*"
                onChange={(e) => setFileContent(e.target.files?.[0])}
              />

              {(postContent.trim() || fileContent) && (
                <div onClick={handleUpload} className={styles.uploadButton}>
                  Post
                </div>
              )}
            </div>

            {/* Post List */}
            <div className={styles.postsContainer}>
              {postState.posts.map((post) => {
                console.log("Rendering post:", post._id);
                console.log("Post media field:", post.media);

                const mediaUrl = getPostMediaUrl(post.media);
                console.log("Constructed mediaUrl:", mediaUrl);

                const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl || "");

                return (
                  <div key={post._id} className={styles.singleCard}>
                    <div className={styles.singleCard_profileContainer}>
                      <img
                        className={styles.userProfile}
                        src={getProfileImageUrl(post.userId)}
                        alt="User Profile"
                      />
                      <div>
                        <div
                          style={{ display: "flex", justifyContent: "space-between" }}
                        >
                          <p style={{ fontWeight: "bold" }}>{post.userId?.name}</p>
                          {post.userId?._id === authState.user.userId._id && (
                            <div
                              style={{ cursor: "pointer", color: "red" }}
                              onClick={async () => {
                                await dispatch(deletePost({ post_id: post._id }));
                                dispatch(getAllPosts());
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                width="20"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M6 6h12M9 6V4h6v2M10 11v6m4-6v6M4 6h16l-1 14H5L4 6z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p style={{ color: "gray" }}>@{post.userId?.username}</p>
                        <p>{post.body}</p>
                        {console.log(post)}
                        

                        {mediaUrl && (
                          <div className={styles.singleCard_img}>
                            {isVideo ? (
                              <video src={mediaUrl} controls width={300} />
                            ) : (
                              <img src={mediaUrl} alt="Post Media" width={300} />
                            )}
                          </div>
                        )}

                        <div className={styles.optionsContainer}>
                          <div
                            className={styles.singleOption_optionsContainer}
                            onClick={async () => {
                              await dispatch(incrementPostLike({ post_id: post._id }));
                              dispatch(getAllPosts());
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              width="20"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                            <p>{post.likes}</p>
                          </div>

                          <div
                            className={styles.singleOption_optionsContainer}
                            onClick={() => dispatch(getAllComments({ post_id: post._id }))}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              width="20"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M7 8h10M7 12h4"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {postState.postId && (
          <div
            onClick={() => dispatch(resetPostId())}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.allCommentsContainer}
            >
              {postState.comments.length === 0 ? (
                <h3>No comments yet.</h3>
                
              ) : (
                postState.comments.map((comment) => (
                  
                  <div key={comment._id} className={styles.singleComment}>
                    {console.log("comment",comment)}
                    <img
                      src={getProfileImageUrl(comment.userId)}
                      alt="Commenter"
                      className={styles.singleComment_profileContainer}
                    />
                    <div>
                      <p style={{ fontWeight: "bold" }}>
                        @{comment.userId?.username}
                      </p>
                      <p>{comment.body}</p>
                    </div>
                  </div>
                ))
              )}
              <div className={styles.postCommentContainer}>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                />
                <div
                  className={styles.postComment_ContainerBtn}
                  onClick={async () => {
                    await dispatch(
                      postComment({ post_id: postState.postId, body: commentText })
                    );
                    dispatch(getAllComments({ post_id: postState.postId }));
                    setCommentText("");
                  }}
                >
                  <p>Comment</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
