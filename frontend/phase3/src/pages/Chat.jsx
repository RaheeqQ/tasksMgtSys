import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';

const ChatApp = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const { currentUser } = useContext(AppContext);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    const socket = new WebSocket('ws://localhost:8080');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({
        type: 'join',
        username: currentUser.username
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages((prev) => [...prev, { from: data.from, message: data.message }]);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => socket.close();
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                allUsers {
                  username
                  isStudent
                }
              }
            `
          })
        });

        const result = await response.json();
        const allUsers = result.data.allUsers;

        let filtered = [];
        if (currentUser?.isStudent) {
          filtered = allUsers.filter(user => !user.isStudent);
        } else {
          filtered = allUsers.filter(user => user.username !== currentUser.username);
        }

        setOtherUsers(filtered);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    if (currentUser) fetchUsers();
  }, [currentUser]);

  const handleSend = () => {
    if (!message.trim() || !selectedUser || !socketRef.current) return;

    const msgData = {
      type: 'message',
      from: currentUser.username,
      to: selectedUser,
      message
    };

    socketRef.current.send(JSON.stringify(msgData));
    setMessage('');
  };

  const handleSelectUser = async (username) => {
    setSelectedUser(username);
    setMessages([]);

    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GetMessages($user1: String!, $user2: String!) {
              messageHistory(user1: $user1, user2: $user2) {
                from
                to
                message
                timestamp
              }
            }
          `,
          variables: {
            user1: currentUser.username,
            user2: username
          }
        })
      });

      const result = await response.json();
      console.log('GraphQL messageHistory result:', result); 
      const history = result.data.messageHistory;
      const formatted = history.map(msg => ({
        from: msg.from === currentUser.username ? 'You' : msg.from,
        message: msg.message
      }));
      setMessages(formatted);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };


  return (
    <section className="flex flex-col w-full h-screen bg-[#00033a] text-white md:flex-row">
      <div className="w-[250px] p-4 bg-[#00033a] flex flex-col">
        <h2 className="text-lg font-bold mb-4">
          {currentUser?.isStudent ? 'Admins List' : 'Users List'}
        </h2>
        <ul className="space-y-2">
          {otherUsers.map((user, index) => (
            <li
              key={index}
              onClick={() => handleSelectUser(user.username)}
              className="p-2 bg-[#162647] rounded-lg cursor-pointer hover:bg-[#d2ab17]"
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-4 bg-[#162647] rounded-lg mt-15 mr-6 flex flex-col h-[250px] justify-between">
        <h3 className="text-xl font-semibold mb-2">
          Chatting with {selectedUser || '...'}
        </h3>
        <div className="bg-[#162647] text-white p-2 rounded-lg overflow-y-auto flex flex-col items-end mb-2 max-h-60">
          {messages.map((msg, idx) => (
            <div key={idx} className={`p-2 rounded mb-1 ${msg.from === 'You' ? 'self-end bg-yellow-500' : 'self-start bg-gray-700'}`}>
              <span className="font-bold">{msg.from}:</span> {msg.message}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 rounded-lg mr-2 text-black bg-white"
            disabled={!selectedUser}
          />
          <button
            onClick={handleSend}
            className="p-2 bg-[#d2ab17] text-white rounded-lg"
            disabled={!selectedUser || !message.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChatApp;
