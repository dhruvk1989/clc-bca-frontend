import React from 'react'
import TopBar from '../components/TopBar';
import FootBar from '../components/FootBar';

function Me() {
    document.title = 'Create project';
  return (
    <div className="bg-gray-100 h-screen">
        <TopBar activePage="Me"/>
        <div className="flex justify-center mt-10">
            <div className="bg-white shadow-md rounded-lg p-8 mt-5">
                <h1 className="text-3xl font-bold text-indigo-600">User Details</h1>
                <p className="my-2">Name: {JSON.parse(localStorage.getItem('user')).name}</p>
                <p className="my-2">Email/Username: {JSON.parse(localStorage.getItem('user')).username}</p>
                <p className="my-2">Skills: {JSON.parse(localStorage.getItem('user')).skills    }</p>
            </div>
        </div>
        <FootBar/>
    </div>
  )
}

export default Me;