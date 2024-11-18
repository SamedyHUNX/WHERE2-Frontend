import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import {
  Email,
  Phone,
  Person,
  CalendarToday,
} from "@mui/icons-material";
import config from "../../../../config";
import { MailCheck } from "lucide-react";
import useAuth from "./../../../../hooks/useAuth"

const MessageListing = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const { contactId } = useParams();

  const { token } = useAuth();

  const messagesList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(config.contact.getAllContact, {
        headers: {
          "Authorization": `Bearer ${token}`, // Include token here
          "Content-Type": "application/json"
        }
      });
      setMessages(response.data.data.contacts);
      setError(null);
    } catch (error) {
      setError("Failed to fetch messages. Please try again later.");
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = async (messageId) => {
    try {
      await axios.patch(
        config.contact.markAsRead(messageId),
        {},
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        )
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };
  
  useEffect(() => {
    if (token) {
      messagesList();
    }
  }, [token]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredMessages = messages.filter(message => message.status === activeTab);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          User Messages
        </Typography>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={`Pending (${messages.filter(m => m.status === 'pending').length})`} 
            value="pending" 
          />
          <Tab 
            label={`Read (${messages.filter(m => m.status === 'read').length})`} 
            value="read" 
          />
        </Tabs>
      </Paper>

      {filteredMessages.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No {activeTab} messages
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredMessages.map((message, index) => (
            <Grid item xs={12} md={6} key={message.id || index}>
              <Card 
                elevation={2}
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                  borderLeft: message.status === 'pending' ? '4px solid #ed6c02' : '4px solid #2e7d32',
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Person color="primary" />
                        {message.name}
                      </Typography>
                      {message.status === 'pending' && (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => markAsRead(message.id)}
                          size="small"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </Box>
                    <Divider />
                  </Box>

                  <Link to={`mailto:${message.email}`}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Email color="action" />
                      <Typography color="text.secondary">
                        {message.email}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone color="action" />
                      <Typography color="text.secondary">
                        {message.phoneNumber}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarToday color="action" />
                      <Typography color="text.secondary">
                        {formatDate(message.createdAt || new Date())}
                      </Typography>
                    </Box>

                    <Paper
                      variant="outlined"
                      sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      }}
                    >
                      <Typography>{message.message}</Typography>
                    </Paper>
                  </Box>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MessageListing;
