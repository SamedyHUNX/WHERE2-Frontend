import React, { useState, useEffect } from "react";
import { useFetchPhoto } from "../../hooks/useFetchPhoto";
import { LoadingSpinner } from "./Loading";
import { User } from "lucide-react";

const ProfilePicture = ({ userId, big = false, size = 8, onClick }) => {
  const { photoUrl, isLoading, error } = useFetchPhoto(userId);

  const containerClasses = `rounded-full overflow-hidden flex items-center justify-center ${
    big ? "w-24 h-24" : `w-${size} h-${size}`
  }`;

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <LoadingSpinner size={size} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerClasses} bg-red-100`}>
        <User size={big ? 48 : size * 2.5} className="text-black" />
      </div>
    );
  }

  return (
    <div className={containerClasses} onClick={onClick}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <User size={big ? 48 : size * 2.5} className="text-gray-500" />
      )}
    </div>
  );
};

export default ProfilePicture;
