import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/Dashboard'
import { getAllUsers } from '@/config/redux/action/authAction'
import { Base_Url } from '@/config'

import styles from './index.module.css'

// Default profile picture URL
const DEFAULT_PROFILE_PIC = "https://res.cloudinary.com/duvlhhzaq/image/upload/v1751558256/default_mkj0mm.jpg"


// Returns image URL or default
const getProfileImageUrl = (user) => {
  const userPic =
    user?.profilePicture ||
    user?.userId?.profilePicture?.replace(/\\/g, "/");

  if (userPic) {
    // If hosted on Cloudinary and not default, return as is
    if (userPic.includes("cloudinary") && !userPic.toLowerCase().includes("default")) {
      return userPic;
    }

    // If not Cloudinary, use Base_Url for local images
    return userPic.startsWith("http") ? userPic : `${Base_Url}/${userPic}`;
  }

  // Fallback to default Cloudinary image
  return DEFAULT_PROFILE_PIC;
};




  
      // `${Base_Url}/${userProfile.userId.profilePicture.replace(/\\/g, "/")}` || 
      // "https://res.cloudinary.com/duvlhhzaq/image/upload/v1751558256/default_mkj0mm.jpg"


export default function DiscoverPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const authState = useSelector(state => state.auth)

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers())
    }
  }, [authState.all_profiles_fetched, dispatch])

  return (
    <UserLayout>
      <DashboardLayout>
        <h1>Discover</h1>
        <div className={styles.allUserProfile}>
          {authState.allUsers
           .filter(user => user.userId)
          .map(user => (
         

            <div
              key={user._id}
              className={styles.userCard}
              onClick={() => router.push(`/view_profile/${user.userId.username}`)}
            >
                 {console.log("hii",authState.allUsers)}
              <img
                className={styles.userCard_image}
                src={getProfileImageUrl(user)}
                alt={`${user.userId?.name} profile`}
                loading="lazy"
              />
              <div className={styles.users}>
                <h1>{user.userId?.name}</h1>
                <p>@{user.userId?.username}</p>
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}
