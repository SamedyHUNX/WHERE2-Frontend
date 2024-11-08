import JobDetail from "../components/job/JobDetail"
import FloatingContact from "./../components/reusable/FloatingContact";
import Footer from "../components/reusable/Footer"
import Navbar from "../components/reusable/Navbar"

const JobDetailPage = () => {
    return (
        <>
            <Navbar />
            <JobDetail />
            <FloatingContact/>
            <Footer />
        </>
    )
};

export default JobDetailPage;