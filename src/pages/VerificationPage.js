import VerificationComponent from "./../components/authentication/VerificationComponent";
import useAuth from "./../hooks/useAuth";
import FloatingContact from "./../components/reusable/FloatingContact";

const VerificationPage = () => {
    return (
        <>
            <VerificationComponent />
            {useAuth().isLoggedIn ? "" : <FloatingContact />}
        </>
    );
};

export default VerificationPage;