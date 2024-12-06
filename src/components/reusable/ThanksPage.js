import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';

const ThanksPage = () => {
  return (
    <>
            <Navbar isBanner={true} />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-xl p-8 md:p-12 text-center">
        <Heart className="mx-auto mb-6 text-red-500 animate-pulse" size={80} />
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Thank You for Your Support
        </h1>
        
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          We want to express our heartfelt gratitude to all our users, educators, 
          and supporters who have been part of our journey. While our current chapter 
          has come to a close, we are incredibly thankful for the trust and community 
          you've helped us build.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="italic text-blue-800">
            "Every end is a new beginning. We are grateful for the learning 
            experiences we've shared together."
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4 flex items-center">
            <div className="flex-grow">
              <h3 className="font-semibold text-green-800">
                Data and User Content
              </h3>
              <p className="text-green-600 text-sm">
                We are committed to ensuring the safety and accessibility of all user data.
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 flex items-center">
            <div className="flex-grow">
              <h3 className="font-semibold text-yellow-800">
                Future Communications
              </h3>
              <p className="text-yellow-600 text-sm">
                We will provide updates about data management and potential platform transitions.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center space-x-4">
          <a 
            href="mailto:support@ourcompany.com" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition flex items-center"
          >
            Contact Us <ArrowRight className="ml-2" size={20} />
          </a>
        </div>
        
        <footer className="mt-8 text-gray-500 text-sm">
          © {new Date().getFullYear()} Our Learning Platform. 
          All rights reserved.
        </footer>
      </div>
    </div>
    </>
  );
};

export default ThanksPage;