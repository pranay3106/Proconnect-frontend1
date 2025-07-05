import { Base_Url, clientServer } from '@/config'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DashboardLayout from '@/layout/Dashboard'
import UserLayout from '@/layout/UserLayout'
import styles from "./style.module.css"
import {
  getConnectionRequest,
  getMyConnectonRequests,
  sendConnectionrequest,
  getAboutUser
} from '@/config/redux/action/authAction'
import { getAllPosts } from '@/config/redux/action/postAction'
import { useDispatch, useSelector } from 'react-redux'

const DEFAULT_PROFILE_PIC = "https://res.cloudinary.com/duvlhhzaq/image/upload/v1751558256/default_mkj0mm.jpg"



const getProfileImageUrl = (user) => {
  const userPic =
    user?.profilePicture ||
    user?.userId?.profilePicture?.replace(/\\/g, "/");

  if (userPic) {
    // If hosted on Cloudinary and not default, return as is
    if (userPic.includes("cloudinary") && !userPic.toLowerCase().includes("default")) {
      return userPic;
    }

    // Else fallback to local image if not Cloudinary
    return userPic.startsWith("http") ? userPic : `${Base_Url}/${userPic}`;
  }

  // If nothing valid, use default
  return DEFAULT_PROFILE_PIC;
};


export default function ViewProfilePage({ userProfile }) {
  const router = useRouter()
  const dispatch = useDispatch()

  const authState = useSelector(state => state.auth)
  const postReducer = useSelector(state => state.postReducer)

  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false)
  const [userPosts, setUserPosts] = useState([])
  const [isConnectionNull, setIsConnectionNull] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    dispatch(getAllPosts())
    dispatch(getConnectionRequest({ token }))
    dispatch(getMyConnectonRequests({ token }))
  }, [dispatch])

  useEffect(() => {
    const filteredPosts = postReducer.posts.filter(post => post.userId.username === router.query.username)
    setUserPosts(filteredPosts)
  }, [postReducer.posts, router.query.username])

  useEffect(() => {
    const connections = Array.isArray(authState.connections) ? authState.connections : []
    const connectionRequests = Array.isArray(authState.connectionRequests) ? authState.connectionRequests : []

    setIsCurrentUserInConnection(false)
    setIsConnectionNull(true)

    const accepted = connections.find(conn =>
      conn.connectedUserId?._id === userProfile.userId._id && conn.status_accepted === true
    )
    if (accepted) {
      setIsCurrentUserInConnection(true)
      setIsConnectionNull(false)
    }

    const pending = connectionRequests.find(conn =>
      conn.connectedUserId?._id === userProfile.userId._id
    )
    if (pending) {
      setIsCurrentUserInConnection(true)
    }

    console.log("🔍 Connections:", connections)
    console.log("🔍 Connection Requests:", connectionRequests)
  }, [authState.connections, authState.connectionRequests, userProfile.userId._id])

  const handleConnect = async () => {
    const token = localStorage.getItem("token")
    console.log("🔗 Sending connection to:", userProfile.userId._id)

    await dispatch(sendConnectionrequest({
      token,
      user_id: userProfile.userId._id
    }))

    await dispatch(getConnectionRequest({ token }))
    await dispatch(getMyConnectonRequests({ token }))
    await dispatch(getAboutUser({ token }))
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={getProfileImageUrl(userProfile.userId)}
              alt="User Profile"
            />
          </div>

          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer__flex}>
              <div style={{ flex: "0.8" }}>
                <div style={{ display: "flex", width: "fit-content", alignItems: "center", flexDirection: "column" }}>
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "grey", width: "100%" }}>@{userProfile.userId.username}</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                  {isCurrentUserInConnection ? (
                    <button className={styles.connectedButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button onClick={handleConnect} className={styles.connectBtn}>Connect</button>
                  )}

                  <div
                    // onClick={async () => {
                    //   const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`)
                    //   window.open(`${Base_Url}/${response.data.filePath}`, "_blank")
                    // }}


                    onClick={async () => {
  try {
    const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`, {
      responseType: "blob",
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${userProfile.userId.username}-resume.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (err) {
    console.error("Failed to download resume:", err)
  }
}}

                    style={{ cursor: "pointer" }}
                  >
                    <svg style={{ width: "1.2em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </div>
                </div>

                <div>
                  <p>{userProfile.bio}</p>
                </div>

                <br />
                <div className="workHistory">
                  <h4>Work History</h4>
                  <div className={styles.workHistoryContainer}>
                    {userProfile.pastWork.map((work, index) => (
                      <div key={index} className={styles.workHistoryCard}>
                        <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                          {work.company} = {work.position}
                        </p>
                        <p>{work.years}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ flex: "0.2" }}>
                <h1>Recent Activity</h1>
                {userPosts.map((post) => (
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.card}>
                      <div className={styles.card_profileContainer}>
                        {post.media ? (
                          <img src={`${Base_Url}/uploads/${post.media}`} alt="post media" />
                        ) : (
                          <div style={{ width: "3.4rem", height: "3.4rem" }}></div>
                        )}
                      </div>
                      <p>{post.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}

export async function getServerSideProps(context) {
  const request = await clientServer.get("/user/get_profile_based_on_username", {
    params: { username: context.query.username }
  })

  return { props: { userProfile: request.data.profile } }
}
