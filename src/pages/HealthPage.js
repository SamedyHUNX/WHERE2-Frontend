import Health from "./../components/health/Health";
import Footer from "./../components/reusable/Footer";
import HealthNavbar from "./../components/health/HealthNavbar"
import FloatingContact from "./../components/reusable/FloatingContact";
import SocialMediaLinks from "./../components/reusable/SocialMediaLinks";

const LoginPage = () => {
  return (
    <>
      <HealthNavbar />
        <Health />
        <SocialMediaLinks notAuth={true}/>
        <FloatingContact />
      <Footer />
    </>
  );
};

export default LoginPage;
