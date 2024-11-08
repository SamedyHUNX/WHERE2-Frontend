import SigninLayout from "./../layouts/SigninLayout";
import FloatingContact from "./../components/reusable/FloatingContact";

export default function Test() {
    return (
        <div className="bg-[#E6F3F9] w-full h-full">
            <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: '15vh 0',
                background: "black"
            }}>
                <SigninLayout />
            </div>
            <FloatingContact/>
        </div>
    );
}
