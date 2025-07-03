import React, { useEffect } from 'react'

import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/Dashboard'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction'
import { Base_Url } from '@/config'
import styles from "./index.module.css"
import { useRouter } from 'next/router'
export default function DiscoverPage() {

const router  = useRouter();
const authState = useSelector((state=>state.auth))
const dispatch = useDispatch();
    useEffect(()=>{
      if(  authState.all_profiles_fetched){
        dispatch(getAllUsers());
      }
    })


    const{username} = router.query;

  return (

<UserLayout>
       <DashboardLayout>
        <h1>Discover</h1>
        {console.log("All profiles",authState.all_profiles_fetched)}
        <div className={styles.allUserProfile}>
          {
          // authState.all_profiles_fetched && 
                authState.allUsers.map((user)=>{
            return (
              <div  onClick={
                ()=>{
                  router.push(`/view_profile/${user.userId.username}`)
                }
              }key={user._id} className={styles.userCard}>
                <img  className={styles.userCard_image}src={`${Base_Url}/uploads/${user.profilePicture || user.userId?.profilePicture  || "default.jpg"}`} alt="profile" />
                <div className={styles.users}>
                  <h1>{user.userId.name}</h1>
                  <p>{user.userId.username}</p>
                </div>
              </div>
            )
          }) }
        </div>
       </DashboardLayout>
    
    </UserLayout>  )
}
