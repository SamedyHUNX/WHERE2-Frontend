import Navbar from "../components/reusable/Navbar";

import SignupLayout from "../layouts/SignupLayout";

export default function Signup() {
    return (
        <>
            <Navbar />
            <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: '15vh 0',
                background: "black"
            }}>
                <SignupLayout />
            </div>
        </>
    );
}
