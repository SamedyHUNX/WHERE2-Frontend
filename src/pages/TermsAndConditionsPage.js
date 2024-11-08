import FloatingContact from "../components/reusable/FloatingContact";
import TermsAndConditionsComponent from "./../components/authentication/TermsAndConditions";

const TermsAndConditionsPage = () => {
    return (
        <div className="bg-[#E6F3F9] w-full h-full">
            <TermsAndConditionsComponent />
            <FloatingContact/>
        </div>
    )
}

export default TermsAndConditionsPage;