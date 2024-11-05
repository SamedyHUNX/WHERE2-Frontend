import React, { useState, useEffect, useRef, useContext } from "react";
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  DocumentDuplicateIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
  BookOpenIcon,
  BeakerIcon,
} from '@heroicons/react/24/solid';
import { X, User, Heart, ChevronDown, ChevronRight, BookKey, Users, School, House, Briefcase, BadgeDollarSignIcon, ChartNoAxesColumnIncreasingIcon,GraduationCap , PanelsLeftBottom, MessageCircleMoreIcon} from "lucide-react";

import { SidebarContentContext } from "../reusable/Profile";


const MenuItem = ({ item, depth = 0, onItemClick, isSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const toggleOpen = (e) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const handleClick = () => {
    if (item.onClick) {
      item.onClick();
    }
    if (item.content) {
      onItemClick(item.label, item.content);
    }
  };

  return (
    <>
      <div
        className={`flex items-center w-full h-full px-3 py-4 rounded-lg text-start leading-tight transition-all duration-300 ease-in-out transform hover:bg-cyan-100 focus:outline
          0 cursor-pointer ${
          depth > 0 ? 'pl-' + (depth * 4 + 3) : ''
        } ${isSelected ? 'bg-gray-200' : ''}`}
        onClick={(e) => {
          toggleOpen(e);
          handleClick();
        }}
      >
        {item.icon && <div className="mr-4">{item.icon}</div>}
        <span className="flex-grow">{item.label}</span>
        {item.badge && (
          <div className="grid place-items-center ml-auto">
            <div className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-blue-500/20 text-blue-900 py-1 px-2 text-xs rounded-full">
              <span>{item.badge}</span>
            </div>
          </div>
        )}
        {hasChildren && (
          <div className="ml-auto transition-transform duration-300">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
      </div>
      {hasChildren && (
        <div
          className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out transform ${
            isOpen ? 'max-h-[1000px]' : 'max-h-0'
          }`}
        >
          {item.children.map((child, index) => (
            <MenuItem
              key={index}
              item={child}
              depth={depth + 1}
              onItemClick={onItemClick}
              isSelected={isSelected}
            />
          ))}
        </div>
      )}
    </>
  );
};

const Sidebar = ({ isOpen, onClose, userRole }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const sidebarRef = useRef(null);
  const setSideBarContent = useContext(SidebarContentContext);

  const handleItemClick = (item, content) => {
    setSelectedItem(item); // Set the clicked item as selected
    setSideBarContent(content);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isOpen]);

  const menuItems = {
    user: [
      {
        label: 'Account',
        icon: <User className="w-5 h-5" />, 
        onClick: () => handleItemClick("account", "account"),
      },
      {
        label: 'Collection',
        icon: <Heart className="w-5 h-5" />,
        children: [
          { label: 'University', icon: <School />, onClick: () => handleItemClick("university", "university") },
          { label: 'Scholarship', icon: <GraduationCap />, onClick: () => handleItemClick("scholarship", "scholarship") },
          { label: 'Accommodation', icon: <House />, onClick: () => handleItemClick("accommodation", "accommodation") },
          { label: 'Part-time Job', icon: <Briefcase />, onClick: () => handleItemClick("job", "job") },
          { label: 'Student Loan', icon: <BadgeDollarSignIcon />, onClick: () => handleItemClick("loan", "loan") }
        ]
      },
      { label: 'Settings', icon: <Cog6ToothIcon className="h-5 w-5" />, onClick: () => handleItemClick("setting", "setting") },
      { label: 'Log out', icon: <PowerIcon className="h-5 w-5" /> , onClick: () => handleItemClick("logOut", "logOut") },
    ],
    admin: [
      { label: 'Profile', icon: <UserCircleIcon className="h-5 w-5" /> , onClick: () => handleItemClick("account", "account") },
      { label: 'Content', icon: <DocumentDuplicateIcon className="h-5 w-5" />, onClick: () => handleItemClick("adminContent", "adminContent") },
      { label: 'View your posts', icon: <PanelsLeftBottom className="h-5 w-5" /> , onClick: () => handleItemClick("adminContentListing", "adminContentListing")  },
      { label: 'Dashboard', icon: <ChartNoAxesColumnIncreasingIcon className="h-5 w-5" /> , onClick: () => handleItemClick("adminDashboard", "adminDashboard") },
      { label: 'Settings', icon: <Cog6ToothIcon className="h-5 w-5"/> , onClick: () => handleItemClick("setting", "setting")  },
      { label: 'Log out', icon: <PowerIcon className="h-5 w-5" /> , onClick: () => handleItemClick("logOut", "logOut")  },
    ],
    developer: [
      { label: 'Account', icon: <User className="w-5 h-5" />, onClick: () => handleItemClick("account", "account") },
      { label: 'Users', icon: <Users className="w-5 h-5" />, onClick: () => handleItemClick("users", "userList") },
      { label: 'School', icon: <BookKey className="w-5 h-5" />, onClick: () => handleItemClick("school", "schoolList") },
      { label: 'Accommodation', icon: <House />, onClick: () => handleItemClick("accommodation", "accommodationList") },
      { label: 'Part time job', icon: <Briefcase />, onClick: () => handleItemClick("job", "jobList") },
      { label: 'Dashboard', icon: <ChartNoAxesColumnIncreasingIcon className="h-5 w-5" /> , onClick: () => handleItemClick("developerDashboard", "adminDashboard") },
      {label : "View discussion", icon: <MessageCircleMoreIcon/> , onClick: () => handleItemClick("discussionListing" , "discussionListing") },
      { label: 'Settings', icon: <Cog6ToothIcon className="h-5 w-5" />, onClick: () => handleItemClick("setting", "setting") },
      { label: 'Log out', icon: <PowerIcon className="h-5 w-5" /> , onClick: () => handleItemClick("logOut", "logOut")},
    ]
  };

  return (
    <div
      ref={sidebarRef}
      className={`rounded-r-[20px] h-full p-[16px] left-0 w-64 shadow-md border-[1px] bg-white text-black transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-500 ease-in-out z-10`}
    >
      <div className="flex justify-between items-center mb-6">
        <span></span>
        <button onClick={onClose} className="text-white hover:text-gray-300">
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav>
        {menuItems[userRole].map((item, index) => (
          <MenuItem
            key={index}
            item={item}
            onItemClick={handleItemClick}
            isSelected={selectedItem === item.label} // Highlight if selected
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
