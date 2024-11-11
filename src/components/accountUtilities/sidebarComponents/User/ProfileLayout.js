import React, { useState, createContext, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { LoadingOverlay } from "./../../../reusable/Loading";

export const SidebarContentContext = createContext();

const ProfileLayout = ({
  // Required props
  sidebarComponent: Sidebar,
  contentComponents,
  defaultContent = "account",
  userData,
  userRole,
  
  // Optional props
  isPublic = false,
  mobileBreakpoint = 980,
  sidebarWidth = "w-64",
  loading = false,
  loadingMessage = "Loading...",
  persistContentKey = "sidebarContent",
  
  // Optional render props
  renderError,
  renderLoading,
}) => {
  const [sidebarContent, setSidebarContent] = useState(() => {
    return localStorage.getItem(persistContentKey) || defaultContent;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const newIsMobile = window.innerWidth < mobileBreakpoint;
      setIsMobile(newIsMobile);
      setSidebarOpen(!newIsMobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [mobileBreakpoint]);

  useEffect(() => {
    if (sidebarContent !== "logOut" && persistContentKey) {
      localStorage.setItem(persistContentKey, sidebarContent);
    }
  }, [sidebarContent, persistContentKey]);

  if (loading) {
    return renderLoading ? (
      renderLoading()
    ) : (
      <LoadingOverlay isFullScreen={true} message={loadingMessage} />
    );
  }

  if (!userRole && !isPublic) {
    return renderError ? (
      renderError()
    ) : (
      <div>Error: Could not fetch user role</div>
    );
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
          ${sidebarOpen ? sidebarWidth : "w-0"} 
          ${isMobile ? "top-0 left-0 h-full z-30" : ""}`}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => isMobile && setSidebarOpen(false)}
            userRole={userRole}
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
              <ContentComponent userInfo={userData} className="h-full" />
            </div>
          </div>
        </div>
      </SidebarContentContext.Provider>
    </div>
  );
};

export default ProfileLayout;