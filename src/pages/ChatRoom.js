import React, { useState } from 'react'
import TopBar from '../components/TopBar'
import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function ChatRoom({isAuthenticated}) {

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    const { projectId } = useParams();
    document.title = `Chat Room ${projectId}`;
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const jwt = localStorage.getItem('jwt');
    const [messageIds, setMessageIds] = useState([]);

    const handleSendMessage = () => {
        console.log(newMessage);
        if (newMessage.trim() !== '' && stompClient !== null) {
            console.log('here');
            stompClient.send(`/app/chat/${projectId}`, {}, JSON.stringify({ message: newMessage, userId: user.userId, projectId: projectId, jwt: jwt }));
            //setMessages(prevMessages => [...prevMessages, { author: user.userId, text: newMessage }]);
            setNewMessage('');
        }
        console.log('okkkk ' + messages)
    };

    const handleExitChat = async () => {
        const jwt = localStorage.getItem('jwt');
        const response = await fetch(`http://localhost:8200/chatRoom/exitRoom?projectId=${projectId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        });
        //const data = await response.json();
        if(!response.ok){
            showDialog('error exiting the room');
        }
    };

    const fetchMessages = async () => {
        const jwt = localStorage.getItem('jwt');
        const response = await fetch(`http://localhost:8200/messages/${projectId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        });
        const data = await response.json();
        console.log(data);
        setMessages(data);
        if(!response.ok){
            showDialog('error exiting the room');
        }
    };


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

    useEffect(() => {
        fetchMessages();
        const socket = new SockJS('http://localhost:8300/ws');
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
          setStompClient(stompClient);
        });
    
        return () => {
          if (stompClient === null) {
            stompClient.disconnect();
          }
        };
      }, []);

    useEffect(() => {
        if (stompClient !== null) {
            stompClient.subscribe(`/topic/${projectId}`, message => {
                if(!messageIds.includes(JSON.parse(message.body).messageId)){
                    messageIds.push(JSON.parse(message.body).messageId);
                    console.log(messageIds);
                    console.log(JSON.parse(message.body).messageId);
                    setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
                }
          });
        }
    }, [stompClient]);

    if(isAuthenticated === true){
        
        return (
            <div className="bg-gray-100 h-screen">
                <TopBar activePage=""/>
                <div className="flex flex-col h-full mt-16 bg-gray-100 rounded-lg shadow-lg p-4">
                {/* Chat Header */}

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {messages.map((message) => (
                            <div key={message.messageId} className={`p-3 rounded-md ${message.userId === user.userId ? 'bg-indigo-100 self-end' : 'bg-white self-start'}`}>
                                <p className="text-gray-800">{message.message}</p>
                                <p className="text-sm text-gray-500 mt-1">{message.userDto.name}</p>
                                <p className="text-sm text-gray-500 mt-1">{new Date(message.timestamp).toLocaleString()}</p>
                                {/* <p className="text-xs text-gray-400">{new Date(message.timestamp).toLocaleString()}</p> */}
                            </div>
                        ))}
                    </div>

                    <div className="p-3 border-t bg-white flex items-center space-x-3">
                        <input
                            type="text"
                            className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                        />
                        <button
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-600 transition"
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>
                        <Link to={{pathname : `/issues/${projectId}`}}>
                        <button
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-600 transition"
                            onClick={handleExitChat}
                        >
                            Exit Chat
                        </button>
                        </Link>
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

export default ChatRoom