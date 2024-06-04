import React from 'react'
import { useNavigate } from 'react-router-dom';

function FootBar() {

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/create-issue`; 
        navigate(path);
    }

  return (
    <div className="fixed bottom-2 left-2 bg-indigo-500 p-4 rounded-full cursor-pointer hover:bg-indigo-600" onClick={() => {routeChange()}}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
        </svg>
    </div>
  )
}

export default FootBar
