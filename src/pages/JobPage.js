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

import useAuth from "./../hooks/useAuth";
import FloatingContact from "./../components/reusable/FloatingContact";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}  
const JobPage = () => {
    const urlParams = useQuery();

    const page = parseInt(urlParams.get('page')) || 1;
    const limit = parseInt(urlParams.get('limit')) || 10;
    const dispatch = useDispatch();
    const { data, loading, error, totalPage } = useSelector((state) => state.pagination);

    useEffect(() => {
        dispatch(fetchAllList({page,limit,model: 'Job'}))
    },[dispatch, page])
    return (
        <>
            <Navbar />
            <ListContainer>
                {loading && <LoadingOverlay/>}
                {error && <p>{error}</p>}
                <JobList jobs={data} page={page}/>
                <Pagination totalPage={totalPage} currentPage={page} route={'jobs'} category={"job"} />
            </ListContainer>
            {useAuth().isLoggedIn? null : <FloatingContact />}  {/* Show Floating Contact if user is not logged in */}
            <Footer />
        </>
    )
};

export default JobPage;