import Navbar from "../components/reusable/Navbar";

import SigninLayout from "../layouts/SigninLayout";

export default function Test() {
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
                <SigninLayout />
            </div>
        </>
    );
}
