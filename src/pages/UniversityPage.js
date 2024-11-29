// import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useQueryParams } from '../hooks/useQueryParams';

import { setTotalPage } from '../features/slices/paginationSlice';
import { filterByLocation } from '../features/slices/filterSlice';
import { fetchUniversities, searchUniversities, setUniversities , setLoading, fetchFilteredMajor, fetchFilteredPrice } from '../features/slices/universitySlice';

import { LoadingOverlay } from '../components/reusable/Loading';

//layouts
import ListLayout from '../layouts/ListLayout';

//resuable
import Navbar from '../components/reusable/Navbar';
import Footer from '../components/reusable/Footer';
import Filter from '../components/reusable/Filter';
import SearchBar from '../components/reusable/SearchBar';
import Pagination from '../components/reusable/Pagination';
import ListContainer from '../components/reusable/ListContainer';
import FloatingContact from './../components/reusable/FloatingContact';
import SocialMediaLinks from './../components/reusable/SocialMediaLinks';

/** Enable for debugging */
const isDebug = false;

const UniversityPage = () => {
    const urlParams = useQueryParams();

    const page = parseInt(urlParams.get('page')) || 1;
    const location = urlParams.get('location') || '';
    const searchQuery = urlParams.get('q') || '';
    const major = urlParams.get('major') || '';
    let price = urlParams.get('price') || '';


    const dispatch = useDispatch();
    const { universities, loading, error, filteredUniversity,filteredPrice } = useSelector((state) => state.universities);
    const { totalPage } = useSelector((state) => state.pagination);

    // university filter options
    const items = [
        {
            id: '2eqsa',
            label: 'Location',
            content: ['Phnom Penh', 'Siem Reap']
        },
        {
            id: '2eqsb',
            label: 'Major',
            content: ['Engineer', 'Science and Technology', 'Law','Foriegn Language','Tourism','Business','Management','Design and Art', 'Education', 'Economics']
        },
        {
            id: '2eqsc',
            label: 'Price',
            content: ['$200-400', '$400-600','$600-800']
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
        const { list , totalPages } = await filterByLocation({ page, location , category: "university"})
        dispatch(setUniversities(list))
        dispatch(setTotalPage(totalPages))
        if (list.length > 0) setLoading(false)
    }

    /**
     * useEffect Hook
     *
     * Fetches universities based on current page if no search query is provided.
     * If a search query is present, it triggers the search functionality.
     *
     * @param {Function} dispatch - Redux dispatch function
     * @param {number} page - Current page number for pagination
     * @param {string} searchQuery - Current search query
     * @param {boolean} isDebug - Flag for enabling debug logs
     */
    useEffect(() => {
        if (searchQuery !== "") {
            dispatch(searchUniversities({ page, query : searchQuery}));
            
        } else if (location !== "") {
            setLoading(true)
            filterLocation()
        } else if (major !== "") {
            setLoading(true)
            dispatch(fetchFilteredMajor(major))
            dispatch(setTotalPage(1))

        }else if (price !== "") {
            setLoading(true)
            price = price.split('-')
            dispatch(fetchFilteredPrice({ min: price[0].replace('$',''), max: price[1] }))
            dispatch(setTotalPage(1))
        }else {
            dispatch(fetchUniversities({ page }));
        }
        
    }, [dispatch, page, searchQuery, location, major, price]);

    return (
        <>
            <Navbar />
            <ListContainer>
                {loading && <LoadingOverlay />}
                <SearchBar 
                    handleSearch={searchUniversities}
                    searchPlaceholder="Search universities..."
                    category="university"
                />
                <Filter 
                    items={items}
                    category={"university"}
                    location={location}
                    major={major}
                    price={price}
                />
                <ListLayout 
                    items={major !== ''?filteredUniversity:price !== ''? filteredPrice: universities}
                    category="university"
                    page={page} 
                    isLoading={loading}  
                    major={major}
                    price = {price}
                />
                <Pagination 
                    totalPage={totalPage} 
                    currentPage={page}
                    category="university"
                    searchQuery={searchQuery}/>
            </ListContainer>
            <SocialMediaLinks notAuth={true}/>
             <FloatingContact />
            <Footer />
        </>
    );
};

export default UniversityPage;

