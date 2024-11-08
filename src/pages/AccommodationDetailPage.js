import AccommodationDetail from "../components/AccommodationDetail"
import Footer from "../components/reusable/Footer"
import Navbar from "../components/reusable/Navbar"
import FloatingContact from "./../components/reusable/FloatingContact"

const AccommodationDetailPage = () => {
    return (
        <>
            <Navbar />
            <AccommodationDetail />
            <FloatingContact />
            <Footer />
        </>
    )
};

export default AccommodationDetailPage;