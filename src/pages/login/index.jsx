import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';
import UserLayout from '@/layout/UserLayout';
import style from './style.module.css';
import { getAboutUser } from '@/config/redux/action/authAction';

export default function LoginComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  // Auto-redirect if already logged in
 useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    dispatch(getAboutUser({ token })) // optional: validate token
    router.push('/dashboard');
  }
}, []);

  // Redirect after login
  useEffect(() => {
    if (authState.isLoggedIn) {
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }
  }, [authState.isLoggedIn]);

  // Clear messages when toggling mode
  useEffect(() => {
    dispatch(emptyMessage());
  }, [isLoginMode]);

  const handleRegister = () => {
    if (!username.trim() || !email.trim() || !password || !name.trim()) {
      alert('Please fill all fields to register.');
      return;
    }
    dispatch(registerUser({ username: username.trim(), email: email.trim(), password, name: name.trim() }));
  };

  const handleLogin = () => {
    if (!email.trim() || !password) {
      alert('Please enter email and password.');
      return;
    }
    dispatch(loginUser({ email: email.trim(), password }));
  };



  return (
    <UserLayout>
      <div className={style.container}>
        <div className={style.cardContainer}>
          <div className={style.cardContainer_left}>
            <p className={style.cardleft_heading}>{isLoginMode ? 'Sign-in' : 'Sign-up'}</p>
            <p style={{ color: authState.isError ? 'red' : 'green' }}>{authState.message}</p>

            <div className={style.inputContainer}>
              {!isLoginMode && (
                <div className={style.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    className={style.inputField}
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className={style.inputField}
                    type="text"
                    placeholder="Full Name"
                  />
                </div>
              )}

              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className={style.inputField}
                type="email"
                placeholder="Email"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className={style.inputField}
                type="password"
                placeholder="Password"
              />

              <div
                onClick={isLoginMode ? handleLogin : handleRegister}
                className={style.buttonWithOutline}
              >
                <p>{isLoginMode ? 'Sign in' : 'Sign up'}</p>
              </div>
            </div>
          </div>

          <div className={style.cardContainer_right}>
            <p>{isLoginMode ? "Don't have an account?" : 'Already have an account?'}</p>
            <div
              onClick={() => setIsLoginMode(!isLoginMode)}
              className={style.buttonWithOutline}
              style={{ color: 'black', textAlign: 'center' }}
            >
              <p>{isLoginMode ? 'Sign up' : 'Sign in'}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
