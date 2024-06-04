import React, { useState } from 'react';
import { Link, json } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';

function LoginGPT() {

    function showDialog(message){
        const dialogContainer = document.createElement('div');
        dialogContainer.className = 'fixed top-0 right-0 left-0 z-10 justify-center items-center w-screen h-screen bg-gray-900 bg-opacity-50';
        const dialogBox = document.createElement('div');
        dialogBox.className = 'bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center';
        const messageText = document.createElement('p');
        messageText.textContent = message;
        dialogContainer.append(dialogBox);
        dialogBox.append(messageText);
        document.body.append(dialogContainer);
        setTimeout(() => {
            document.body.removeChild(dialogContainer);
        }, 2000);
    }


    document.title = 'Login';
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [jwt, setJwt] = useState('');
    const [user, setUser] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            "username":username,
            "password":password
        }

        try {
            const jwtResponse = await fetch('http://localhost:8200/auth/generateToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            console.log(jwtResponse);
            if (jwtResponse.ok) {
                const jwtData = await jwtResponse.text();
                const responseData = JSON.parse(jwtData);
                console.log(responseData.jwt);
                console.log(responseData.user); // No need to stringify here
            
                if (responseData.jwt.startsWith('e')) {
                    console.log("I'm here");
                    localStorage.setItem('jwt', responseData.jwt); // Store JWT in localStorage (optional)
                    setJwt(responseData.jwt);
            
                    // Serialize user object to JSON string
                    localStorage.setItem('user', JSON.stringify(responseData.user)); 
                    setUser(responseData.user); // No need to stringify here
                }
            } else {
                showDialog('error ' + jwtResponse.status + " " + jwtResponse.text());
            }            
        } catch (error) {
            showDialog('error' + error.message);
            setError(error.message);
            setData(null); // clear previous data
        } finally {
            setLoading(false);
        }

        // Here you would handle the login logic, e.g., calling an API
        console.log("Login with:", username, password);
    };

    if(localStorage.getItem('jwt') !== null){
        return <Navigate to="/" />;
    }else{
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Sign in to your account
                        </h2>
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign in
                            </button>
                            <p className='mt-3 text-center font-bold'>
                                <Link to='/register'>
                                    New User? Register!
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginGPT;
