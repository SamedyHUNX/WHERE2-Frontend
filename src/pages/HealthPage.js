import Health from "./../components/health/Health";
import Footer from "./../components/reusable/Footer";
import HealthNavbar from "./../components/health/HealthNavbar"
import FloatingContact from "./../components/reusable/FloatingContact";

const LoginPage = () => {
  return (
    <>
      <HealthNavbar />
        <Health />
        <FloatingContact />
      <Footer />
    </>
  );
};

export default LoginPage;
