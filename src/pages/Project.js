import React, { useEffect, useState } from 'react'
import { Link, Navigate, useResolvedPath } from 'react-router-dom'
import FootBar from '../components/FootBar'
import TopBar from '../components/TopBar'
import { useParams, useLocation } from 'react-router-dom'

function Project({isAuthenticated}) {

    const { projectId } = useParams();
    const [projectDetails, setProjectDetails] = useState({});
    const [comments, setComments] = useState(projectDetails.commentsList || []);
    const [newComment, setNewComment] = useState('');
    const [projectOwner, setProjectOwner] = useState({});
    const [joinedUsers, setJoinedUsers] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    document.title = `Issue ${projectId}`;

    const handleAddComment = async () => {
        if (newComment.trim() !== '') {
            const jwt = localStorage.getItem('jwt');
            const response = await fetch(`http://localhost:8200/project/${projectId}/comment`, {
                headers: {

                    "Authorization": `Bearer ${jwt}`,
                    "Content-Type": "application/json"
                },
                method: 'POST',
                body: JSON.stringify({
                    "comment": newComment
                })
            });
            const data = await response.json();
            setComments([...comments, data]);
            console.log(data);
            setNewComment('');
        }
    };

    const handleJoinChat = async () => {
        const jwt = localStorage.getItem('jwt');
        const response = await fetch(`http://localhost:8200/chatRoom/joinRoom?projectId=${projectId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        });
        //const data = await response.json();
        if(!response.ok){
            showDialog('error joining the room');
        }
    };

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        const fetchProjectDetails = async () => {
            const response = await fetch(`http://localhost:8200/project/${projectId}?getComments=true`, {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            });
            const data = await response.json();
            setProjectDetails(data);
            setProjectOwner(data.projectOwner)
            setComments(data.commentsList)
            setJoinedUsers(data.joinedUsers)
        }
        fetchProjectDetails();
    }, []);
    

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

    if(isAuthenticated === true){
        
        return (
            <div className="bg-gray-100 h-screen">
            <TopBar activePage=""/>
            <div className="h-full max-w-2xl mx-auto mt-16 p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-800">{projectDetails.title}</h1>
                <p className="text-gray-600 mt-2">{projectDetails.description}</p>
                <p className="text-sm text-gray-500 mt-1">Posted by: {projectOwner.name}</p>
            </div>

            <div className="border-t pt-4 mt-4">
                <h2 className="text-xl font-bold text-gray-800">Comments</h2>
                <div className="space-y-4 mt-4">
                    {comments.map((comment) => (
                        <div key={comment.commentId} className="p-4 bg-gray-100 rounded-md">
                            <p className="text-gray-800">{comment.comment}</p>
                            <p className="text-sm text-gray-500 mt-1">By: {comment.userDto.name}</p>
                            <p className="text-sm text-gray-500">{new Date(comment.timestamp).toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <textarea
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows="3"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        onClick={handleAddComment}
                    >
                        Add Comment
                    </button>
                    <Link to={`/chat/${projectId}`}><button
                        className="mt-2 ml-5 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        onClick={handleJoinChat}
                    >
                        {joinedUsers.includes(user.userId) ? 'Open Chat' : 'Join Chat'}
                    </button></Link>
                </div>
            </div>
        </div>
        </div>
          )
    }else{
        return(
            <Navigate to="/login" />
        )
    }
}

export default Project
