import React, { useState, useEffect } from "react";
import ButtonComponent from "./Button";
import { User, Building2, GraduationCap, Heart, Users } from "lucide-react";

import FollowButton from "./FollowButton";
import useAuth from "./../../hooks/useAuth";
import { useParams } from "react-router-dom";

const ProfileSidebar = ({ userInfo }) => {
  const { userId: targetUserId } = useParams();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
  });

  const { userId: currentUserId } = useAuth();

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await fetch(`/api/users/${targetUserId}`);
  //       const data = await response.json();
  //       setUserData(data);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, [targetUserId]);

  const menuItems = [
    { icon: <User size={20} />, label: "Profile Overview", isActive: true },
    { icon: <Building2 size={20} />, label: "Universities" },
    { icon: <GraduationCap size={20} />, label: "Scholarships" },
    { icon: <Heart size={20} />, label: "Health" },
    { icon: <Users size={20} />, label: "Community" },
  ];

  return (
    <div className="w-full h-full max-h-[1166px] bg-white shadow-lg rounded-lg pt-16 pb-8 px-6 mt-16 space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <h2 className="font-semibold text-lg">
            {userInfo.firstName} {userInfo.lastName}
          </h2>
          <p className="text-sm text-gray-500">
            @{userInfo.userName ? userInfo.userName : userInfo.entity}
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="font-semibold">150</p>
        <p className="text-sm text-gray-500">Connections</p>
      </div>

      <FollowButton targetUserId={targetUserId} currentUserId={currentUserId} />

      <nav className="space-y-6">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              item.isActive
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </a>
        ))}
      </nav>

      <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Message
      </button>
    </div>
  );
};

export default ProfileSidebar;
