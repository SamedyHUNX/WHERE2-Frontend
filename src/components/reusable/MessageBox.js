import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import useAuth from './../../hooks/useAuth';
import { X, Send } from 'lucide-react';
import config from './../../config';

const MessageBox = ({ receiverId, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const { userId: currentUserId } = useAuth();
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
  
    useEffect(() => {
      fetchMessages();
      scrollToBottom();
    }, [receiverId]);
  
    const fetchMessages = async () => {
      try {
        const response = await axios.get(config.messages.getConversation(receiverId));
        setMessages(response.data.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    const sendMessage = async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;
  
      try {
        await axios.post(config.messages.send, {
          receiverId,
          content: newMessage
        });
        setNewMessage('');
        fetchMessages();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };
  
    return (
      <div className="fixed bottom-0 right-4 w-80 bg-white rounded-t-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Messages</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
  
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.senderId === currentUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
  
        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 border-t">
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
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    );
  };

  export default MessageBox;