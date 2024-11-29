import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useQueryParams } from '../hooks/useQueryParams';

import { LoadingOverlay } from '../components/reusable/Loading';

import Navbar from '../components/reusable/Navbar';
import Footer from '../components/reusable/Footer';
import Pagination from '../components/reusable/Pagination';
import ListContainer from '../components/reusable/ListContainer';
import AccommodationList from '../components/AccommodationList';
import NoResults from '../layouts/NoResults';


import { fetchAccommodations,fetchFilterAccommodation } from '../features/slices/accommodationSlice';
import Filter from '../components/reusable/Filter';

import FloatingContact from './../components/reusable/FloatingContact';
import SocialMediaLinks from './../components/reusable/SocialMediaLinks';

/** Enable for debugging */
const isDebug = true;

const AccommodationPage = () => {
    const urlParams = useQueryParams();

    let page = parseInt(urlParams.get('page')) || 1;
    const limit = parseInt(urlParams.get('limit')) || 10;
    const searchQuery = urlParams.get('q') || '';
    const university = urlParams.get('university') || '';

    const items = [
        {
            id: '2eqsd',
            label: 'University',
            content: [
                'Royal University of Phnom Penh',
                'Institute of Technology of Cambodia',
                'Western University',
                'University of Health Sciences, Cambodia',
                'Limkokwing University of Creative Technology',
                'International University - Cambodia',
                'University of Cambodia',
                'Royal University of Law and Economics',
                'Paragon Internation University',
                'Paññāsāstra University of Cambodia'
            ]
        },
    ];

    const dispatch = useDispatch();
    const { data, loading, error, totalPages, filteredAccommodation } = useSelector((state) => state.accommodations);

    useEffect(() => {
        if (university !== '') {
            dispatch(fetchFilterAccommodation(university))

        }
        dispatch(fetchAccommodations({page, limit}))
    }, [page, limit, university])

    return (
        <div>
            <Navbar />
            <ListContainer>
            <Filter 
                    items={items}
                    category={"accommodation"}
                    university={university}
                />
            {loading && <LoadingOverlay/>}
            <AccommodationList accommodations={university === ''?data:filteredAccommodation} page={page} />
            </ListContainer>
            <Pagination totalPage={university === ''?totalPages:1} limit={limit} currentPage={page} category='accommodation'/>
             <FloatingContact />
             <SocialMediaLinks notAuth={true}/>
            <Footer />
        </div>
    )
};

export default AccommodationPage;