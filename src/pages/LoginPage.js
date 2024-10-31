import LoginComponent from "./../components/authentication/LoginComponent";
import Footer from "./../components/reusable/Footer";
import Navbar from "./../components/reusable/Navbar";

const LoginPage = () => {
    return (
        <>
            <Navbar/>
            <LoginComponent/>
            <Footer/>
        </>
    )
}

export default LoginPage;