import React from 'react'
import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function JoinChat() {

    const[projectId, setProjectId] = useState(null);
    const[userId, setUserId] = useState(null);

    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [stompClient, setStompClient] = useState(null);

    const connect = () => {
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
      };

      const subscribe = () => {
        if (stompClient !== null) {
            console.log(projectId);
          stompClient.subscribe(`/topic/${projectId}`, message => {
            console.log(`/topic/${projectId}`);
            setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
            console.log(JSON.parse(message.body));
          });
        }
      };

      const sendMessage = () => {
        if (messageInput.trim() !== '' && stompClient !== null) {
          stompClient.send(`/app/chat/${projectId}`, {}, JSON.stringify({ message: messageInput, userId: userId, projectId: projectId }));
          setMessageInput('');
        }
      };


  return (

    <div>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-gray-100 w-1/2 h-1/2 overflow-auto rounded-lg shadow-md p-6">
          <h1 className="text-center text-3xl font-extrabold text-indigo-500">
            Join Chat
          </h1>
          <form className="space-y-6 mt-6">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="projectId" className="sr-only">Project ID</label>
                <input
                onChange={e => setProjectId(e.target.value)}
                  type="text"
                  id="projectId"
                  name="projectId"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Project ID"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="userId" className="sr-only">User ID</label>
                <input
                onChange={e => setUserId(e.target.value)}
                  type="text"
                  id="userId"
                  name="userId"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="User ID"
                />
              </div>
            </div>
          </form>
            <div htmlFor="join" className="flex justify-center mt-5">
                <button className="px-4 py-2 ml-2 border rounded-md bg-indigo-500 text-white"
                onClick={() => {
                    document.getElementById('chatWindow').style.display = 'block';
                    document.getElementById('projectId').style.display = 'none';
                    document.getElementById('userId').style.display = 'none';
                    connect();
                    subscribe();
                }}>
                    Join chat
                </button>
            </div>
          <div id="chatWindow" className="hidden" style={{ height: '70vh' }}>
            <div className="flex justify-center">
              <div className="w-11/12">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col">
                  {messages.map((message, index) => (
                    <div key = {index} className="mt-2 mb-2 w-1/2 bg-gray-300 rounded-lg p-4">
                        {message.userId}: {message.message}
                    </div>
                    ))}
                  </div>
                  <div className="flex justify-center">
                    <textarea value = {messageInput} onChange={(e) =>{
                        setMessageInput(e.target.value);
                    }} 
                    className="w-full p-2 border border-gray-300 rounded-md" placeholder="Type a message" />
                    <button className="px-4 py-2 ml-2 border rounded-md bg-indigo-500 text-white"
                    onClick={() => {
                        sendMessage();
                        subscribe();
                        console.log(messages);
                    }}>
                        Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinChat
