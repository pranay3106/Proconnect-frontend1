import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router'
import React, { use, useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import style from "./style.module.css"
import UserLayout from '@/layout/UserLayout';
import { emptyMessage } from '@/config/redux/reducer/authReducer';

export default function LoginComponent() {


const router = useRouter()

const dispatch = useDispatch()

const authState = useSelector((state)=> state.auth)
const [UserLoginMethod ,setUserLoginMethod] = useState(false)
const[email, setEmail] = useState("")
const[password, setPassword] = useState("")
const [username, setUsername] = useState("")
const [name, setName] = useState("")

// while using authsate keep eye on authreducer
useEffect(() => {
  if (authState.isLoggedIn) {
    // Show success message for 2 seconds, then redirect
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [authState.isLoggedIn]);

useEffect(()=>{
dispatch(emptyMessage())
},[UserLoginMethod])


const handleRegister = () => {
  // setUserLoginMethod(false)
  dispatch(registerUser({username, email, password,name}))

}
const handlLogin = () => {
  // setUserLoginMethod(true) 
  dispatch(loginUser({email, password}))
}

useEffect(()=>{
  if(localStorage.getItem("token")){
    router.push("/dashboard")
  }
})




  return (
    // <div> LoginComponent</div>
    <UserLayout>

       <div className={style.container}>

        <div className={style.cardContainer}>
          <div className={style.cardContainer_left}>
            <p className={style.cardleft_heading}>{UserLoginMethod ? "Sign in " : "Sign up"}</p>
                  {/* {authState.message} */}

            <p style={{color : authState.isError ? "red" : "green"}}>{authState.message}</p>
          <div className={style.inputContainer}>

         {!UserLoginMethod &&   <div className={style.inputRow}>
            <input  onChange={(e)=> setUsername(e.target.value)} className={style.inputField} type="text"  placeholder='Username'/>
            <input  onChange={(e)=> setName(e.target.value)} className={style.inputField} type="text"  placeholder='Name'/>
          </div>}

           


            <input  onChange={(e)=> setEmail(e.target.value)} className={style.inputField} type="email"  placeholder='Email'/>
            <input onChange={(e)=> setPassword(e.target.value)} className={style.inputField} type="Password"  placeholder='Password'/>

            <div  onClick={()=>{
              if(UserLoginMethod){
                handlLogin()
              }else{
                handleRegister()
              }
            }} className={style.buttonWithOutline}>
            <p>{UserLoginMethod ? "Sign in " : "Sign up"}</p>

            </div>

          </div>


          </div>


          <div className={style.cardContainer_right}>
            
            
            <div>
              {UserLoginMethod ? <p>Don't have an Account? </p> : <p>Already have an Account?</p>}
              <div  onClick={()=>{
              setUserLoginMethod(!UserLoginMethod)
            }}  
            style={{color:"black",textAlign:"center"}}className={style.buttonWithOutline}>
            <p>{UserLoginMethod ? "Sign up " : "Sign in"}</p>

          </div>

            </div>
            


        </div>
       </div>
       </div>





    </UserLayout>
  

)}// export default LoginComponent  