import React, { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import config from "./../../config";
import useAuth from "./../../hooks/useAuth";

const FollowButton = ({ targetUserId, currentUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { token } = useAuth();

  useEffect(() => {
    checkFollowStatus();
    getFollowersCount();
  }, [targetUserId]);

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`/api/follow/check/${targetUserId}`);
      const data = await response.json();
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const getFollowersCount = async () => {
    try {
      const response = await fetch(`/api/follow/count/${targetUserId}`);
      const data = await response.json();
      setFollowersCount(data.count);
    } catch (error) {
      console.error("Error getting followers count:", error);
    }
  };

  const handleFollow = async () => {
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
      const url = config.follow.follow(endpoint, targetUserId); // Correct API URL

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Authorization header
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to update follow status");

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
        message: "Error updating follow status. Please try again later.",
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
        disabled={isLoading}
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
