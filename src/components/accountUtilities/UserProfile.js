import React, { useEffect, useState } from "react";
import Profile from "../reusable/Profile";
import config from "../../config";
import { LoadingOverlay } from "../reusable/Loading";
import Navbar from "../reusable/Navbar";
import Footer from "../reusable/Footer";
import fetchProfile from "../reusable/functions/FetchProfile";

export const getAuthData = () => {
  const authData = localStorage.getItem("authData");
  if (!authData) {
    throw new Error("No authentication data found");
  }
  try {
    const parsedAuthData = JSON.parse(authData);
    if (!parsedAuthData.token || !parsedAuthData.id) {
      throw new Error("Invalid authentication data structure");
    }
    return {
      token: parsedAuthData.token,
      userId: parsedAuthData.id,
    };
  } catch (error) {
    console.error("Error parsing auth data:", error);
    throw new Error("Invalid authentication data");
  }
};



const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadProfile();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <Navbar />
      <div className="w-full h-full mt-[70px] lg:mb-[32px] relative">
        <Profile userData={userData} />  
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default UserProfile;
