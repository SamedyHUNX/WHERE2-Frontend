import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoadingOverlay } from "./../../../reusable/Loading";
import useAuth from "./../../../../hooks/useAuth";
import FetchProfile from "./../../../reusable/functions/ViewProfile";
import PublicProfile from "./../../../reusable/PublicProfile";

const VisitProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams();
  const { isLoggedIn, userId: currentUserId, role, loading, token } = useAuth();

  // Use paramUserId if it's present, otherwise fall back to currentUserId
  const targetUserId = paramUserId || currentUserId;

  useEffect(() => {
    const loadProfile = async () => {
      if (!isLoggedIn) {
        setError("User is not logged in");
        return;
      }

      // Permission check: If paramUserId exists and it's not the current user's ID, and the user isn't a developer
      if (!paramUserId) {
        setError("No such user found.");
      }

      try {
        const authData = JSON.parse(localStorage.getItem("authData"));
        if (!authData || !authData.token) {
          throw new Error("No valid authentication token found");
        }

        // Fetch profile using targetUserId (which will be paramUserId or currentUserId)
        const data = await FetchProfile(targetUserId, authData.token);
        setUserData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (!loading) {
      loadProfile();
    }
  }, [isLoggedIn, currentUserId, paramUserId, role, loading, targetUserId]);

  useEffect(() => {
    // Redirect to login if there's an error or user is not logged in
    if (error || (!loading && !isLoggedIn)) {
      console.error("Redirecting due to error or not logged in:", error);
      setTimeout(() => {
        // Redirect to login page if there's an error or user is not logged in
        navigate("/login", { replace: true });
      });
    }
  }, [error, isLoggedIn, loading, navigate]);

  // Show loading spinner if still loading or user data is not yet available
  if (loading || !userData) {
    return <LoadingOverlay message="We are fetching the profile for you..." />;
  }

  return (
    <>
      <PublicProfile userInfo={userData} />
    </>
  );
};

export default VisitProfile;
