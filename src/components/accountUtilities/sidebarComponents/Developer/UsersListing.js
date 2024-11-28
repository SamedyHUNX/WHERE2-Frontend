import React, { useEffect, useState } from 'react';
import ListingComponent from "./../../../reusable/ListingComponent";
import { useUserFunctions } from './../../../reusable/functions/UserFunction';
import config from "./../../../../config";
import { LoadingOverlay } from "./../../../reusable/Loading";
import ButtonComponent from "./../../../reusable/Button";

const UserListing = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActive, setShowActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  // Pass the update function to useUserFunctions
  const handleUserUpdate = (userId, newActiveStatus) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, isActive: newActiveStatus } : user
    );
    setUsers(updatedUsers);
    
    // Reapply filters after update
    const newFilteredUsers = filterUsers(updatedUsers, showActive, searchTerm);
    setFilteredUsers(newFilteredUsers);
    setSearchResults(newFilteredUsers);
  };

  const { getUserFunctions } = useUserFunctions(handleUserUpdate);

  // Comprehensive filtering logic
  const filterUsers = (userList, active, search) => {
    return userList.filter(user => {
      // First filter by active status
      const matchesActiveStatus = active ? user.isActive : !user.isActive;
      
      // Then filter by search term
      const searchText = search.toLowerCase();
      const matchesSearch = 
        user.email.toLowerCase().includes(searchText) ||
        (user.entity || '').toLowerCase().includes(searchText) ||
        user.role.toLowerCase().includes(searchText) ||
        (user.location || '').toLowerCase().includes(searchText);
      
      return matchesActiveStatus && matchesSearch;
    });
  };

  const getAllUsers = async () => {
    try {
      const response = await fetch(config.analytics.getAllUsers);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      const usersData = data.data || [];
      setUsers(usersData);

      // Filter and set initially active users
      const activeUsers = usersData.filter(user => user.isActive);
      setFilteredUsers(activeUsers);
      setSearchResults(activeUsers);
      setCurrentPage(1); // Reset to first page when users are loaded
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Handle search term changes
  useEffect(() => {
    const newFilteredUsers = filterUsers(users, showActive, searchTerm);
    setFilteredUsers(newFilteredUsers);
    setSearchResults(newFilteredUsers);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [searchTerm, showActive, users]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = searchResults.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <LoadingOverlay message="Fetching users data..." />;
  }

  if (!users || users.length === 0) {
    return <div>No users found.</div>;
  }

  const toggleActiveStatus = () => {
    setShowActive(!showActive);
  };

  return (
    <main>
      <div className="flex items-center justify-between mx-5 mb-4">
        <ButtonComponent onClick={toggleActiveStatus} className={'rounded-md'}>
          {showActive ? "Show Inactive Users" : "Show Active Users"}
        </ButtonComponent>

        <TextField
          variant="outlined"
          placeholder="Search users globally..."
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
        title={showActive ? "Active Users" : "Inactive Users"}
        data={currentUsers}
        columns={["id", "email", "role"]}
        totalItems={searchResults.length}
        additionalStats={[
          { label: "Total Admins", value: users.filter(user => user.role === "admin").length },
          { label: "Total Inactive", value: users.filter(user => !user.isActive).length },
          { label: "Search Results", value: searchResults.length }
        ]}
        actions={getUserFunctions(showActive)}
      />

      <div className="flex justify-center mt-4">
        <Pagination
          count={Math.ceil(searchResults.length / usersPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </main>
  );
};

export default UserListing;