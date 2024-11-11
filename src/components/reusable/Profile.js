import React, { useState, createContext, useEffect } from "react";
import Sidebar from "./../accountUtilities/Sidebar.js";
import UniversityListing from "./../accountUtilities/sidebarComponents/Developer/UniversityListing.js";
import AccommodationListing from "./../accountUtilities/sidebarComponents/Developer/AccommodationListing.js";
import UserListing from "./../accountUtilities/sidebarComponents/Developer/UsersListing.js";
import PartTimeJobListing from "./../accountUtilities/sidebarComponents/Developer/PartTimeJobListing.js";
import UserAccount from "./../../pages/UserAccount.js";
import useAuth from "./../../hooks/useAuth";
import { LoadingOverlay } from "./Loading.js";
import { ChevronRight } from "lucide-react";
import AdminDashboard from "./../accountUtilities/sidebarComponents/Admin/Dashboard.js";
import AdminContent from "./../accountUtilities/sidebarComponents/Admin/AdminContent.js";
import Logout from "./Logout.js";
import CollectionPanel from "./CollectionPanel.js";
import SettingPanel from "./../SettingPanel.js";
import adminContentListing from "./../accountUtilities/sidebarComponents/Admin/AdminContentListing.js";
import DiscussionList from "./../community/DiscussionList.js";

export const SidebarContentContext = createContext();

const contentComponents = {
  schoolList: UniversityListing,
  account: UserAccount,
  userList: UserListing,
  jobList: PartTimeJobListing,
  adminContentListing: adminContentListing,
  accommodationList: AccommodationListing,
  adminDashboard: AdminDashboard,
  adminContent: AdminContent,
  logOut: ({ userInfo }) => {
    // Clear sidebarContent from localStorage when rendering Logout component
    localStorage.removeItem("sidebarContent");
    return <Logout userInfo={userInfo} />;
  },
  collectionPanel: CollectionPanel,
  setting: SettingPanel,
  discussionListing: DiscussionList,
};

const Profile = ({ userData, isPublic }) => {
  const [sidebarContent, setSidebarContent] = useState(() => {
    return localStorage.getItem("sidebarContent") || "account";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { role, loading } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      const newIsMobile = window.innerWidth < 980;
      setIsMobile(newIsMobile);
      setSidebarOpen(!newIsMobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (sidebarContent !== "logOut") {
      localStorage.setItem("sidebarContent", sidebarContent);
    }
  }, [sidebarContent]);

  if (loading) {
    return (
      <LoadingOverlay
        isFullScreen={true}
        message="We are fetching the profile..."
      />
    );
  }

  if (!role && !isPublic) {
    return <div>Error: Could not fetch user role</div>;
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const ContentComponent = contentComponents[sidebarContent] || (() => null);

  return (
    <div className="flex w-full h-full min-h-[100vh] relative">
      <SidebarContentContext.Provider value={setSidebarContent}>
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out h-full
          ${isMobile ? "absolute" : "relative"} 
          ${sidebarOpen ? "w-64" : "w-0"} 
          ${isMobile ? "top-0 left-0 h-full z-30" : ""}`}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => isMobile && setSidebarOpen(false)}
            userRole={role}
          />
        </div>

        {/* Backdrop for mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 h-full"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div
          className={`flex-grow overflow-y-scroll min-h-[100vh] ${
            isMobile ? "relative z-10" : ""
          }`}
        >
          <div className="sm:pb-[16px] h-full min-h-[100vh]">
            <div className="px-4 h-full min-h-screen">
              {isMobile && !sidebarOpen && (
                <button
                  onClick={toggleSidebar}
                  className="fixed left-6 z-20 p-3 text-black bg-white rounded-full shadow-md"
                >
                  <ChevronRight size={24} />
                </button>
              )}
              {sidebarContent !== "account" &&
              sidebarContent !== "setting" &&
              sidebarContent !== "logOut" &&
              sidebarContent !== "userList" &&
              sidebarContent !== "schoolList" &&
              sidebarContent !== "jobList" &&
              sidebarContent !== "adminContent" &&
              sidebarContent !== "adminContentListing" &&
              sidebarContent !== "accommodationList" &&
              sidebarContent !== "adminDashboard" &&
              sidebarContent !== "messageListing" &&
              sidebarContent !== "discussionListing" ? (
                <CollectionPanel category={sidebarContent} className="h-full" />
              ) : (
                <ContentComponent userInfo={userData} className="h-full" />
              )}
            </div>
          </div>
        </div>
      </SidebarContentContext.Provider>
    </div>
  );
};

export default Profile;
