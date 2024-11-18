import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchUniversity } from './../features/slices/universitySlice';

import DetailLayout from './../layouts/DetailLayout';

import Navbar from './../components/reusable/Navbar';
import Footer from './../components/reusable/Footer';
import { LoadingOverlay } from './../components/reusable/Loading';
import FloatingContact from './../components/reusable/FloatingContact';

const UniversityDetailPage = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const university = useSelector((state) => state.universities.university);
    const isLoading = useSelector((state) => state.universities.isLoading);

    useEffect(() => {
        dispatch(fetchUniversity(id));
    }, [dispatch, id]);

    if (isLoading) {
        return <LoadingOverlay />;
    }

    // Check for image in the university's details (university.list.image_url)
    // Fallback to the first image in the university.images array if available
    const imageUrl = university?.list?.image_url || (university?.images && university.images[0]?.imageUrl);

    return (
        <>
            <Navbar />
            {university && (
                <DetailLayout
                    image={imageUrl}
                    description={university.list?.description}
                    title={university.list?.name}
                    websiteLink={university.list?.website}
                    facebookLink={university.list?.facebook_url}
                    instagramLink={university.list?.instagram_url}
                    twitterLink={university.list?.twitter_url}
                    telegramLink={university.list?.telegram_url}
                />
            )}
            <FloatingContact />
            <Footer />
        </>
    );
};

export default UniversityDetailPage;