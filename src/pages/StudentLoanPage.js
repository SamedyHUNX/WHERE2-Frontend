import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/reusable/Footer"
import Navbar from "../components/reusable/Navbar"
import { useEffect } from "react";
import { fetchAllList } from "../features/slices/paginationSlice";
import Pagination from "../components/reusable/Pagination";
import ListContainer from "../components/reusable/ListContainer";
import { useLocation } from 'react-router-dom';
import { LoadingOverlay } from "../components/reusable/Loading";
import StudentLoanList from "../components/StudentLoanList";

import SocialMediaLinks from "./../components/reusable/SocialMediaLinks";
import FloatingContact from "./../components/reusable/FloatingContact";

function useQuery() {
    return new URLSearchParams(useLocation().search);
} 
const StudentLoanPage = () => {
    const urlParams = useQuery();
    const page = parseInt(urlParams.get('page')) || 1;
    const dispatch = useDispatch();
    const { data, loading, error, totalPage } = useSelector((state) => state.pagination);

    useEffect(() => {
        dispatch(fetchAllList({page,limit:10,model: 'StudentLoan'}))
    }, [dispatch, page])

    return (
        <>
            <Navbar />
            <ListContainer>
            {loading && <LoadingOverlay/>}
            {error && <p>{error}</p>}
            <StudentLoanList studentLoans={data} page={page}/>
            </ListContainer>
            <Pagination totalPage={totalPage} currentPage={page} category= {'student-loan'} route={'studen-loan'} />

            <SocialMediaLinks notAuth={true}/>

            <FloatingContact />

            <Footer />
        </>
    )
};

export default StudentLoanPage;