// components
import Navbar from "../components/reusable/Navbar";
import Footer from "../components/reusable/Footer";
import Hero from "../layouts/Hero";
import Searchbar from "../components/reusable/SearchBar";
import WrapperComponent from "../components/reusable/WrapperComponent";
import CardFeatureSlider from "../components/reusable/CardFeatureSlider";
import SaveSection from "../components/reusable/Saves";
import JoinUs from "../components/reusable/JoinUs";
// import Card from "../components/reusable/Card";

// slices
import { searchUniversities } from "../features/slices/universitySlice";

// assets
import CardSlider from "../components/reusable/CardsSlider";
import LivelihoodHomePage from "../assets/images/livelihood-homepage.png";
import UniversityHomePage from "../assets/images/university-homepage.png";
import ScholarshipHomePage from "../assets/images/shcolarship-homepage.png"
import defaultImage from "../assets/images/where2.jpg"
import { title } from "process";


const hero1 = {
  title: "DISCOVER YOUR FUTURE.",
  subtitle: "Everything starts here.",
  searchPlaceholder: "Search University by name",
  backgroundGradient: "bg-gray-primary",
  titleColor: "text-blue-900",
  subtitleColor: "text-blue-600",
  mainImageSrc: "https://i.imgur.com/dACQws5.png",
  mainImageAlt: "University building",
  onSearch: () => {},
};

// background: linear-gradient(180deg, #E3E3E3 0%, #EEEEEE 19%, #FFFFFF 82%, #F6F6F6 100%);

const hero2 = {
  title: "PURSUE YOUR CAREER.",
  subtitle: "By supporting yourself.",
  backgroundGradient: "from-blue-100",
  titleColor: "text-blue-900",
  subtitleColor: "text-blue-600",
  mainImageSrc: "https://i.imgur.com/4LZH1N6.png",
  mainImageAlt: "University building",
  button:"Find part time jobs",
  onSearch: () => {},
};

const header =[
  {
    suggested: "SUGGESTED FOR YOU"
  }
]

const headerCardFeature = [
  {
    suggested: "OUR FEATURE"
  }
];
const cards = [
  {
    title: "Scholarships",
    description:
      "Explore the latest scholarships available for Cambodian students.",
    image: "https://qtxasset.com/quartz/qcloud5/media/image/fiercepharma/1619625035/22720111227_2a042d40c2_k.jpg/22720111227_2a042d40c2_k.jpg?VersionId=x3K_RGWSODPPttid4VR0oZR8wuzsyefC",
  },
  {
    title: "University Fair 2024",
    description:
      "Join us at the University Fair to learn more about programs and meet representatives from top universities.",
    image: "https://pppenglish.sgp1.digitaloceanspaces.com/image/main/field/image/photo_2022-12-09_09-24-30.jpg",
  },
  {
    title: "Career Expo",
    description:
      "Attend the Career Expo and meet potential employers from various industries.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgwYhRvBfq_Q7G0Uf_H1wMVSBq0gwnPj79IA&s",
  },
  {
    title: "Research Conference",
    description:
      "Discover groundbreaking research presented by university students and professors.",
    image: "https://pppenglish.sgp1.digitaloceanspaces.com/image/main/field/image/rhb1.jpg",
  },
  {
    title: "Student Orientation",
    description:
      "New to campus? Don’t miss the Student Orientation to get familiar with the university.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUC4v9hYvYmpvpAIPoj5H5u29vyvtCsaRRZw&s",
  },
  {
    title: "Alumni Meet 2024",
    description:
      "Reconnect with fellow graduates and current students during the Alumni Meet.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9h5_4wrvXgm6Xbl2I0xYii3kpt0xgisWt0g&s",
  },
  {
    title: "Open House",
    description:
      "Get an insider view of campus life and academic offerings at the University Open House.",
    image: "https://paragoniu.edu.kh/wp-content/uploads/2020/09/Virtual-Open-House-2020.jpg",
  },
  {
    title: "Hackathon",
    description:
      "Compete in the university’s tech-driven Hackathon and bring your ideas to life.",
    image: "https://media.startupcambodia.gov.kh/platform/core/program/images/Turing_Hackathon_Cycle_4_Inspiration_to_Digital_Innovation.jpg",
  }
];
const adsCards = [
  {
  title: "KBPRASAC",
  image: "https://cdn6.aptoide.com/imgs/7/e/5/7e550f4e8f0e6c8e10e7d4e1caff29dd_fgraphic.png",
  description : "now available on mobile devices"
  },
  {
  title: "MORAKOT",
  image: "https://www.topjobcambodia.com/photos/social/20210317-101029-morakot_technology.jpg",
  description : "To build a simple, reliable, and innovative FinTech platform for the finance industry."
  },
  {
  title: "PPC BANK",
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK2dL66FMoDkXhF6zK5Pdvo7zlD9QmZ6nDow&s",
  description : "Unlike purchasing a block of advertising space from a specific website through an ad agency or media buying company, ad impressions from pay per click ads are free. Your bank will only incur a cost when someone clicks on your ads."
  },
  {
  title: "KOOMPI",
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3GzeIN6tw_yng2zZgSt08cwCLrmQOo76Yeg&s",
  description : "A versatile operating system that prioritizes user control and flexibility. It offers both an immutable and mutable OS, allowing users to switch seamlessly"
  },

]

const sponsers = [
  {
    title: "A&B",
    image : "https://anbschool.org/wp-content/uploads/2023/03/AboveBeyond-.png",
    description: "ABOVE & BEYOND School is an innovative tech school. We create a place where anyone come together to collaborate, create great things, and make an impact.",
path: "https://anbschool.org/"
  },
  {
    title: "A&B",
    image : "https://anbschool.org/wp-content/uploads/2023/03/AboveBeyond-.png",
    description: "ABOVE & BEYOND School is an innovative tech school. We create a place where anyone come together to collaborate, create great things, and make an impact.",
path: "https://anbschool.org/"
  },
  {
    title: "A&B",
    image : "https://anbschool.org/wp-content/uploads/2023/03/AboveBeyond-.png",
    description: "ABOVE & BEYOND School is an innovative tech school. We create a place where anyone come together to collaborate, create great things, and make an impact.",
path: "https://anbschool.org/"
  },
  {
    title: "A&B",
    image : "https://anbschool.org/wp-content/uploads/2023/03/AboveBeyond-.png",
    description: "ABOVE & BEYOND School is an innovative tech school. We create a place where anyone come together to collaborate, create great things, and make an impact.",
    path: "https://anbschool.org/"
  },
]
const featureCards = [
  {
      title: "University",
    image: UniversityHomePage ,
    description: "Find out available scholarships.",
      path: "/list/university"
  },
  {
    title: "Scholarship",
    image: ScholarshipHomePage,
    description: "Find out available scholarships.",
      path: "/list/Scholarship"
  },
  {
    title: "Livelihood",
    description: "Find support for your education.",
      image: LivelihoodHomePage,
      path: "/livelihood"
  },
  {
      title: "University",
    image: UniversityHomePage ,
    description: "Find out available scholarships.",
      path: "/list/university"
  },
  {
    title: "Scholarship",
    image: ScholarshipHomePage,
    description: "Find out available scholarships.",
      path: "/list/Scholarship"
  },
  {
    title: "Livelihood",
    description: "Find support for your education.",
      image: LivelihoodHomePage,
      path: "/livelihood"
  },
  {
      title: "University",
    image: UniversityHomePage ,
    description: "Find out available scholarships.",
      path: "/list/university"
  },
  {
    title: "Scholarship",
    image: ScholarshipHomePage,
    description: "Find out available scholarships.",
      path: "/list/Scholarship"
  },
  {
    title: "Livelihood",
    description: "Find support for your education.",
      image: LivelihoodHomePage,
      path: "/livelihood"
  },
  {
      title: "University",
    image: UniversityHomePage ,
    description: "Find out available scholarships.",
      path: "/list/university"
  },
  {
    title: "Scholarship",
    image: ScholarshipHomePage,
    description: "Find out available scholarships.",
      path: "/list/Scholarship"
  },
  {
    title: "Livelihood",
    description: "Find support for your education.",
      image: LivelihoodHomePage,
      path: "/livelihood"
  },
  {
    title: "University",
    image: "https://i.imgur.com/nLz3Gqg.png",
    description: "Find out available scholarships.",
      path: "/list/university"
  },
  {
    title: "Scholarship",
    image: "https://i.imgur.com/zwFZOIk.png",
    description: "Find out available scholarships.",
      path: "/list/Scholarship"
  },
  {
    title: "Livelihood",
    description: "Find support for your education.",
      image: "https://i.imgur.com/lfOwU5G.png",
      path: "/livelihood"
  },
  {
    title: "University",
    image: "https://i.imgur.com/nLz3Gqg.png",
    description: "Find out available scholarships.",
      path: "/list/university"
  },
  {
    title: "Scholarship",
    image: "https://i.imgur.com/zwFZOIk.png",
    description: "Find out available scholarships.",
      path: "/list/Scholarship"
  },
  {
    title: "Livelihood",
    description: "Find support for your education.",
      image: "https://i.imgur.com/lfOwU5G.png",
      path: "/livelihood"
  },
];

const HomePage = () => {
  return (
    <>
      <Navbar />
      <WrapperComponent>
        <Hero props={hero1}>
          <Searchbar 
            handleSearch={searchUniversities}
            searchPlaceholder="Search universities..."
            category="university"
          />
        </Hero>
      </WrapperComponent>
        <CardFeatureSlider cardFeature={featureCards} header={"OUR MAIN FEATURES"} />
      <WrapperComponent>
        <Hero props={hero2} />
      </WrapperComponent>
      <WrapperComponent>
        <CardFeatureSlider cardFeature={cards} header={ "SUGGESTED FOR YOU"} />
      </WrapperComponent>
      <WrapperComponent>
        <SaveSection />
      </WrapperComponent>
      <WrapperComponent>
        <CardSlider cards={sponsers} header={"OUR SPONSERS"} ads={sponsers.length > 1}/>
        <JoinUs />
      </WrapperComponent>
        <Footer />
    </>
  );
};

export default HomePage;
