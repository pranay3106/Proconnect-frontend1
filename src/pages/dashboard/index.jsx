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

  useEffect(() => {
    const token = localStorage.removeItem("token");
    if (token) {
      dispatch(setTokenThere());
      dispatch(getAboutUser({ token }));
      dispatch(getAllPosts());
      dispatch(getAllUsers());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!fileContent) return setPreviewUrl(null);
    const objectUrl = URL.createObjectURL(fileContent);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [fileContent]);

  const handleUpload = async () => {
    if (!postContent.trim() && !fileContent) return;

    const formData = new FormData();
    formData.append("body", postContent || "");
    formData.append("token", localStorage.getItem("token"));
    if (fileContent) formData.append("media", fileContent);

    await dispatch(createPost(formData));
    setPostContent("");
    setFileContent(null);
    setPreviewUrl(null);
    dispatch(getAllPosts());
  };

  const getProfileImageUrl = (user) => {
    if (!user) return DEFAULT_PROFILE_PIC;
    const pic = typeof user === "string" ? user : user.profilePicture;
    return pic?.startsWith("http") ? pic : `${Base_Url}/uploads/${pic || ""}`;
  };

  const getPostMediaUrl = (media) => media?.trim() || null;

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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
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

            <div className={styles.postsContainer}>
              {postState.posts
                .filter((post) => post.userId)
                .map((post) => {
                  const mediaUrl = getPostMediaUrl(post.media);
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
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <p style={{ fontWeight: "bold" }}>
                              {post.userId?.name || "Deleted User"}
                            </p>
                            {post.userId &&
                              post.userId._id === authState.user.userId._id && (
                                <div
                                  style={{
                                    cursor: "pointer",
                                    color: "red",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                  }}
                                  onClick={async () => {
                                    await dispatch(
                                      deletePost({ post_id: post._id })
                                    );
                                    dispatch(getAllPosts());
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    width={20}
                                    height={20}
                                    strokeWidth={1.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M6 6h12M9 6V4h6v2M10 11v6m4-6v6M4 6h16l-1 14H5L4 6z" />
                                  </svg>
                                </div>
                              )}
                          </div>
                          <p style={{ color: "gray" }}>
                            @{post.userId?.username || "deleted"}
                          </p>
                          <p>{post.body}</p>

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
                                await dispatch(
                                  incrementPostLike({ post_id: post._id })
                                );
                                dispatch(getAllPosts());
                              }}
                            >
                              <span>Like</span>
                              <p>{post.likes}</p>
                            </div>

                            <div
                              className={styles.singleOption_optionsContainer}
                              onClick={() =>
                                dispatch(getAllComments({ post_id: post._id }))
                              }
                            >
                              <span>Comments</span>
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

        {postState.postId && (
          <div
            onClick={() => dispatch(resetPostId())}
            className={styles.commentsContainer}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>

            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.allCommentsContainer}
            >
              {postState.comments.length === 0 ? (
                <h3>No comments yet.</h3>
              ) : (
                <div className={styles.commentList}>
                  {postState.comments.map((comment) => (
                    <div key={comment._id} className={styles.singleComment}>
                      <img
                        src={getProfileImageUrl(comment.userId)}
                        alt="Commenter"
                        className={styles.singleComment_profileContainer}
                      />
                      <div>
                        <p style={{ fontWeight: "bold" }}>
                          @{comment.userId?.username || "deleted"}
                        </p>
                        <p>{comment.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
