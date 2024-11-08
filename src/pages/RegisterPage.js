import RegisterComponent from "./../components/authentication/RegisterComponent";
import FloatingContact from "../components/reusable/FloatingContact";

const RegisterPage = () => {
    return (
            <div className="bg-[#E6F3F9] w-full h-full">
                <RegisterComponent />
                <FloatingContact/>
            </div>
    )
}

export default RegisterPage;