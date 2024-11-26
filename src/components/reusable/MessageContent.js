// components/MessagesContent.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from './../../hooks/useAuth';
import FormInput from './InputField';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  Alert, 
  AlertTitle 
} from '@mui/material';
import config from './../../config';
import ButtonComponent from './Button';

const MessagesContent = ({ targetUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const messagesEndRef = useRef(null);
  const { userId: currentUserId, token, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!token) {
      setOpenLoginDialog(true);
      setLoading(false);
      return
    };
    
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    
    return () => clearInterval(interval);
  }, [targetUserId, token]);

  const fetchMessages = async () => {
    if (!token) {
      setOpenLoginDialog(true);
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
      setError('Error loading messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!token) {
      setOpenLoginDialog(true);
      return;
    }

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
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const MessageBubble = ({ message }) => {
    const isCurrentUser = message.senderId === currentUserId;
    
    const profileToShow = message.sender?.profile || {};
    
    const firstName = profileToShow.firstName || 'User';
    const lastName = profileToShow.lastName || '';
    const profilePictureUrl = profileToShow.profilePictureUrl || '/api/placeholder/32/32';
    
    return (
      <div className={`flex items-start space-x-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
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
                ? 'bg-sky-500 text-white'
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

  // Login Dialog Component
  const LoginPromptDialog = () => {
    const handleClose = () => {
      setOpenLoginDialog(false);
    };

    const handleLogin = () => {
      navigate('/login', { replace: true });
      setOpenLoginDialog(false);
    };

    return (
      <Dialog
        open={openLoginDialog}
        onClose={handleClose}
        aria-labelledby="login-dialog-title"
        aria-describedby="login-dialog-description"
      >
        <DialogTitle id="login-dialog-title">
          Login Required
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="login-dialog-description">
            You need to log in to access messaging features. 
            Please log in to view and send messages or consider signup.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonComponent onClick={handleClose} variant='danger' rounded={false}>
            Cancel
          </ButtonComponent>
          <ButtonComponent onClick={handleLogin} variant="primary" rounded={false} autoFocus>
            Log In
          </ButtonComponent>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading && messages.length === 0) {
    return <div className="flex justify-center items-center h-full">Loading messages...</div>;
  }

  if (!token) {
    return (
      <div className="flex justify-center items-center h-full">
        <Alert severity="warning">
          <AlertTitle>Login Required</AlertTitle>
          You need to log in to access messaging features. 
          <Button onClick={() => setOpenLoginDialog(true)} color="warning">
            Log In
          </Button>
        </Alert>
        <LoginPromptDialog />
      </div>
    );
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
          <FormInput
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <ButtonComponent
            type="submit"
            disabled={!newMessage.trim() || loading}
            className="bg-blue-500 mt-2 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={24} />
          </ButtonComponent>
        </div>
      </form>

      {!isLoggedIn && <LoginPromptDialog />}
    </div>
  );
};

export default MessagesContent;