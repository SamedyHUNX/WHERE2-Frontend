import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import config from "./../../config";
import axios from "axios";
import useAuth from "./../../hooks/useAuth";

const FollowButton = ({ targetUserId, currentUserId }) => {
  const { token } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Add token to dependencies array so the effect runs when token changes
  useEffect(() => {
    if (token && targetUserId) {
      checkFollowStatus();
      getFollowersCount();
    }
  }, [targetUserId, token]); // Add token as dependency

  const checkFollowStatus = async () => {
    if (!token) {
      setSnackbar({
        open: true,
        message: "Please log in to follow users",
        severity: "warning",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        config.follow.checkStatus(targetUserId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Follow Status Response:", response.data); // Debug log
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error.response || error);
      setSnackbar({
        open: true,
        message: "Error checking follow status",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFollowersCount = async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        config.follow.getFollowersCount(targetUserId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFollowersCount(response.data.results);
    } catch (error) {
      console.error("Error getting followers count:", error.response || error);
    }
  };

  const handleFollow = async () => {
    if (!token) {
      setSnackbar({
        open: true,
        message: "Please log in to follow users",
        severity: "warning",
      });
      return;
    }

    if (currentUserId === targetUserId) {
      setSnackbar({
        open: true,
        message: "Cannot follow yourself",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const url = config.follow.follow(endpoint, targetUserId);

      const response = await axios({
        method: isFollowing ? "DELETE" : "POST",
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setIsFollowing(!isFollowing);
      setFollowersCount((prevCount) =>
        isFollowing ? prevCount - 1 : prevCount + 1
      );

      setSnackbar({
        open: true,
        message: isFollowing
          ? "Unfollowed successfully"
          : "Following successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Error updating follow status. Please try again later.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Button
        variant={isFollowing ? "outlined" : "contained"}
        color="primary"
        onClick={handleFollow}
        disabled={isLoading || targetUserId === currentUserId}
        startIcon={isFollowing ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        sx={{
          width: "100%",
          borderRadius: 2,
          textTransform: "none",
          "&:hover": {
            backgroundColor: isFollowing ? "#ffebee" : undefined,
          },
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : targetUserId === currentUserId ? (
          "This is you"
        ) : isFollowing ? (
          "Following"
        ) : (
          "Follow"
        )}
      </Button>

      <Typography variant="body2" color="text.secondary">
        {followersCount} followers
      </Typography>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FollowButton;
