import NavBar from '@/Components/Navbar'
import React from 'react'

export default function UserLayout({children}) {
  return (
    
    <div>
      <NavBar />
      {children}</div>
  )
}