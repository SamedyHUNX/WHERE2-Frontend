import React from "react";
import BioCard from "../components/reusable/BioCard";
import NavBar from "../components/reusable/Navbar";
import Footer from "../components/reusable/Footer";
import WrapperComponent from "../components/reusable/WrapperComponent";

import SocialMediaLinks from "./../components/reusable/SocialMediaLinks";
import FloatingContact from "./../components/reusable/FloatingContact";

const bioCard = [
  {
    image: "https://i.imgur.com/ZXLbZE0.png",
    title: "OUR VISION",
    description:
      "We strive to be the go-to platform for college students, providing easy-to-use tools to find the best universities, scholarships, accommodations, study loans, and part-time jobs.",
  },
  {
    image: "https://i.imgur.com/6jgw3Rp.png",
    title: "OUR MISSION",
    description:
      " Empower Student Success <br /> Simplify the Search Process <br /> Enhance Accessibility <br /> Foster Financial Independence <br /> Build Strong Partnerships ",
  },
  {
    image: "https://i.imgur.com/AYNaNU9.png",
    title: "OUR CORE VALUE",
    description:
      "Student-First: Your goals are our priority. <br /> Honesty: Transparent and fair in everything we do. <br /> Innovation: Always improving to serve you better. <br /> Inclusivity: Opportunities for all students, no matter where you're from.  <br /> Teamwork: Collaborating to create the best experience for you.",
  },
];

const AboutUsPage = () => {
  return (
    <>
      <NavBar />
      <div className="max-w-[1440px] mx-auto mt-[100px]">
        {bioCard.map((card, index) => (
          <div key={index}>
            {index === 1 ?
            (  <WrapperComponent>
              <BioCard variant={"right"} bioCard={card} />
            </WrapperComponent>): (<WrapperComponent> 
              <BioCard variant={"left"} bioCard={card} />
            </WrapperComponent>)}
          </div>
        ))}
      </div>

      <SocialMediaLinks notAuth={true}/>
      <FloatingContact />

      <Footer />
    </>
  );
};

export default AboutUsPage;