import Livelihood from "../components/Livelihood"
import SocialMediaLinks from "./../components/reusable/SocialMediaLinks";
import Footer from "../components/reusable/Footer"
import Navbar from "../components/reusable/Navbar"

const LivelihoodPage = () => {
    return (
        <>
            <Navbar />
            <Livelihood />
            <SocialMediaLinks notAuth={true}/>
            <Footer />
        </>
    )
};

export default LivelihoodPage;