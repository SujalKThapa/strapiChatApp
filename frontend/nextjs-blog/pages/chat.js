// pages/chat.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const API_URL = 'http://localhost:1337/api';

const addUser = async (username) => {
  try {
    const response = await axios.post(`${API_URL}/active-users`, {
      data: {
        username: username,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding user to active-users:', error);
    throw error;
  }
};

const removeUser = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/active-users?filters[username][$eqi]=${username}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Fetched user data:', response.data); // Debug statement
    const user = response.data.data[0];
    if (user) {
      await axios.delete(`${API_URL}/active-users/${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(`User ${username} removed successfully`);
    } else {
      console.error(`User ${username} not found`);
    }
  } catch (error) {
    console.error('Error removing user from active-users:', error);
    throw error;
  }
};

export default function Chat() {
  const router = useRouter();
  const { username } = router.query;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!username) {
      router.push('/');
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/message-lists`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const messages = response.data.data.map(item => ({
          username: item.attributes.sender,
          message: item.attributes.message,
        }));
        setMessages(messages);
      } catch (error) {
        console.error('Error fetching messages from Strapi:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/active-users`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const users = response.data.data.map(item => item.attributes.username);
        setUsers(users);
      } catch (error) {
        console.error('Error fetching active users from Strapi:', error);
      }
    };

    const initialize = async () => {
      await addUser(username);
      await fetchMessages();
      await fetchUsers();
    };

    initialize();

    const handleBeforeUnload = (event) => {
      try {
        event.preventDefault();
      } catch (e) {
        console.warn('preventDefault not supported:', e);
      }
      event.returnValue = '';
    };

    const handleUnload = async () => {
      await removeUser(username);
      alert('You have been removed from the chat.');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [username]);

  const handleMessageSend = async () => {
    try {
      await axios.post(`${API_URL}/message-lists`, {
        data: {
          sender: username,
          message: message,
        },
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await axios.get(`${API_URL}/message-lists`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const updatedMessages = response.data.data.map(item => ({
        username: item.attributes.sender,
        message: item.attributes.message,
      }));
      setMessages(updatedMessages);
      setMessage('');
    } catch (error) {
      console.error('Error sending message to Strapi:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.chatMain}>
        <div className={styles.header}>
          <div className={styles.username}>{username}</div>
        </div>
        <div className={styles.chatRoom}>
          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div key={index}><strong>{msg.username}:</strong> {msg.message}</div>
            ))}
          </div>
        </div>
        <div className={styles.inputArea}>
          <input 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type a message" 
          />
          <button onClick={handleMessageSend}>Send</button>
        </div>
        <div className={styles.activeUsers}>
          <h3>Active Users</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
      </main>

      <style jsx>{`
        .chatMain {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        .header {
          display: flex;
          justify-content: center;
          padding: 1rem;
          background-color: #f5f5f5;
          border-bottom: 1px solid #eaeaea;
        }
        .username {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .chatRoom {
          background-color: #e0e0e0; /* Gray background for chat area */
          width: 25rem; /* 25rem width */
          height: 20rem; /* 20rem height */
          margin: 1rem auto; /* Center the chat room */
          overflow-y: auto;
          padding: 1rem;
          border-radius: 8px;
        }
        .messages {
          height: calc(100% - 2rem); /* Adjust height to fit within the chatRoom */
          overflow-y: auto;
        }
        .inputArea {
          display: flex;
          padding: 1rem;
          border-top: 1px solid #eaeaea;
        }
        input {
          flex: 1;
          padding: 0.5rem;
          font-size: 1rem;
          margin-right: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          border: none;
          background-color: #0070f3;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #005bb5;
        }
        .activeUsers {
          padding: 1rem;
        }
        .activeUsers h3 {
          margin: 0;
        }
        .activeUsers ul {
          list-style: none;
          padding: 0;
        }
        .activeUsers li {
          background: #f5f5f5;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
