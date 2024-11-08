import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { MessageCircleMore, LucideMessageCircleQuestion } from "lucide-react";
import Menu from "./../../assets/svg/menu.svg";
import useAuth from "./../../hooks/useAuth";
import ProfilePicture from "./PictureUpload";
import ButtonComponent from "./Button";
import TypewriterEffect from "./../../styles/TypeWriterEffect";

import {
  School,
  BookOpenTextIcon,
  LucideBriefcaseBusiness,
  User2,
  Activity,
  ChartNoAxesCombinedIcon,
} from "lucide-react";
import NavButton from "./NavButton/NavButton";

const MenuIcon = <img src={Menu} alt="Menu Item" />;

const DashboardIcon = ({ username, entity }) => {
  const actualIdentifier = username || entity || "entity";
  const encodedIdentifier = encodeURIComponent(actualIdentifier);
  const dynamicDashboardUrl = `/dashboard/${encodedIdentifier}`;
  return (
    <Link to={dynamicDashboardUrl}>
      <ChartNoAxesCombinedIcon />
    </Link>
  );
};

const Navbar = ({ isBanner }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, username, entity, showDashboard, userId } = useAuth();

  if (isBanner) {
    return (
      <nav
        className="w-full flex justify-center items-center"
        style={{
          background:
            "linear-gradient(to right, rgba(224, 245, 255, 0.5), rgba(156, 222, 255, 0.5))",
        }}
      >
        <Link
          to="/"
          className="text-5xl font-bold tracking-tighter pt-8"
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            src="https://i.imgur.com/Y0bNhPM.png"
            width={80}
            height={80}
            alt="Logo"
          />
          <span
            style={{
              background: "linear-gradient(to right, #343434, #64737b)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              display: "inline",
              letterSpacing: "3px",
            }}
          >
            <TypewriterEffect text={"WHERE2"} />
          </span>
        </Link>
      </nav>
    );
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      logo: <School />,
      name: "Universities",
      to: "/list/university",
      showMobile: true,
    },
    {
      logo: <BookOpenTextIcon />,
      name: "Scholarships",
      to: "/list/scholarship",
      showMobile: true,
    },
    {
      logo: <LucideBriefcaseBusiness />,
      name: "Livelihood",
      to: "/livelihood",
      showMobile: true,
    },
    { logo: <Activity />, name: "Health", to: "/health", showMobile: true },
    {
      logo: <MessageCircleMore />,
      name: "Community",
      to: "/discussions",
      showMobile: true,
    },
    {
      logo: <User2 />,
      name: "Profile",
      to: `${
        isLoggedIn
          ? `/profile/${encodeURIComponent(username || entity)}`
          : "/login"
      }`,
      showMobile: true,
      showDesktop: false,
    },
    {
      logo: <LucideMessageCircleQuestion />,
      name: "About Us",
      to: "/about-us",
    },
  ];

  const identifier = username || entity;
  const encodedIdentifier = encodeURIComponent(identifier);

  return (
    <>
      <nav className="bg-gray-100 h-[64px] w-full fixed top-0 left-0 right-0 z-[1002]">
        <div className="flex items-center justify-between h-full px-4 py-3 m-auto sm:hidden gap-x-10 lg:w-10/12 max-w-[1440px] mx-auto">
          <Link
            to="/"
            className="text-xl font-bold tracking-tighter hover:text-cyan-500"
          >
            WHERE2
          </Link>
          <div className="flex align-center justify-between h-full mx-auto lg:w-[800px] tracking-tighter">
            {menuItems
              .filter((item) => item.showDesktop !== false)
              .map((item) => (
                <NavButton key={item.name} linkTo={item.to} name={item.name} />
              ))}
          </div>
          <div className="flex items-center space-x-4 hover:text-cyan-500">
            {showDashboard && (
              <DashboardIcon username={username} entity={entity} />
            )}
            {isLoggedIn ? (
              <Link to={`/profile/${encodedIdentifier}`}>
                <ProfilePicture userId={userId} />
              </Link>
            ) : (
              <Link to="/login" className="relative h-8 r-4">
                <ButtonComponent className={"text-nm pb-2 hover:scale-105"}>
                  Login
                </ButtonComponent>
              </Link>
            )}
          </div>
        </div>
        <div className="items-center justify-between w-full h-full px-4 py-3 lg:hidden sm:flex">
          <Link to="/" className="text-xl font-bold">
            WHERE2
          </Link>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-gray-300"
          >
            {isOpen ? <X size={20} /> : MenuIcon}
          </button>
        </div>
      </nav>
      <div
        className={`lg:hidden fixed inset-y-0 right-0 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-[1003]`}
      >
        <div className="flex flex-col h-full">
          <div className="h-[64px] p-4 border-b">
            <button
              onClick={toggleMenu}
              className="float-right p-2 rounded-md hover:bg-gray-300"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto">
            {menuItems
              .filter((item) => item.showMobile)
              .map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="flex items-center px-4 py-4 text-gray-700 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  {item.logo}
                  <span className="ml-4">{item.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
