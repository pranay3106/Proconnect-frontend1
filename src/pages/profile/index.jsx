import { Base_Url, clientServer } from '@/config'
import { getAboutUser } from '@/config/redux/action/authAction'
import React, { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./style.module.css"
import { getAllPosts } from '@/config/redux/action/postAction'
// import { current } from '@reduxjs/toolkit'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/Dashboard'

export default function ProfilePage () {

const dispatch = useDispatch()

//it  checks if any chanegs in given field

const [userProfile ,setUserProfile] = useState({
    // userId:{
    //     name:"",
    //     username:"",
    //     profilePicture:""
    // },
    // bio:"",
    // pastWork:[]
})
 


const [userPosts,setUserPosts]= useState([])

const[isModalOpen,setIsModalOpen] = useState(false)

const [inputData,setinputData ] = useState({company:"",position:"",years:""})

const handleWorkInputChange = (e) =>{
     const{name,value} = e.target;
     setinputData({...inputData,[name]:value})
}

const updateProfiledata = async()=>{

  try{
    const request = await clientServer.post("/user_update",{
    token:localStorage.getItem("token"),
    name:userProfile.userId.name,
    })

    const response = await clientServer.post("/update_profile_data",{
    token:localStorage.getItem("token"),
    bio:userProfile.bio,
    currentPost:userProfile.currentPost,
    pastWork:userProfile.pastWork,
    userProfile:userProfile.userProfile
    });

    dispatch(getAboutUser({token : localStorage.getItem("token")}));
  }catch (error) {
    console.error("Error updating profile:", error.message);
    alert("Failed to update profile: " + error.message);
  }
    
}
    

const authState = useSelector((state)=>state.auth)
const postReducer =useSelector((state)=>state.postReducer)

useEffect(()=>{
    dispatch(getAboutUser({token: localStorage.getItem("token")}))
    dispatch(getAllPosts())
},[])


useEffect(()=>{

  if(authState.user != undefined){
    setUserProfile(authState.user)

let post = postReducer.posts.filter((post)=>{
    return post.userId.username === authState.user.userId.username
  })
  setUserPosts(post)
  }
     

},[authState.user,postReducer.posts])


const updateProfilePicture = async(file)=>{
    const formData = new FormData();
    formData.append("profile_picture",file)
    formData.append("token",localStorage.getItem("token"))

    const response = await clientServer.post("/update_profile_picture",formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        },
    })
console.log("getAboutUser API response:", response.data);
    dispatch(getAboutUser({token : localStorage.getItem("token")}));


} 

const isProfileUpdated =
  userProfile?.userId?.name !== authState.user?.userId?.name ||
  userProfile?.bio !== authState.user?.bio ||
  JSON.stringify(userProfile?.pastWork) !== JSON.stringify(authState.user?.pastWork);
 

useEffect(() => {
  console.log("Redux profilePicture:", authState.user?.userId?.profilePicture);
}, [authState.user]);


useEffect(() => {
  setUserProfile(authState.user);
}, [authState.user]);
  return (


    
    <UserLayout>

      
    <DashboardLayout>
        {authState.user && userProfile?.userId && (
      <div className={styles.container}>
        <div className={styles.backDropContainer}>
            <div className={styles.backDrop} >

                <label  htmlFor ='profilePictureUpload'className={styles.backDrop_overlay} >
                <p>Edit</p>

                </label>
                <input onChange={(e)=>{
                   updateProfilePicture(e.target.files[0])
                }} hidden type="file" name="" id="profilePictureUpload" />
          <img  src={`${Base_Url}/uploads/${userProfile.userId.profilePicture}?v=${Date.now()}`}/>

            </div>
        </div>

        <div className={styles.profileContainer_details}>
          <div style={{display:"flex",gap:"0.2rem"}}>
            <div style={{flex:"0.8"}}>
            <div style={{display:"flex",width:"fit-content",alignItems:"center",flexDirection:"column"}}>

          <input style={{}}
  className={styles.nameEdit}
  type='text'
  value={userProfile.userId.name}
  onChange={e => {
    setUserProfile({
      ...userProfile,
      userId: { ...userProfile.userId, name: e.target.value }
    });
  }}
/>
{/* 
<input style={{}}
  className={styles.nameEdit}
  type='text'
  value={userProfile.userId.username}
  onChange={e => {
    setUserProfile({
      ...userProfile,
      userId: { ...userProfile.userId, username: e.target.value }
    });
  }}
/> */}

          
          <p style={{ color:"grey",width:"100%" }}>@{userProfile.userId.username}</p>
          {console.log(userProfile.userId.username)}

            </div>
           

          <textarea  placeholder='write your bio here' className ={styles.textareaX} name="" id="" value={userProfile.bio} onChange={
            (e)=>{
                setUserProfile({...userProfile,bio:e.target.value})
            }
          }
          rows={3}// to adjust size of textarea
          style={{ width:"70%"}}
          ></textarea>




           <div className={styles.workHistory}>

          <h4>Work History</h4>
          <div className={styles.workHistoryContainer}>
            {
              userProfile.pastWork.map((work,index)=>{
                return(
                  <div className={styles.workHistoryCard}>
                    <p style={{fontWeight:"bold",display:"flex",alignItems:"center",gap:"0.8rem"}}>
                      {work.company} 
                    </p>
                    <p>{work.position}</p>
                    <p>{work.years}yrs</p>
                  </div>
                )
              })
            }
            <button  onClick={()=>{
                setIsModalOpen(true)
            }}
            className={styles.addWorkButton}>Add work</button>
          </div>

        </div>









            </div>
            <div style={{flex:"0.2"}}>
              <h1>Recent Activity</h1>
              {userPosts.map((post)=>{
                return(
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.card}>
                      <div className={styles.card_profileContainer}>
                        {post.media !=="" ? <img src={`${Base_Url}/uploads/${post.media}`}/>
                        : 
                        <div style={{width:"3.4rem",height:"3.4rem"}}></div>
                        }
                        </div>
                        <p>{post.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </div>
       
        
        {isProfileUpdated &&( 
         <div onClick={()=>{
            updateProfiledata()
         }} className={styles.updateProfileBtn}>
            Update profile
            </div>
           )}
      </div>
)}



 {
                         isModalOpen  &&
                <div  onClick={()=>{
                    setIsModalOpen(false)

                    }}className={styles.commentsContainer}>
                    <div
                    onClick={(e)=>{
                        e.stopPropagation()

                    }} className={styles.allCommentsContainer}>   
                                    <input onChange={handleWorkInputChange} name='company' className={styles.inputField} type="text"  placeholder='Enter Company'/>
                                    <input onChange={ handleWorkInputChange} name="position"className={styles.inputField} type="text"  placeholder='Enter Position'/>
                                    <input onChange={handleWorkInputChange}  name="years"className={styles.inputField} type="Number"  placeholder='Years '/>
                                    <div  onClick={()=>{ 
                                            setUserProfile({
  ...userProfile,
  pastWork: [...(userProfile.pastWork || []), inputData]
});
                                            setIsModalOpen(false)
                                    }}className={styles.updateProfileBtn}>Add work</div>
                        
                      


                            </div>     
 </div>   
}         
    </DashboardLayout>
    </UserLayout>
  )
}
