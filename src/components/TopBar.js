import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import logo from '../CLC-2.png'


function TopBar({activePage}) {
    
    return (
        <div className='flex items-center justify-between w-full bg-indigo-600 h-16 fixed top-0 left-0 right-0'>
            <div className='overflow-hidden'>
                <img src={logo} alt='logo' className='h-full max-h-16'/>
            </div>
            <div className='flex justify-end flex-row-reverse'>
                <div className={`p-3 text-lg hover:bg-indigo-700 text-white ${activePage === 'Logout' ? 'bg-indigo-700' : ''}`}><Link to="/login" onClick={() => {
                    localStorage.removeItem('jwt');
                    localStorage.removeItem('user')
                }}>Logout</Link></div>
                <div className={`p-3 text-lg hover:bg-indigo-700 text-white ${activePage === 'Me' ? 'bg-indigo-700' : ''}`}><Link to="/me">My Account</Link></div>
                <div className={`p-3 text-lg hover:bg-indigo-700 text-white ${activePage === 'Issues' ? 'bg-indigo-700' : ''}`}><Link to="/issues">Issues</Link></div>
                <div className={`p-3 text-lg hover:bg-indigo-700 text-white ${activePage === 'Dashboard' ? 'bg-indigo-700' : ''}`}><Link to="/">Dashboard</Link></div>
            </div>
        </div>
  )
}

export default TopBar
