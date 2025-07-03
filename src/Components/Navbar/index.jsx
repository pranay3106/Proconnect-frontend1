import React from 'react'
import styles from "./style.module.css"
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';

export default function NavBar() {

  const router = useRouter();
const authState = useSelector((state=>state.auth))
const dispatch = useDispatch();
const token= true
//  = localStorage.getItem("token")

  return (
    <>
    <div  className={styles.Container}>
      {/* <h1>hello</h1> */}
      <nav className={styles.navbar}>
        <h1  style={{cursor:"pointer"}} onClick={
          ()=>{
            router.push("/")
          }
        }>Pro Connect{console.log(authState.profilefetched)}
        </h1>
<div className={styles.navbarOptions_div}>
 <div className={styles.navbarOptions}>
       {authState.profilefetched &&   authState.user && authState.user.userId && (
                        <div  className={styles.profile}>
                          <div style={{display:"flex",gap:"1.2rem",}}>
                          <p  onClick ={
                            ()=>{
                              router.push("/profile")
                            }
                          }style={{fontWeight:"bold",cursor:"pointer",justifyContent:"center",alignItems:"center",padding:"1rem"}}>Profile</p>


                           { token ?

                        <div className={styles.buttonJoin}
                        onClick={()=>{
                            localStorage.removeItem("token")
                            dispatch(reset())
                            router.push("/login")
                      }}> <p>Log-out</p></div>
                      :
                      <div  onClick={()=>{
                          router.push("/login");
                        }}className={styles.buttonJoin}>
                          <p>Be a part</p>
                        </div>  
                      

                        
                        }

                          {/* <p  onClick={()=>{
                            localStorage.removeItem("token")
                            dispatch(reset())
                            router.push("/login")
                          }}style={{fontWeight:"bold",cursor:"pointer"}}>Logout</p> */}

                          </div>
                          
                          </div>
                        )}
              </div>
              

             
</div>
       

      </nav>

    </div>



     
   
    </>
  )
}
