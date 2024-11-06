import React, { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { fetchScholarship } from "../features/slices/scholarshipsSlice";

import DetailLayout from "../layouts/DetailLayout";

import Navbar from '../components/reusable/Navbar';
import Footer from '../components/reusable/Footer';
import { LoadingOverlay } from "../components/reusable/Loading";

function ScholarDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const scholarship = useSelector((state) => state.scholarships.scholarship);
  const isLoading = useSelector((state) => state.scholarships.isLoading);
		
  useEffect(() => {
    dispatch(fetchScholarship(id))
  }, [dispatch, id])

  if (isLoading) {
    return <LoadingOverlay />;
  }

  
  return (
    <>
      <Navbar /> 
      { scholarship && (
        <DetailLayout 
          image={scholarship.image_url}
          description={scholarship.description}
          title={scholarship.name}
          websiteLink={scholarship.website}
          facebookLink={scholarship.facebook_url}
          instagramLink={scholarship.instagram_url}
          twitterLink={scholarship.twitter_url}
          telegramLink={scholarship.telegram_url}
        />        
      )}
      <Footer />
    </>
  );
}

export default ScholarDetail;