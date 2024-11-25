import config from "./../../../../config";
import ListingComponent from "./../../../reusable/ListingComponent";
import React, { useEffect, useState } from "react";
import { LoadingOverlay } from "./../../../reusable/Loading";
import ButtonComponent from "./../../../reusable/Button";
import { useAccommodationFunctions } from "../../../reusable/functions/AccommodationFunction";
const AccommodationListing = () => {
  const [Accommodations, setAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApproved, setShowApproved] = useState(true);

  // Pass the update function to useAccommodationFunctions
  const handleAccommodationUpdate = (accId, newApprovalStatus) => {
    const updatedAccommodations = Accommodations.map((acc) =>
      acc.id === accId ? { ...acc, isApproved: newApprovalStatus } : acc
    );
    setAccommodations(updatedAccommodations);

    // Update filtered Accommodations based on current view
    const newFilteredAccommodations = updatedAccommodations.filter((acc) =>
      showApproved ? acc.isApproved : !acc.isApproved
    );
    setFilteredAccommodations(newFilteredAccommodations);
  };

  const { getAccommodationFunctions } = useAccommodationFunctions(
    handleAccommodationUpdate
  );

  const getAllAccommodations = async () => {
    try {
      const response = await fetch(config.accommodation.getAllAccommodationList);
      if (!response.ok) {
        throw new Error("Failed to fetch Accommodations");
      }
      const data = await response.json();
      const accommodationData = data.accommodations || [];
      setAccommodations(accommodationData);

      // Filter and set initially approved Accommodations
      const approvedAccommodations = accommodationData.filter(
        (acc) => acc.isApproved
      );
      setFilteredAccommodations(approvedAccommodations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAccommodations();
  }, []);

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!Accommodations || Accommodations.length === 0) {
    return <div>No Accommodations found.</div>;
  }

  const toggleApproval = () => {
    setShowApproved(!showApproved);
    const newFilteredAccommodations = Accommodations.filter((acc) =>
      !showApproved ? acc.isApproved : !acc.isApproved
    );
    setFilteredAccommodations(newFilteredAccommodations);
  };

  return (
    <main>
      <ButtonComponent onClick={toggleApproval} className={"rounded-md"}>
        {showApproved ? "Show Unapproved Posts" : "Show Approved Posts"}
      </ButtonComponent>

      <ListingComponent
        title={
          showApproved ? "Approved Accommodations" : "Unapproved Accommodations"
        }
        data={filteredAccommodations}
        columns={["id", "name"]}
        totalItems={filteredAccommodations.length}
        actions={getAccommodationFunctions(showApproved)}
      />
    </main>
  );
};

export default AccommodationListing;
