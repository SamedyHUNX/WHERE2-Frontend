import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './../../../../hooks/useAuth';
import config from './../../../../config';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  School,
  Work,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Edit } from 'lucide-react';

const AdminContentListing = () => {
  let response;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    postId: null,
    postTitle: '',
    postType: null
  });
  
  const { userId } = useAuth();
  const navigate = useNavigate();
console.log("userId", userId)
  const fetchAdminContents = async () => {
    try {
      console.log('Fetching admin content');
      console.log("userId inside function", userId)
      console.log('link URL', typeof (config.profile.getAdminContentList(userId)))
      if (userId) {
        response = await axios.get(config.profile.getAdminContentList(userId));
        console.log("Response",response)
      }
      const approvedPosts = response.data.data.posts;
      setPosts(approvedPosts);
    } catch (error) {
      console.error("Error fetching admin content list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminContents();
  }, [userId]);

  const handlePostClick = (postType, id, event) => {
    if (event.defaultPrevented) return;
    navigate(`/detail/${postType}/${id}`);
  };

  const handleAddContent = () => {
    localStorage.setItem('sidebarContent', 'adminContent');
    window.location.reload();
  };

  const handleDeleteClick = (event, postId, postTitle, postType) => {
    event.preventDefault();
    event.stopPropagation();
    setDeleteDialog({
      open: true,
      postId,
      postTitle,
      postType
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      let response;
      if (deleteDialog.postType === 'job') {
        response = await axios.delete(config.job.deleteJob(deleteDialog.postId));
      } else {
        response = await axios.delete(config.universities.deleteUniversity(deleteDialog.postId));
      }
      
      if (response.status === 200) {
        setPosts(posts.filter(post => post.id !== deleteDialog.postId));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setDeleteDialog({ open: false, postId: null, postTitle: '', postType: null });
    }
  };

  const renderLoadingSkeleton = () => (
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

  const renderHeader = () => (
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
            onClick={handleAddContent}
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
  );

  const renderContentCard = (post) => (
    <Card 
      onClick={(e) => handlePostClick(post.postType, post.id, e)}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
      
    >
      <CardContent>
      <Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: {
      xs: 'column', // For small screens
      sm: 'column', 
      md: 'row',    // For medium and larger screens
    },
  }}
>
  {/* Content Section */}
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
      {/* Icon based on post type */}
      {post.postType === 'university' ? 
        <School fontSize="small" sx={{ mr: 1 }} /> : 
        <Work fontSize="small" sx={{ mr: 1 }} />
      }
      {post.title || 'Untitled'}
    </Typography>

    {/* Description with ellipsis for overflow */}
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

  {/* Action Section */}
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center',
    gap: 2 
  }}>
    {/* Post Type Chip */}
    <Chip
      label={post.postType === 'university' ? 'University' : 'Job'}
      color={post.postType === 'university' ? 'primary' : 'secondary'}
      size="small"
      sx={{ minWidth: 90 }}
    />

    {/* Action Buttons */}
    <IconButton
      onClick={(e) => handleDeleteClick(e, post.id, post.title, post.postType)}
      sx={{
        color: 'error.main',
        '&:hover': {
          backgroundColor: 'error.light',
        },
      }}
    >
      <DeleteIcon />
    </IconButton>
  </Box>
</Box>

      </CardContent>
    </Card>
  );

  if (loading) return renderLoadingSkeleton();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {renderHeader()}

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
              {renderContentCard(post)}
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, postId: null, postTitle: '', postType: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.postTitle}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, postId: null, postTitle: '', postType: null })}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminContentListing;