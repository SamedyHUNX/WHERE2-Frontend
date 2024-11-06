import React, {useEffect} from "react";
import { Alert } from "@mui/material";
import { Edit2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useFetchPhoto, useUploadPhoto } from "./../../hooks/useFetchPhoto";
import { LoadingOverlay } from "./Loading";

const MAX_FILE_SIZE = 500 * 1024;

const PictureUpload = () => {
  const { userId } = useAuth();
  const { photoUrl, isLoading, error, fetchPhoto } = useFetchPhoto(userId);
  const { uploadPhoto, isUploading, uploadError } = useUploadPhoto(userId);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // CHECK FILE SIZE BEFORE UPLOADING
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File size exceeds the maximum allowed (500 KB).");
      return;
    }

    const newPhotoUrl = await uploadPhoto(selectedFile, "profile-picture");
    if (newPhotoUrl) {
      fetchPhoto();
    }
  };

  useEffect(() => {
    if (photoUrl) {
      console.log("Photo URL updated:", photoUrl);
    }
  }, [photoUrl]);

  if (isLoading) {
    return <LoadingOverlay message="We are fetching your profile picture." />;
  }

  if (isUploading) {
    return <LoadingOverlay message="We are uploading your profile picture." />;
  }

  if (!userId) {
    return (
      <div className="text-red-500">
        User ID not found. Please log in again.
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={`${photoUrl || "/default-profile.jpg"}?t=${Date.now()}`} // Cache busting
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover"
        onError={(e) => {
          e.target.src = "/default-profile.jpg";
        }}
      />
      <label
        htmlFor="profile-upload"
        className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer"
      >
        <Edit2 size={16} />
      </label>
      <input
        id="profile-upload"
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <div className="loader"></div>
        </div>
      )}
      {(error || uploadError) && (
        <div className="absolute inset-x-0 -bottom-6 text-red-500 text-xs text-center">
          {error || uploadError}
        </div>
      )}
    </div>
  );
};

export default PictureUpload;
