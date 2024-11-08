import ForgetPasswordComponent from "./../components/authentication/ForgetPassword";
import FloatingContact from "../components/reusable/FloatingContact";

const ForgetPasswordPage = () => {
    return (
        <div className="bg-[#E6F3F9] w-full h-full">
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
            <FloatingContact/>
        </div>
    )
}

export default ForgetPasswordPage;