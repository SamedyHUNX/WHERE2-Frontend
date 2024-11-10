import config from "./../../../../config";
import ListingComponent from "./../../../reusable/ListingComponent";
import React, { useEffect, useState } from "react";
import { LoadingOverlay } from "./../../../reusable/Loading";
import { useUniversityFunctions } from "./../../../reusable/functions/UniversityFunctions";
import ButtonComponent from "./../../../reusable/Button";

const UniversityListing = () => {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApproved, setShowApproved] = useState(true);

  // Pass the update function to useUniversityFunctions
  const handleUniversityUpdate = (uniId, newApprovalStatus) => {
    const updatedUniversities = universities.map((uni) =>
      uni.id === uniId ? { ...uni, isApproved: newApprovalStatus } : uni
    );
    setUniversities(updatedUniversities);

    // Update filtered universities based on current view
    const newFilteredUniversities = updatedUniversities.filter((uni) =>
      showApproved ? uni.isApproved : !uni.isApproved
    );
    setFilteredUniversities(newFilteredUniversities);
  };

  const { getUniversityFunctions } = useUniversityFunctions(
    handleUniversityUpdate
  );

  const getAllUniversities = async () => {
    try {
      const response = await fetch(config.universities.getUniversityList);
      if (!response.ok) {
        throw new Error("Failed to fetch universities");
      }
      const data = await response.json();
      const universityData = data.universities || [];
      setUniversities(universityData);

      // Filter and set initially approved universities
      const approvedUniversities = universityData.filter(
        (uni) => uni.isApproved
      );
      setFilteredUniversities(approvedUniversities);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUniversities();
  }, []);

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!universities || universities.length === 0) {
    return <div>No universities found.</div>;
  }

  const toggleApproval = () => {
    setShowApproved(!showApproved);
    const newFilteredUniversities = universities.filter((uni) =>
      !showApproved ? uni.isApproved : !uni.isApproved
    );
    setFilteredUniversities(newFilteredUniversities);
  };

  return (
    <main>
      <ButtonComponent onClick={toggleApproval} className={"rounded-md"}>
        {showApproved ? "Show Unapproved Posts" : "Show Approved Posts"}
      </ButtonComponent>

      <ListingComponent
        title={
          showApproved ? "Approved Universities" : "Unapproved Universities"
        }
        data={filteredUniversities}
        columns={["id", "email", "name", "role"]}
        totalItems={filteredUniversities.length}
        actions={getUniversityFunctions(showApproved)}
      />
    </main>
  );
};

export default UniversityListing;
