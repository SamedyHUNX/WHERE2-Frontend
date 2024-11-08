import VerificationComponent from "./../components/authentication/VerificationComponent";
import useAuth from "./../hooks/useAuth";
import FloatingContact from "./../components/reusable/FloatingContact";

const VerificationPage = () => {
    return (
        <div className="bg-[#E6F3F9] w-full h-full">
            <VerificationComponent />
            {useAuth().isLoggedIn ? "" : <FloatingContact />}
        </div>
    );
};

export default VerificationPage;