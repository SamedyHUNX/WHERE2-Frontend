import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import Dashboard from "./../../assets/svg/dashboard.svg";
import Menu from "./../../assets/svg/menu.svg";
import User from "./../../assets/svg/user.svg";
import Universities from "./../../assets/svg/universities.svg"
import Scholarships from "./../../assets/svg/scholarships.svg"
import Livelidhoods from "./../../assets/svg/livelihoods.svg"
import SideDashboard from "./../../assets/svg/dashboardSide.svg"
import ProfileSide from "./../../assets/svg/profileSide.svg"
import AboutUs from "./../../assets/svg/aboutus.svg"
import Bookmarks from "./../../assets/svg/bookmarks.svg"

import config from "../../config";

const MenuIcon = <img src={Menu} alt="Menu" />
const DashboardIcon = ({ username, entity }) => {
  const actualIdentifier = username || entity || "entity";
  const encodedIdentifier = encodeURIComponent(actualIdentifier);
  const dynamicDashboardUrl = `/dashboard/${encodedIdentifier}`;

  return (
    <Link to={dynamicDashboardUrl}>
      <img src={Dashboard} alt="Dashboard" />
    </Link>
  );
};

const UserIcon = <img src={User} alt="User" />;

// const MenuIconSide = <img src={Menu} alt="Menu" />;
const UniversitiesIconSide = <img src={Universities} alt="Universities" />;
const ScholarshipsIcon = <img src={Scholarships} alt="Scholarships" />;
const LivelihoodIcon = <img src={Livelidhoods} alt="Livelihoods" />;
const SideDashboardIcon = <img src={SideDashboard} alt="Dashboard" />;
const ProfileSideIcon = <img src={ProfileSide} alt="Profile" />;
const AboutUsIcon = <img src={AboutUs} alt="About Us" />;
const BookmarksIcon = <img src={Bookmarks} alt="Bookmarks" />;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [entity, setEntity] = useState("");

  const fetchUserDataAndRole = useCallback(async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      if (authData) {
        const { userName, entity, token } = authData;
        
        setUsername(userName || "");
        setEntity(entity || "");
        setIsLoggedIn(true);

        if (token) {
          const response = await fetch(config.auth.getUserRole, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.ok) {
            const data = await response.json();
            setShowDashboard(data.role === 'admin' || data.role === 'developer');
          } else {
            setShowDashboard(false);
          }
        }
      } else {
        setUsername("");
        setEntity("");
        setIsLoggedIn(false);
        setShowDashboard(false);
      }
    } catch (error) {
      console.error('Error fetching user data and role:', error);
      setIsLoggedIn(false);
      setShowDashboard(false);
    }
  }, []);

  useEffect(() => {
    fetchUserDataAndRole();
    const intervalId = setInterval(fetchUserDataAndRole, 600000);

    return () => clearInterval(intervalId);
  }, [fetchUserDataAndRole]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { logo: UniversitiesIconSide, name: "Universities", to: "/universities" },
    { logo: ScholarshipsIcon, name: "Scholarships", to: "/scholarships" },
    { logo: LivelihoodIcon, name: "Livelihood", to: "/livelihood" },
    { logo: BookmarksIcon, name: "Bookmarks", to: "/bookmarks" },
    { logo: SideDashboardIcon, name: "Dashboard", to: `/dashboard/${encodeURIComponent(username || entity)}` },
    { logo: ProfileSideIcon, name: "Profile", to: `/profile/${encodeURIComponent(username || entity)}` },
    { logo: AboutUsIcon, name: "About Us", to: "/about-us" },
  ];

  const identifier = username || entity;
  const encodedIdentifier = encodeURIComponent(identifier);

  return (
    <>
      <nav className="bg-gray-100 h-[64px] w-full fixed top-0 left-0 right-0 z-[1002]">
        <div className="flex justify-between gap-x-10 items-center px-4 py-3 h-full sm:hidden m-auto lg:w-9/12">
          <Link to="/" className="text-xl font-bold">WHERE2</Link>
          <div className="flex align-center justify-between h-full lg:w-9/12">
            {menuItems.map((item) => (
              <Link key={item.name} to={item.to} className="flex my-[6px] mx-0 whitespace-nowrap text-gray-700 hover:text-gray-900 h-full">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            {showDashboard && <DashboardIcon username={username} entity={entity} />}
            <button className="p-2 rounded-full hover:bg-gray-300" aria-label="Profile">
              {isLoggedIn ? <Link to={`/profile/${encodedIdentifier}`}>{UserIcon}</Link> : <Link to="/login">{UserIcon}</Link>}
            </button>
          </div>
        </div>

        <div className="sm:flex lg:hidden justify-between items-center px-4 py-3 h-full w-full">
          <Link to="/" className="text-xl font-bold">WHERE2</Link>
          <button onClick={toggleMenu} className="p-2 rounded-md hover:bg-gray-300">
            {isOpen ? <X size={20} /> : MenuIcon}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="lg:hidden fixed inset-y-0 right-0 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform translate-x-0 z-[1003]">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <button onClick={toggleMenu} className="p-2 rounded-md hover:bg-gray-300 float-right" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={toggleMenu}
                >
                  {item.logo}
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
              {showDashboard && (
                <Link
                  to={`/dashboard/${encodedIdentifier}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={toggleMenu}
                >
                  {SideDashboardIcon}
                  <span className="ml-2">Dashboard</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;