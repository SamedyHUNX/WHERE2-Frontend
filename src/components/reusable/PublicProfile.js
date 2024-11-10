import React, { useState } from "react";
import FormInput from "./../../components/reusable/InputField";
import { LoadingOverlay } from "../../components/reusable/Loading";
import ProfilePicture from "./PictureUpload";
import { useParams } from "react-router-dom";
import Navbar from "./../../components/reusable/Navbar";
import FloatingContact from "./FloatingContact";
import PublicSidebar from "./PublicSidebar";
import { ChevronRight } from "lucide-react";
import useIsMobile from "./../../hooks/useIsMobile";

const PublicProfile = ({ userInfo }) => {
  const { userId } = useParams();
  const { loading } = { loading: false }; // Mock useAuth
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMobile } = useIsMobile();

  if (loading) {
    return (
      <LoadingOverlay
        isFullScreen={true}
        message="We are fetching the public profile..."
      />
    );
  }

  const formattedDate = new Date(
    userInfo?.createdAt || new Date()
  ).toLocaleDateString("en-CA");

  const sidebarClasses = isMobile
    ? `fixed left-0 top-0 h-full bg-white z-40 w-64 shadow-lg transform 
       ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
       transition-transform duration-300 ease-in-out pt-16`
    : "hidden lg:block lg:w-1/4";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 mt-[64px]">
        {/* Mobile Toggle Button */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed  top-[12vh] left-8 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-transform duration-200 ease-in-out"
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
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 py-8">
            {/* Sidebar */}
            <div className={sidebarClasses}>
              <PublicSidebar userInfo={userInfo} />
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-lg shadow-sm">
              <div className="p-8">
                {/* Profile Header */}
                <div className="flex flex-col items-center space-y-6 pb-8 border-b border-gray-200">
                  <ProfilePicture big={true} userId={userId} />
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
                  <FormInput
                    label="Bio"
                    value={
                      userInfo?.bio ||
                      "This user does not seem to have set any bio..."
                    }
                    placeholder="Tell everyone about yourself..."
                    className="p-4"
                    rounded
                    disabled
                  />
                </div>

                {/* Profile Information Grid */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="First Name"
                    value={userInfo?.firstName}
                    className="p-4"
                    disabled
                    rounded
                  />
                  <FormInput
                    label="Last Name"
                    value={userInfo?.lastName}
                    className="p-4"
                    disabled
                    rounded
                  />
                  <FormInput
                    label="Email"
                    value={userInfo?.email}
                    type="email"
                    className="p-4"
                    disabled
                    rounded
                  />
                  <FormInput
                    label="Phone Number"
                    value={userInfo?.phoneNumber}
                    type="tel"
                    className="p-4"
                    disabled
                    rounded
                  />
                  <FormInput
                    label="Location"
                    value={userInfo?.location}
                    className="p-4"
                    disabled
                    rounded
                  />
                  <FormInput
                    label="Account Creation Date"
                    value={formattedDate}
                    className="p-4"
                    disabled
                    rounded
                  />
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
            </div>
          </div>
        </div>
      </div>
      <FloatingContact />
    </>
  );
};

export default PublicProfile;
