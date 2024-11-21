import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, MessageSquareText, ChevronRight, Rss } from 'lucide-react';
import ButtonComponent from './Button';
import { LoadingOverlay } from './Loading';
import useIsMobile from './../../hooks/useIsMobile';
import useAuth from './../../hooks/useAuth';
import Navbar from './Navbar';
import FollowButton from './FollowButton';
import ProfilePicture from './PictureUpload';
import FloatingContact from './FloatingContact';
import config from './../../config';
import axios from 'axios';
import DiscussionList from './../community/DiscussionList';
import MessagesContent from './MessageContent';

const PublicProfilePage = ({ userInfo }) => {
    const { userId: targetUserId } = useParams();
    const { userId: currentUserId } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isMobile } = useIsMobile();
    const [ showMessages, setShowMessages ] = useState(false);
  
    const formattedDate = new Date(
      userInfo?.createdAt || new Date()
    ).toLocaleDateString("en-CA");
  
    const menuItems = [
      { icon: <User size={20} />, label: "Profile Overview", id: "profile" },
      { icon: <Rss size={20} />, label: "Posts", id: "posts" },
      { icon: <MessageSquareText size={20} />, label: "Messages", id: "messages" },
    ];
  
    const MainProfileContent = () => (
      <div className="p-8 pl-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center space-y-6 pb-8 border-b border-gray-200">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
            <ProfilePicture big={true} userId={targetUserId} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {userInfo?.firstName} {userInfo?.lastName}
            </h1>
            {userInfo?.entity && (
              <p className="text-gray-500 mt-1">{userInfo.entity}</p>
            )}
          </div>
        </div>
  
        {/* Profile Information Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
  {[
    { label: "Bio", value: userInfo?.bio ? userInfo.bio : "Not provided" },
    { label: "Email", value: userInfo?.email },
    { label: "First Name", value: userInfo?.firstName },
    { label: "Last Name", value: userInfo?.lastName },
    { label: "Username or Entity name", value: userInfo?.userName ? userInfo.userName : userInfo?.entity ? userInfo.entity : 'Not provided' },
    { label: "Gender", value: userInfo?.gender ? userInfo.gender : "Not specified" },
    { 
      label: "Date of Birth", 
      value: userInfo?.dateOfBirth 
        ? new Date(userInfo.dateOfBirth).toLocaleDateString("en-CA") 
        : "Not provided" 
    },
    { label: "Phone Number", value: userInfo?.phoneNumber },
    { label: "Location", value: userInfo?.location },
    { 
      label: "Account Creation Date", 
      value: formattedDate || "Not provided" 
    }
  ].map((field) => (
    <div key={field.label} className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
      </label>
      <div className="p-4 bg-gray-50 rounded-lg text-gray-500 tracking-tight">
        {field.value}
      </div>
    </div>
  ))}
</div>
  
        {/* Account Status */}
        <div className="mt-6">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full ${
              userInfo?.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                userInfo?.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {userInfo?.isActive ? "Active Account" : "Inactive Account"}
          </div>
        </div>
      </div>
    );
  
    const PostsContent = () => (
      <div className="p-2">
        <h2 className="text-2xl font-bold mt-4 mb-6 underline mx-4 tracking-tight">All Posts from this user</h2>
        <DiscussionList userId={targetUserId}/>
      </div>
    );
  
    const TabComponents = {
      profile: MainProfileContent,
      posts: PostsContent,
      messages: () => <MessagesContent targetUserId={targetUserId}/>
    };
  
    const CurrentTabComponent = TabComponents[activeTab] || TabComponents.profile;
  
    // Updated sidebar classes to handle mobile transitions
    const sidebarClasses = isMobile
      ? `fixed left-0 top-0 h-full bg-white w-[50vw] z-40 w-64 shadow-lg transform mt-[64px] shadow-md
         ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
         transition-transform duration-300 ease-in-out pt-16 px-4`
      : "w-[25vw] h-screen bg-white shadow-lg rounded-lg pt-8 pb-8 px-4 space-y-8";
  
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 mt-[64px]">
          {/* Mobile Toggle Button */}
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="fixed top-24 left-6 z-20 p-3 text-black bg-white rounded-full shadow-md"
            >
              <ChevronRight 
                size={36}
                className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ease-in-out ${
                  isSidebarOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
  
          {/* Mobile Sidebar Overlay */}
          {isMobile && isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
  
          <div className="flex">
            {/* Sidebar - Now always rendered but transformed off-screen on mobile when closed */}
            <div className={sidebarClasses}>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={36}/>
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
  
              <FollowButton targetUserId={targetUserId} currentUserId={currentUserId} />
  
              <nav className="space-y-2 mt-6">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (isMobile) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-cyan-100 text-black shadow-sm"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {React.cloneElement(item.icon, {
                      className:
                        activeTab === item.id ? "text-black" : "text-gray-500",
                    })}
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
  
              {/* <ButtonComponent
              className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setActiveTab('messages')} // Update to switch to messages tab
            >
              Message
            </ButtonComponent> */}
            </div>
  
            {/* Main Content - Adjusted margin for mobile */}
            <div className={`flex-1 ${isMobile ? "ml-0" : "ml-3"} p-2 pl-3`}>
              <div className="bg-white rounded-lg shadow-sm">
                <CurrentTabComponent />
              </div>
            </div>
          </div>
        </div>
        <FloatingContact />
      </>
    );
  };
  
  const PublicProfileContainer = () => {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(config.profile.getPublicProfile(userId));
          setUserInfo(response.data.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      if (userId) {
        fetchUserData();
      }
    }, [userId]);
  
    if (loading) {
      return (
        <LoadingOverlay isFullScreen={true} message='We are fetching the profile...'/>
      );
    }
  
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center text-red-600">
            <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
            <p>{error}</p>
          </div>
        </div>
      );
    }
  
    return <PublicProfilePage userInfo={userInfo} />;
  };
  
  export default PublicProfileContainer;