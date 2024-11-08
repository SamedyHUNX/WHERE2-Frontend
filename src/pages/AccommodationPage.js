import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useQueryParams } from '../hooks/useQueryParams';

import { LoadingOverlay } from '../components/reusable/Loading';

import Navbar from '../components/reusable/Navbar';
import Footer from '../components/reusable/Footer';
import Pagination from '../components/reusable/Pagination';
import ListContainer from '../components/reusable/ListContainer';
import AccommodationList from '../components/AccommodationList';

import { fetchAccommodations } from '../features/slices/accommodationSlice';

import FloatingContact from './../components/reusable/FloatingContact';
import SocialMediaLinks from './../components/reusable/SocialMediaLinks';

/** Enable for debugging */
const isDebug = true;

const AccommodationPage = () => {
    const urlParams = useQueryParams();

    const page = parseInt(urlParams.get('page')) || 1;
    const limit = parseInt(urlParams.get('limit')) || 10;
    const searchQuery = urlParams.get('q') || '';

    const dispatch = useDispatch();
    const { data, loading, error, totalPages } = useSelector((state) => state.accommodations);

    useEffect(() => {
        dispatch(fetchAccommodations({page, limit}))
    },[page, limit])
    return (
        <div>
            <Navbar />
            <ListContainer>
            {loading && <LoadingOverlay/>}
            {error && <p>{error}</p>}
                <AccommodationList accommodations={data} page={page} />
            </ListContainer>
            <Pagination totalPage={totalPages} limit={limit} currentPage={page} category='accommodation'/>
             <FloatingContact />
             <SocialMediaLinks notAuth={true}/>
            <Footer />
        </div>
    )
};

export default AccommodationPage;