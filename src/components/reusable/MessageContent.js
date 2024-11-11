// components/MessagesContent.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';
import useAuth from './../../hooks/useAuth';
import config from './../../config';

const MessagesContent = ({ targetUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const { userId: currentUserId, token } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!token) return;
    
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    
    return () => clearInterval(interval);
  }, [targetUserId, token]);

  const fetchMessages = async () => {
    if (!token) {
      console.error("Token is not available");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(config.messages.getMessages(targetUserId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setMessages(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Error loading messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(config.messages.send, {
        receiverId: targetUserId,
        content: newMessage.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setMessages(prevMessages => [...prevMessages, response.data.data]);
        setNewMessage('');
        scrollToBottom();
      } else {
        setError('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const MessageBubble = ({ message }) => {
    const isCurrentUser = message.senderId === currentUserId;
    
    // For incoming messages (not current user), show sender's profile
    // For outgoing messages (current user), show receiver's profile
    const profileToShow = message.sender?.profile || {};
    
    // Fallback values for profile data
    const firstName = profileToShow.firstName || 'User';
    const lastName = profileToShow.lastName || '';
    const profilePictureUrl = profileToShow.profilePictureUrl || '/api/placeholder/32/32';
    
    return (
      <div className={`flex items-start space-x-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        {!isCurrentUser && (
          <img 
            src={profilePictureUrl}
            alt={`${firstName} ${lastName}`}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className={`max-w-[70%] ${isCurrentUser ? 'order-1' : 'order-2'}`}>
          {!isCurrentUser && (
            <div className="text-sm text-gray-600 mb-1">
              {firstName} {lastName}
            </div>
          )}
          <div
            className={`p-3 rounded-lg ${
              isCurrentUser
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            }`}
          >
            <p>{message.content}</p>
            <span className="text-xs opacity-75 mt-1 block">
              {new Date(message.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
        {isCurrentUser && (
          <img 
            src={profilePictureUrl}
            alt={`${firstName} ${lastName}`}
            className="w-8 h-8 rounded-full"
          />
        )}
      </div>
    );
  };

  if (loading && messages.length === 0) {
    return <div className="flex justify-center items-center h-full">Loading messages...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-[32px] h-[calc(100vh-200px)]">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || loading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessagesContent;