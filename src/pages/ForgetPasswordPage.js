import ForgetPasswordComponent from "./../components/authentication/ForgetPassword";
import Footer from "./../components/reusable/Footer";
import Navbar from "./../components/reusable/Navbar";
import ForgetPasswordLayout from "../layouts/ForgetPasswordLayout";

const ForgetPasswordPage = () => {
    return (
        <>
            <Navbar/>
            {/* <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: '15vh 0',
                background: "black"
            }}>
                <ForgetPasswordLayout />
            </div> */}
            <ForgetPasswordComponent />
        </>
    )
}

export default ForgetPasswordPage;