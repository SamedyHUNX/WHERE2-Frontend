import ForgetPasswordComponent from "./../components/authentication/ForgetPassword";
import Navbar from "./../components/reusable/Navbar";
import FloatingContact from "../components/reusable/FloatingContact";

const ForgetPasswordPage = () => {
    return (
        <div className="bg-[#E6F3F9] w-full h-full"
            style={{ 
                background: 'linear-gradient(to right, rgba(224, 245, 255, 0.5), rgba(156, 222, 255, 0.5))',
            }}        
        >
            <Navbar isBanner={true} />
            <ForgetPasswordComponent />
            <FloatingContact/>
        </div>
    )
}

export default ForgetPasswordPage;