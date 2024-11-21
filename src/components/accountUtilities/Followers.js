import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'
import config from '../../config'
import FollowCard from '../reusable/FollowCard'
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Skeleton, 
  Divider, 
  IconButton, 
  InputAdornment, 
  TextField,
  Tabs,
  Tab,
  Alert,
  AlertTitle
} from '@mui/material'
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'

const FollowersFollowing = () => {
  const [activeTab, setActiveTab] = useState('followers');
  const [followData, setFollowData] = useState({
    followers: [],
    followings: []
  });
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { userId } = useAuth();

  const fetchFollowData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(config.follow.getFollowersCount(userId));
      const { followers = [], followings = [] } = response.data.data || {};
      
      setFollowData({ followers, followings });
      updateFilteredData(activeTab, followers, followings, searchTerm);
    } catch (error) {
      setError(error.message || 'Failed to fetch follow data');
      console.error('Error fetching follow data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilteredData = (tab, followers, followings, search) => {
    const dataToFilter = tab === 'followers' ? followers : followings;
    const filtered = dataToFilter.filter((item) => {
      const searchText = search.toLowerCase();
      const name = (item.userName || item.entity || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      return name.includes(searchText) || email.includes(searchText);
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
    if (userId) {
      fetchFollowData();
    }
  }, [userId]);

  useEffect(() => {
    updateFilteredData(
      activeTab, 
      followData.followers, 
      followData.followings, 
      searchTerm
    );
  }, [searchTerm, activeTab, followData]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    fetchFollowData();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <AlertTitle>Error</AlertTitle>
        {error}
        <Box sx={{ mt: 1 }}>
          <IconButton size="small" onClick={handleRefresh} color="inherit">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Alert>
    );
  }

  const LoadingSkeleton = () => (
    <Box sx={{ mt: 2 }}>
      {[1, 2, 3].map((index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="full">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2 
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
          >
            <Tab 
              value="followers" 
              label={`Followers (${followData.followers.length})`} 
            />
            <Tab 
              value="followings" 
              label={`Following (${followData.followings.length})`} 
            />
          </Tabs>
          <IconButton onClick={handleRefresh} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredData.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="textSecondary">
              {searchTerm 
                ? `No ${activeTab} found matching your search` 
                : `No ${activeTab} yet`
              }
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredData.map((item, index) => (
              <React.Fragment key={item.userId}>
                <FollowCard
                  userId={item.userId}
                  profile={item.profilePictureUrl}
                  name={item.userName || item.entity}
                  userEmail={item.email}
                  userBio={item.bio || "This user does not have a bio"}
                  followedAt={item.followedAt}
                  activeTab={activeTab}
                />
                {index < filteredData.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FollowersFollowing;