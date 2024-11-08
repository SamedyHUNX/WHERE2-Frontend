import React, { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram, ImageIcon, Globe, Send} from "lucide-react";
import {convertToHTML} from "../utility/markdownConverter/markdownConverter"
import DiscussionContainer from "./../components/reusable/DiscussionContainer";
import RelevantLinks from "../components/reusable/RelevantLinks";

const DetailLayout = ({ 
  image, 
  description, 
  title, 
  websiteLink, 
  facebookLink, 
  instagramLink, 
  twitterLink, 
  telegramLink,
  author = "WHERE2 Team",
  date = "March 2024",
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const socialMediaLinks = [
    { 
      icon: Globe, 
      link: websiteLink, 
      label: "Website",
      bgGradient: "from-gray-600 to-gray-700"
    },
    { 
      icon: Instagram, 
      link: instagramLink, 
      label: "Instagram",
      bgGradient: "from-purple-600 to-pink-600"
    },
    { 
      icon: Send, 
      link: telegramLink, 
      label: "Telegram",
      bgGradient: "from-blue-400 to-blue-600"
    },
    { 
      icon: Twitter, 
      link: twitterLink, 
      label: "Twitter",
      bgGradient: "from-sky-400 to-sky-600"
    },
    { 
      icon: Facebook, 
      link: facebookLink, 
      label: "Facebook",
      bgGradient: "from-blue-600 to-blue-800"
    }
  ];


  return (
    <div className={`lg:w-[80%] sm:max-w-7xl mx-auto px-4 py-16 transition-opacity duration-1000 text-justify ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <div className="relative mb-12 group mt-[5vh]">
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gray-100 cursor-zoom-in"
             onClick={() => setIsImageZoomed(!isImageZoomed)}>
          <div className="aspect-video">
            {imageError || !image ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <ImageIcon className="w-16 h-16 text-gray-400" />
              </div>
            ) : (
              <img
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500
                  ${isImageZoomed ? 'scale-110' : 'scale-100'}
                  group-hover:brightness-105`}
                src={image}
                alt={title}
                onError={() => setImageError(true)}
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Author and Stats Bar */}
      <div className="flex justify-between items-center mb-8 h-[100px]">
        <div className="flex items-center gap-4 h-full">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {author[0]}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-2xl tracking-tight">{author}</h3>
            <p className="text-sm text-gray-500 font-semibold">{date}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid lg:grid-cols-3 gap-12 lg:pr-4 sm:px-2">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between h-[100px]">
            <h1 className="lg:text-4xl sm:text-5xl font-bold text-gray-900 text-justify">{title}</h1>
          </div>
          
          <div className="prose prose-lg max-w-none text-justify tracking-tight">
            {convertToHTML(description)}
          </div>
          {/* Interaction Bar */}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Social Media Cards */}
          <div className="grid grid-cols-2 gap-4 mx-5">
            {socialMediaLinks.map(({ icon: Icon, link, label, bgGradient }) => 
              link && (
                <a
                  key={label}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-gradient-to-br ${bgGradient} p-4 rounded-xl text-white 
                    transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
                    flex flex-col items-center justify-center gap-2 group`}
                >
                  <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium">{label}</span>
                </a>
              )
            )}
          </div>
          <RelevantLinks links={socialMediaLinks} />


      <div className="w-full h-fit">
        <DiscussionContainer />
      </div>

    </div>
      </div>

      {/* Discussion Section */}
    </div>
  );
};

export default DetailLayout;