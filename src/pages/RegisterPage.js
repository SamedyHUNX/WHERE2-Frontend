import RegisterComponent from "./../components/authentication/RegisterComponent";
import Navbar from "./../components/reusable/Navbar";
import FloatingContact from "./../components/reusable/FloatingContact";
import SocialMediaLinks from "./../components/reusable/SocialMediaLinks";

const RegisterPage = () => {
  return (
    <div className="bg-[#E6F3F9] w-full h-full">
      <Navbar isBanner={true} />
      <RegisterComponent auth={true} />
      <SocialMediaLinks />
      <FloatingContact />
    </div>
  );
};

export default RegisterPage;
