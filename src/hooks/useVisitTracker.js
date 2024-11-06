import { useState, useEffect } from 'react';
import config from './../config';
import axios from 'axios';

// CUSTOMED HOOK USED TO RECORD NUMBER OF VISITS EACH DAY TO A LOCATION
const useVisitTracker = (path, config) => {
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackVisit = async () => {
      try {

        await axios.post(config.user.visitorTrack, { path }, {
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (error) {
        console.error('Error tracking visit:', error.message, error.config);
        setError("Failed to track visit");
      }
    };

    const fetchVisits = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const response = await axios.get(config.user.visits, {
          params: { path, startDate: today, endDate: today }
        });
        
        
        if (response.data.success) {
          setVisits(response.data.visits || []);
        }
      } catch (error) {
        console.error('Error fetching visits:', error.message, error.config);
        setError("Failed to fetch visits");
      } finally {
        setLoading(false);
      }
    };

    trackVisit();
    fetchVisits();
  }, [path, config.user.visitorTrack, config.user.visits]);

  return { visits, error, loading };
};

export default useVisitTracker;