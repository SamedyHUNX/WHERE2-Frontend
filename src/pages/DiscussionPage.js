import React from "react";
import SubHeroSectionComponent from "./../components/reusable/SubHeroSectionComponent";
import WrapperComponent from "./../components/reusable/WrapperComponent";
import Footer from "./../components/reusable/Footer";
import Navbar from "./../components/reusable/Navbar";
import DiscussionContainer from "./../components/reusable/DiscussionContainer";
import useAuth from "./../hooks/useAuth";
import FloatingContact from "./../components/reusable/FloatingContact";

const DiscussionPage = () => {
  return (
    <>
      <Navbar />
      <WrapperComponent>
        <SubHeroSectionComponent h1Text={'WELCOME TO W2COMMUNITY'} pText={'W2COMMUNITY is a place where you can share your thoughts, ideas, and experiences with the world. Whether you are a student, researcher, or an individual, W2COMMUNITY has something for you.'}/>
      </WrapperComponent>
      <WrapperComponent>
        <DiscussionContainer />
      </WrapperComponent>
      {useAuth().isLoggedIn? null : <FloatingContact />} {/* Show Floating Contact if user is not logged in */}
      <Footer />
    </>
  );
};

export default DiscussionPage;