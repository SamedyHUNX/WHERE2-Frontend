import React, { useState, useEffect } from 'react';
import ListingComponent from "./ListingComponent";
import { User } from "lucide-react";
import config from './../../config';
import axios from 'axios';

const FollowersList = ({ userId }) => {
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFollowers = async () => {
        try {
          const { data: response } = await axios.get(config.follow.getFollowersCount(userId), {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          });
          
          if (response.status === 'success') {
            setFollowers(response.data.followers);
          } else {
            setError(response.message || 'Failed to fetch followers');
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Error fetching followers');
          console.error('Error:', err.response?.data || err.message);
        } finally {
          setLoading(false);
        }
      };
  
    useEffect(() => {
      if (userId) {
        fetchFollowers();
      }
    }, [userId]);
  
    // Axios instance with default config
    const axiosInstance = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  
    // Handle follow/unfollow action
    const handleFollowAction = async (targetUserId) => {
      try {
        const { data } = await axiosInstance.post(`/users/${targetUserId}/follow`);
        if (data.status === 'success') {
          // Refresh the followers list
          fetchFollowers();
        }
      } catch (err) {
        console.error('Follow action failed:', err.response?.data || err.message);
        // Handle error (you might want to show a notification here)
      }
    };
  
    if (loading) {
      return (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      );
    }
  
    const columns = ['userName', 'firstName', 'lastName', 'email', 'entity'];
    
    const actions = [
      {
        label: 'View Profile',
        icon: <User size={16} />,
        variant: 'primary',
        onClick: (id) => {
          window.location.href = `/profile/${id}`;
        },
      },
      {
        label: 'Follow Back',
        icon: <User size={16} />,
        variant: 'secondary',
        onClick: handleFollowAction,
        requiresConfirmation: true
      }
    ];
  
    const additionalStats = [
      {
        label: 'Active Followers',
        value: followers.filter(f => f.entity === 'active').length
      },
      {
        label: 'New This Month',
        value: followers.filter(f => {
          const followedDate = new Date(f.followedAt);
          const thisMonth = new Date();
          return followedDate.getMonth() === thisMonth.getMonth() &&
                 followedDate.getFullYear() === thisMonth.getFullYear();
        }).length
      }
    ];
  
    return (
      <ListingComponent
        title="Followers"
        data={followers}
        columns={columns}
        totalItems={followers.length}
        additionalStats={additionalStats}
        actions={actions}
      />
    );
  };
  
  export default FollowersList;