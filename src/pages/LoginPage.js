import LoginComponent from "./../components/authentication/LoginComponent";
import FloatingContact from "./../components/reusable/FloatingContact"

const LoginPage = () => {
    return (
        <div className="bg-[#E6F3F9] w-full h-full">
        <LoginComponent/>
        <FloatingContact/>
        </div>
    )
}

export default LoginPage;