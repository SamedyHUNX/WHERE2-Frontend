import config from "../../../../config";
import ListingComponent from "../../../reusable/ListingComponent";
import React, { useEffect, useState } from "react";
import { LoadingOverlay } from "../../../reusable/Loading";
import { useJobFunctions } from "../../../reusable/functions/JobAction";
import ButtonComponent from "../../../reusable/Button";
import { 
  TextField, 
  InputAdornment,
  Pagination
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const PartTimeJobListing = () => {
  const [partTimeJobs, setPartTimeJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showApproved, setShowApproved] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 15;

  // Pass the update functions to useJobFunctions
  const handleJobUpdate = (jobId, newApprovalStatus) => {
    const updatedJobs = partTimeJobs.map(job =>
      job.id === jobId ? { ...job, isApproved: newApprovalStatus } : job
    );
    setPartTimeJobs(updatedJobs);
    
    // Reapply filters after update
    const newFilteredJobs = filterJobs(updatedJobs, showApproved, searchTerm);
    setFilteredJobs(newFilteredJobs);
    setSearchResults(newFilteredJobs);
  };

  const { getJobFunctions } = useJobFunctions(handleJobUpdate);

  // Comprehensive filtering logic
  const filterJobs = (jobList, approved, search) => {
    return jobList.filter(job => {
      // First filter by approval status
      const matchesApprovalStatus = approved ? job.isApproved : !job.isApproved;
      
      // Then filter by search term
      const searchText = search.toLowerCase();
      const matchesSearch = 
        job.company_name.toLowerCase().includes(searchText) ||
        job.position.toLowerCase().includes(searchText) ||
        job.location.toLowerCase().includes(searchText) ||
        (job.job_desc || '').toLowerCase().includes(searchText);
      
      return matchesApprovalStatus && matchesSearch;
    });
  };

  const getAllPartTimeJobs = async () => {
    try {
      const response = await fetch(config.job.getAllJob);
      if (!response.ok) {
        throw new Error("Failed to fetch part-time jobs");
      }
      const data = await response.json();
      const jobsData = data.data.jobs || [];
      setPartTimeJobs(jobsData);

      // Filter and set initially approved jobs
      const approvedJobs = jobsData.filter(job => job.isApproved);
      setFilteredJobs(approvedJobs);
      setSearchResults(approvedJobs);
      setCurrentPage(1); // Reset to first page when jobs are loaded
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPartTimeJobs();
  }, []);

  // Handle search term and approval status changes
  useEffect(() => {
    const newFilteredJobs = filterJobs(partTimeJobs, showApproved, searchTerm);
    setFilteredJobs(newFilteredJobs);
    setSearchResults(newFilteredJobs);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [searchTerm, showApproved, partTimeJobs]);

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = searchResults.slice(indexOfFirstJob, indexOfLastJob);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  const toggleApproval = () => {
    setShowApproved(!showApproved);
  };

  return (
    <>
      <div className="flex items-center justify-between mx-5 mb-4">
        <ButtonComponent onClick={toggleApproval} className={'rounded-md'}>
          {showApproved ? "Show Unapproved Posts" : "Show Approved Posts"}
        </ButtonComponent>

        <TextField
          variant="outlined"
          placeholder="Search jobs globally..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <ListingComponent
        data={currentJobs}
        title={showApproved ? "Approved Part-time Jobs" : "Unapproved Part-time Jobs"}
        columns={["id", "company_id", "company_name"]}
        isLoading={loading}
        actions={getJobFunctions(showApproved)}
        totalItems={searchResults.length}
        additionalStats={[
          { label: "Total Jobs", value: partTimeJobs.length },
          { label: "Search Results", value: searchResults.length }
        ]}
      />

      <div className="flex justify-center mt-4">
        <Pagination
          count={Math.ceil(searchResults.length / jobsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </>
  );
};

export default PartTimeJobListing;