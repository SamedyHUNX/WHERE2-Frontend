import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useQueryParams } from '../hooks/useQueryParams';

import { setTotalPage } from '../features/slices/paginationSlice';
import { filterByLocation } from '../features/slices/filterSlice';
import { fetchScholarships, searchScholarships, setScholarships } from '../features/slices/scholarshipsSlice';

import { LoadingOverlay } from '../components/reusable/Loading';

//layouts
import ListLayout from '../layouts/ListLayout';

//reusable
import Navbar from '../components/reusable/Navbar';
import Footer from '../components/reusable/Footer';
import Filter from '../components/reusable/Filter';
import SearchBar from '../components/reusable/SearchBar';
import Pagination from '../components/reusable/Pagination';
import ListContainer from '../components/reusable/ListContainer';

import FloatingContact from './../components/reusable/FloatingContact';
import SocialMediaLinks from './../components/reusable/SocialMediaLinks';

const ScholarshipPage = () => {
    const urlParams = useQueryParams();

    const page = parseInt(urlParams.get('page')) || 1;
    const location = urlParams.get('location') || '';
    const searchQuery = urlParams.get('q') || '';
    
    const dispatch = useDispatch();
    const { scholarships, loading } = useSelector((state) => state.scholarships);
    const { totalPage } = useSelector((state) => state.pagination);

    // scholarship filter options
    const items = [
        {
            id: '2eqsa',
            label: 'Location',
            content: ['Phnom Penh', 'Siem Reap']
        },
    ];

    /**
     * async function
     * 
     * Filters and updates the search results based on the location parameters
     * 
     * @param {Array} list - List of search results
     * @param {number} totalPages - Total pages of results
     */
    async function filterLocation(){
        const { list , totalPages } = await filterByLocation({ page, location , category: "scholarship" })
        dispatch(setScholarships(list))
        dispatch(setTotalPage(totalPages))
    }

    /**
     * useEffect Hook
     *
     * Fetches scholarships based on current page if no search query is provided.
     * If a search query is present, it triggers the search functionality.
     *
     * @param {Function} dispatch - Redux dispatch function
     * @param {number} page - Current page number for pagination
     * @param {string} searchQuery - Current search query
     * @param {boolean} isDebug - Flag for enabling debug logs
     */
    useEffect(() => {
        if (searchQuery !== "") {
            dispatch(searchScholarships({ page, query: searchQuery }));
        } else if (location !== ""){
            filterLocation()
        } else {
            dispatch(fetchScholarships({ page }));
        }
    }, [dispatch, page, searchQuery, location]);

    return (
        <>
            <Navbar />
            <ListContainer>
                {loading && <LoadingOverlay />}
                <SearchBar 
                    handleSearch={searchScholarships}
                    searchPlaceholder="Search scholarships..."
                    category="scholarship"
                />
                <Filter items={items} category={"scholarship"}/>
                <ListLayout 
                    items={scholarships}
                    category="scholarship"
                    page={page}
                />
                <Pagination 
                    totalPage={totalPage} 
                    currentPage={page} 
                    category="scholarship"
                    searchQuery={searchQuery} 
                />
            </ListContainer>
            <SocialMediaLinks notAuth={true}/>
            <FloatingContact />
            <Footer />
        </>
    );
};

export default ScholarshipPage;
