import RegisterComponent from "./../components/authentication/RegisterComponent";
import Footer from "./../components/reusable/Footer";
import Navbar from "./../components/reusable/Navbar";

const RegisterPage = () => {
    return (
            <>
                <Navbar/>
                    <RegisterComponent />
                <Footer />
            </>
    )
}

export default RegisterPage;