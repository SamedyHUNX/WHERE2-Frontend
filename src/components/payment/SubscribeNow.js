import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './../../config';
import useAuth from '../../hooks/useAuth';
import ButtonComponent from '../reusable/Button';
import { LoadingOverlay } from './../reusable/Loading';


const SubscribeNow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const { isLoggedIn, username, userId, entity, role, token } = useAuth();

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      console.log('Subscribe attempted without login:', { isLoggedIn });
      setError('Please log in to subscribe.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(config.payment.createSubscription, {
        planId: '1', // Replace with your actual plan ID
        userId,
        username,
        entity,
        role
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSubscriptionId(response.data.subscriptionID);
    } catch (err) {
      console.error('Subscription error:', err);
      setError('Failed to create subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay message="Creating subscription..."/>;
  }

  if (!isLoggedIn || !token) {
    console.log('Rendering login message:', { isLoggedIn, token: !!token });
    return <p className="text-red-500">Please log in to subscribe.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Subscribe Now</h2>
      {username ? <p className="mb-4">Logged in as: {username}</p> : <p className="mb-4">Entity: {entity}</p>}
      <p className="mb-4">Role: {role}</p>
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      {subscriptionId ? (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p className="font-bold">Subscription created successfully!</p>
          <p>Your subscription ID is: {subscriptionId}</p>
        </div>
      ) : (
        <ButtonComponent 
          onClick={handleSubscribe} 
          disabled={loading}
          variant="primary"
          size="medium"
          fullWidth={true}
        >
          {loading ? 'Processing...' : 'Subscribe Now'}
        </ButtonComponent>
      )}
    </div>
  );
};

export default SubscribeNow;