import LoginComponent from "./../components/authentication/LoginComponent";
import FloatingContact from "./../components/reusable/FloatingContact";
import Navbar from "./../components/reusable/Navbar";
import SocialMediaLinks from "./../components/reusable/SocialMediaLinks";

const LoginPage = () => {
  return (
    <div className="bg-[#E6F3F9] w-full h-full">
      <Navbar isBanner={true} />
      <LoginComponent auth={true} />
      <SocialMediaLinks />
      <FloatingContact />
    </div>
  );
};

export default LoginPage;
