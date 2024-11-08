import { useDispatch, useSelector } from "react-redux";
import JobList from "../components/job/JobList"
import Footer from "../components/reusable/Footer"
import Navbar from "../components/reusable/Navbar"
import { useEffect } from "react";
import { fetchAllList } from "../features/slices/paginationSlice";
import Pagination from "../components/reusable/Pagination";
import ListContainer from "../components/reusable/ListContainer";
import { useLocation } from 'react-router-dom';
import { LoadingOverlay } from "../components/reusable/Loading";
import StudentLoanList from "../components/StudentLoanList";

import useAuth from "./../hooks/useAuth";
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

            {useAuth().isLoggedIn? null : <FloatingContact />}

            <Footer />
        </>
    )
};

export default StudentLoanPage;