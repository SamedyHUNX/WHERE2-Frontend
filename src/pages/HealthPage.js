import Health from "./../components/health/Health";
import Footer from "./../components/reusable/Footer";
import HealthNavbar from "./../components/health/HealthNavbar"

const LoginPage = () => {
  return (
    <div>
      <HealthNavbar />
        <Health />
      <Footer />
    </div>
  );
};

export default LoginPage;
