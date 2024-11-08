import React from "react";
import ButtonComponent from "./Button";
import {
  User,
  Building2,
  GraduationCap,
  Heart,
  Users,
  MessageCircle,
} from "lucide-react";

const ProfileSidebar = () => {
  const menuItems = [
    { icon: <User size={20} />, label: "Profile Overview", isActive: true },
    { icon: <Building2 size={20} />, label: "Universities" },
    { icon: <GraduationCap size={20} />, label: "Scholarships" },
    { icon: <Heart size={20} />, label: "Health" },
    { icon: <Users size={20} />, label: "Community" },
  ];

  return (
    <div className="w-full h-full max-h-[1166px] bg-white shadow-lg rounded-lg pt-[64px] pb-[32px] px-6 mt-[64px] space-y-6">
      {/* Profile Summary */}
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <h2 className="font-semibold text-lg">Hakkerby Chea</h2>
          <p className="text-sm text-gray-500">@hakkerby01</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
        <div className="text-center">
          <p className="font-semibold">150</p>
          <p className="text-sm text-gray-500">Connections</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">45</p>
          <p className="text-sm text-gray-500">Applications</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
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

      {/* Contact Button */}
      <ButtonComponent
        fullWidth="full"
        rounded={false}
        className={"flex align-middle justify-center"}
      >
        <span>Message</span>
      </ButtonComponent>
    </div>
  );
};

export default ProfileSidebar;
