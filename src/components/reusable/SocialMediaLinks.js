import React from 'react';
import { FaInstagram, FaFacebookF, FaYoutube, FaTelegramPlane , FaTiktok} from "react-icons/fa";
// import { faTikTok } from '@fortawesome/free-brands-svg-icons';

const SocialMediaLinks = ({ notAuth = false }) => {
  const socialLinks = [
    {
      icon: <FaInstagram size={24} />,
      href: 'https://instagram.com/yourhandle',
      bgColor: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500',
    },
    {
      icon: <FaFacebookF size={24} />,
      href: 'https://facebook.com/yourpage',
      bgColor: 'bg-blue-600',
    },
    {
      icon: <FaYoutube size={24} />,
      href: 'https://youtube.com/@yourchannel',
      bgColor: 'bg-red-600',
    },
    {
      icon: <FaTelegramPlane size={24}/>,
      href: 'https://www.facebook.com/profile.php?id=61565344985554',
      bgColor: 'bg-blue-600',
    },
    // {
    //   icon: <FontAwesomeIcon icon={faTikTok} size="lg" />,
    //   href: 'https://www.tiktok.com/@yourhandle',
    //   bgColor: 'bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500',
    // }
  ];

  return (
    <div
      className={`fixed z-50
        bottom-4 left-0 right-0 flex justify-center gap-2 
        sm:bottom-8 sm:left-0 sm:right-0 sm:flex-row sm:top-auto sm:-translate-y-0 sm:translate-x-0
        lg:right-4 lg:left-auto lg:top-1/2 lg:-translate-y-1/2 lg:flex-col ${ notAuth ? "sm:hidden" : "" }`}
    >
      {socialLinks.map((social, index) => (
        <a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${social.bgColor} p-2 rounded-full text-white hover:scale-110 transition-transform duration-200 shadow-lg`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialMediaLinks;
