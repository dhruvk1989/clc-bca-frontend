import React, { useState } from 'react';
import { Link, json } from 'react-router-dom';
import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function ChatTest() {

    const projectId = 123;
    const userId = 123;
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
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
            console.log(projectId);
          stompClient.subscribe(`/topic/${projectId}`, message => {
            console.log(`/topic/${projectId}`);
            setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
            console.log(JSON.parse(message.body));
          });
        }
      }, [stompClient]);

      const sendMessage = () => {
        if (messageInput.trim() !== '' && stompClient !== null) {
          stompClient.send(`/app/chat/${projectId}`, {}, JSON.stringify({ message: messageInput, userId: userId, projectId: projectId }));
          setMessageInput('');
        }
      };

      return (
        <div>
          <div>
            {messages.map((message, index) => (
              <div key={index}>
                {message.userId}: {message.message}
              </div>
            ))}
          </div>
          <div>
            <input type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      );

}

export default ChatTest;