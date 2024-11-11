import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, MessageSquareText, ChevronRight } from 'lucide-react';
import useIsMobile from './../../hooks/useIsMobile';
import useAuth from './../../hooks/useAuth';
import Navbar from './Navbar';
import FollowButton from './FollowButton';
import ProfilePicture from './PictureUpload';

const PublicProfilePage = ({ userInfo }) => {
    const { userId: targetUserId } = useParams();
    const { userId: currentUserId } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isMobile } = useIsMobile();
  
    const formattedDate = new Date(
      userInfo?.createdAt || new Date()
    ).toLocaleDateString("en-CA");
  
    const menuItems = [
      { icon: <User size={20} />, label: "Profile Overview", id: "profile" },
      { icon: <MessageSquareText size={20} />, label: "Posts", id: "posts" },
    ];
  
    const MainProfileContent = () => (
      <div className="p-8">
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
  
        {/* Bio Section */}
        <div className="mt-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <div className="p-4 bg-gray-50 rounded-lg">
              {userInfo?.bio || "This user does not seem to have set any bio..."}
            </div>
          </div>
        </div>
  
        {/* Profile Information Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "First Name", value: userInfo?.firstName },
            { label: "Last Name", value: userInfo?.lastName },
            { label: "Email", value: userInfo?.email },
            { label: "Phone Number", value: userInfo?.phoneNumber },
            { label: "Location", value: userInfo?.location },
            { label: "Account Creation Date", value: formattedDate }
          ].map((field) => (
            <div key={field.label} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <div className="p-4 bg-gray-50 rounded-lg">
                {field.value || "Not provided"}
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
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Posts</h2>
        {/* Add posts content here */}
      </div>
    );
  
    const TabComponents = {
      profile: MainProfileContent,
      posts: PostsContent,
    };
  
    const CurrentTabComponent = TabComponents[activeTab] || TabComponents.profile;
  
    const sidebarClasses = isMobile
      ? `fixed left-0 top-0 h-full bg-white z-40 w-64 shadow-lg transform 
         ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
         transition-transform duration-300 ease-in-out pt-16`
      : "w-64 h-screen bg-white shadow-lg rounded-lg pt-8 pb-8 px-4 space-y-6";
  
    return (
        <>
        <Navbar/>
        <div className="min-h-screen bg-gray-50 mt-[96px]">
        {/* Mobile Toggle Button */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed top-20 left-8 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-transform duration-200 ease-in-out"
            style={{
              transform: isSidebarOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <ChevronRight className="w-8 h-8 text-gray-600" />
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
          {/* Sidebar */}
          <div className={sidebarClasses}>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <User/>
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
  
            <FollowButton targetUserId={targetUserId} currentUserId={currentUserId}/>
  
            <nav className="space-y-2 mt-6">
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
  
            <button className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Message
            </button>
          </div>
  
          {/* Main Content */}
          <div className={`flex-1 ${isMobile ? "ml-0" : "ml-8"}`}>
            <div className="bg-white rounded-lg shadow-sm">
              <CurrentTabComponent />
            </div>
          </div>
        </div>
      </div>
        </>
    );
  };
  
  export default PublicProfilePage;