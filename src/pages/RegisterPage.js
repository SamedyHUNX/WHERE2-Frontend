import RegisterComponent from "./../components/authentication/RegisterComponent";
import Navbar from "./../components/reusable/Navbar";
import FloatingContact from "./../components/reusable/FloatingContact";
import SocialMediaLinks from "./../components/reusable/SocialMediaLinks";

const RegisterPage = () => {
    return (
        <div className="bg-[#E6F3F9] w-full h-full"
        style={{ 
            background: 'linear-gradient(to right, rgba(224, 245, 255, 0.5), rgba(156, 222, 255, 0.5))',
        }}        
    >
        <Navbar isBanner={true} />
                <RegisterComponent />
                <SocialMediaLinks />
                <FloatingContact/>
            </div>
    )
}

export default RegisterPage;