import config from "../../../../config";
import ListingComponent from "../../../reusable/ListingComponent";
import React, { useEffect, useState } from "react";
import { LoadingOverlay } from "../../../reusable/Loading";
import { useJobFunctions } from "../../../reusable/functions/JobAction";
import ButtonComponent from "../../../reusable/Button";

const PartTimeJobListing = () => {
  const [partTimeJobs, setPartTimeJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showApproved, setShowApproved] = useState(true);
  // Pass the update functions to useJobFunctions
  const handleJobUpdate = (jobId, newApprovalStatus) => {
    const updatedJobs = partTimeJobs.map(job =>
      job.id === jobId ? { ...job, isApproved: newApprovalStatus } : job
    );
    setPartTimeJobs(updatedJobs);
    
    // Update filtered jobs based on current view
    const newFilteredJobs = updatedJobs.filter(job => 
      showApproved ? job.isApproved : !job.isApproved
    );
    setFilteredJobs(newFilteredJobs);
  };

  const { getJobFunctions } = useJobFunctions(handleJobUpdate);

  const getAllPartTimeJobs = async () => {
    try {
      const response = await fetch(config.job.getAllJob);
      if (!response.ok) {
        throw new Error("Failed to fetch part-time jobs");
      }
      const data = await response.json();
      setPartTimeJobs(data.data.jobs);

      // Filter and set initially approved jobs
      const approvedJobs = data.data.jobs.filter(job => job.isApproved);
      setFilteredJobs(approvedJobs);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPartTimeJobs();
  }, []);

  if (loading) {
    return <LoadingOverlay />;
  }

  const toggleApproval = () => {
    setShowApproved(!showApproved);
    const newFilteredJobs = partTimeJobs.filter(job => 
      !showApproved ? job.isApproved : !job.isApproved
    );
    setFilteredJobs(newFilteredJobs);
  };

  return (
    <>
      <ButtonComponent onClick={toggleApproval} className={'rounded-md mx-5'}>
        {showApproved ? "Show Unapproved Posts" : "Show Approved Posts"}
      </ButtonComponent>

      <ListingComponent
        data={filteredJobs}
        title={showApproved ? "Approved Part-time Jobs" : "Unapproved Part-time Jobs"}
        columns={["id", "company_id", "company_name"]}
        isLoading={loading}
        actions={getJobFunctions(showApproved)}
        totalItems={filteredJobs.length}
      />
    </>
  );
};

export default PartTimeJobListing;