import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';
import config from '../../../../config';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  School,
  Work,
  ArrowForward,
  Add as AddIcon,
} from '@mui/icons-material';

const AdminContentListing = () => {
  const [posts, setPosts] = useState([]);
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminContents = async () => {
      try {
        console.log('fetching for admin content');
        const response = await axios.get(config.profile.getAdminContentList(userId));
        setPosts(response.data.data.posts);
      } catch (error) {
        console.error("Error fetching admin content list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminContents();
  }, [userId]);

  const handlePostClick = (postType, id) => {
    navigate(`/detail/${postType}/${id}`);
  };

  const getPostTypeIcon = (type) => {
    return type === 'university' ? (
      <School fontSize="small" sx={{ mr: 1 }} />
    ) : (
      <Work fontSize="small" sx={{ mr: 1 }} />
    );
  };

  const getPostTypeColor = (type) => {
    return type === 'university' ? 'primary' : 'secondary';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={300} height={60} />
        </Box>
        {[1, 2, 3].map((n) => (
          <Card key={n} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Skeleton variant="text" width="60%" height={40} />
                  <Skeleton variant="text" width="80%" height={60} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          backgroundColor: 'background.paper' 
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            Your Content
          </Typography>
          <Tooltip title="Add new content">
            <IconButton 
              color="primary" 
              onClick={() => {
                localStorage.setItem('sidebarContent', 'adminContent');
                window.location.reload();
              }}              
              sx={{ 
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider />
      </Paper>

      {posts.length === 0 ? (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: 'grey.50'
          }}
        >
          <Typography color="text.secondary" variant="h6">
            No content found. Start creating some content!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} key={`${post.postType}-${post.id}`}>
              <Card 
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    '& .arrow-icon': {
                      transform: 'translateX(4px)',
                    }
                  }
                }}
                onClick={() => handlePostClick(post.postType, post.id)}
              >
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start' 
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h5" 
                        component="h2" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {getPostTypeIcon(post.postType)}
                        {post.title || 'Untitled'}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {post.description || 'No description available'}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 2 
                    }}>
                      <Chip
                        label={post.postType === 'university' ? 'University' : 'Job'}
                        color={getPostTypeColor(post.postType)}
                        size="small"
                        sx={{ minWidth: 90 }}
                      />
                      <ArrowForward 
                        className="arrow-icon"
                        sx={{ 
                          color: 'primary.main',
                          transition: 'transform 0.2s ease-in-out'
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AdminContentListing;