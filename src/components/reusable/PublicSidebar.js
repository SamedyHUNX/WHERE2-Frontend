import React, { useState } from "react";
import ButtonComponent from "./Button";
import FollowButton from "./FollowButton";
import { useParams } from "react-router-dom";
import { User, MessageSquareText } from "lucide-react";

const ProfileSidebar = ({ userInfo }) => {
  const { userId: targetUserId } = useParams();
  const { userId: currentUserId } = { userId: "123" };
  const [activeTab, setActiveTab] = useState("profile");

  // Define components for each tab
  const TabComponents = {
    profile: () => <div className="space-y-4"></div>,
    posts: () => (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Posts</h2>
      </div>
    ),
  };

  const menuItems = [
    { icon: <User size={20} />, label: "Profile Overview", id: "profile" },
    { icon: <MessageSquareText size={20} />, label: "Posts", id: "posts" },
  ];

  // Get the current component based on active tab
  const CurrentTabComponent = TabComponents[activeTab] || TabComponents.profile;

  return (
    <div className="flex w-full h-full">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-white shadow-lg rounded-lg pt-8 pb-8 px-4 space-y-6 fixed">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={40} className="text-blue-600" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="font-semibold text-lg">
              {userInfo?.firstName} {userInfo?.lastName}
            </h2>
            <p className="text-sm text-gray-500">
              @{userInfo?.userName || userInfo?.entity || "username"}
            </p>
          </div>
        </div>

        <FollowButton
          targetUserId={targetUserId}
          currentUserId={currentUserId}
        />

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              {React.cloneElement(item.icon, {
                className:
                  activeTab === item.id ? "text-blue-600" : "text-gray-500",
              })}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <ButtonComponent className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow">
          Message
        </ButtonComponent>
      </div>

      {/* Main Content Area */}
      <div className="ml-72 flex-1 p-8">
        <CurrentTabComponent />
      </div>
    </div>
  );
};

export default ProfileSidebar;
