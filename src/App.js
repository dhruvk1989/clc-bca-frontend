import logo from './logo.svg';
import './App.css';
import LoginGPT from './pages/LoginGPT.js';
import Dashboard from './pages/Dashboard.js';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState } from 'react';
import Register from './pages/Register.js';
import ChatTest from './pages/ChatTest.js';
import JoinChat from './pages/JoinChat.js';
import ProjectList from './pages/ProjectList.js';
import Me from './pages/Me.js';
import CreateProject from './pages/CreateProject.js';
import Project from './pages/Project.js';
import ChatRoom from './pages/ChatRoom.js';

function App() {

  document.title = 'CLC';

  // State to manage JWT token
  const [jwt, setJwt] = useState(null);

  // Function to handle successful login and store JWT
  const handleLoginSuccess = (token) => {
    setJwt(token); // Update state with received JWT
    localStorage.setItem('jwt', token); // Store JWT in localStorage (optional)
  };

  // Function to check for stored JWT
  const isAuthenticated = () => {
    // Check for both localStorage and state
    console.log(localStorage.getItem('jwt'));
    console.log(!!(jwt || localStorage.getItem('jwt')));
    return !!(jwt || localStorage.getItem('jwt'));
  };

  return (
    <Router>
            <Routes>
                <Route
                    path="/"
                    element={isAuthenticated ? <Dashboard isAuthenticated={isAuthenticated()}/> : <Navigate to="/login" />}
                    // element = {<JoinChat/>}
                ></Route>
                <Route
                    path="/login"
                    element={<LoginGPT onLoginSuccess={handleLoginSuccess}/>}
                ></Route>
                <Route
                    path="/register"
                    element={<Register />}
                ></Route>
                <Route
                    path="/issues"
                    element={isAuthenticated ? <ProjectList/> : <Navigate to="/login" />}
                ></Route>
                <Route
                    path="/me"
                    element={isAuthenticated ? <Me/> : <Navigate to="/login" />}
                ></Route>
                <Route
                    path="/create-issue"
                    element={isAuthenticated ? <CreateProject/> : <Navigate to="/login" />}
                ></Route>
                <Route
                    path="/issues/:projectId"
                    element={isAuthenticated ? <Project isAuthenticated={isAuthenticated()}/> : <Navigate to="/login" />}
                ></Route>
                <Route
                    path="/chat/:projectId"
                    element={isAuthenticated ? <ChatRoom isAuthenticated={isAuthenticated()}/> : <Navigate to="/login" />}
                ></Route>
            </Routes>
    </Router>
);
}

export default App;
