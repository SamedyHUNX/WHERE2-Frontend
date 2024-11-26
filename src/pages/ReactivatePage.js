import FloatingContact from "./../components/reusable/FloatingContact";
import Navbar from "./../components/reusable/Navbar";
import SocialMediaLinks from "./../components/reusable/SocialMediaLinks";
import ReactivateAccountComponent from "./../components/authentication/ReactivateAccountComponent";

const ReactivatePage = () => {
  return (
    <div className="bg-[#E6F3F9] w-full h-full">
      <Navbar isBanner={true} />
      <ReactivateAccountComponent />
      <SocialMediaLinks />
      <FloatingContact />
    </div>
  );
};

export default ReactivatePage