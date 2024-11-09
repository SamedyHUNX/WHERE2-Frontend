import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";
import useAuth from "./../../hooks/useAuth";
import config from "./../../config";

const FollowButton = ({ targetUserId, currentUserId }) => {
  const { token } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null, // 'follow' or 'unfollow'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (token && targetUserId) {
      checkFollowStatus();
      getFollowersCount();
    }
  }, [targetUserId, token]);

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

  const handleFollowClick = () => {
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

    setConfirmDialog({
      open: true,
      type: isFollowing ? "unfollow" : "follow",
    });
  };

  const handleConfirmAction = async () => {
    setConfirmDialog({ open: false, type: null });
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

  const handleCloseDialog = () => {
    setConfirmDialog({ open: false, type: null });
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
        onClick={handleFollowClick}
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

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          {confirmDialog.type === "follow" ? "Follow User" : "Unfollow User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {confirmDialog.type === "follow"
              ? "Are you sure you want to follow this user?"
              : "Are you sure you want to unfollow this user?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            color={confirmDialog.type === "follow" ? "primary" : "secondary"}
            variant="contained"
            autoFocus
          >
            {confirmDialog.type === "follow" ? "Follow" : "Unfollow"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
