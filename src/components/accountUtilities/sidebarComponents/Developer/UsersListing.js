import React, { useEffect, useState } from 'react';
import ListingComponent from "./../../../reusable/ListingComponent";
import { useUserFunctions } from './../../../reusable/functions/UserFunction';
import config from "./../../../../config";
import { LoadingOverlay } from "./../../../reusable/Loading";
import ButtonComponent from "./../../../reusable/Button";

const UserListing = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActive, setShowActive] = useState(true);

  // Pass the update function to useUserFunctions
  const handleUserUpdate = (userId, newActiveStatus) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, isActive: newActiveStatus } : user
    );
    setUsers(updatedUsers);
    
    // Update filtered users based on current view
    const newFilteredUsers = updatedUsers.filter(user => 
      showActive ? user.isActive : !user.isActive
    );
    setFilteredUsers(newFilteredUsers);
  };

  const { getUserFunctions } = useUserFunctions(handleUserUpdate);

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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

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
    const newFilteredUsers = users.filter(user => 
      !showActive ? user.isActive : !user.isActive
    );
    setFilteredUsers(newFilteredUsers);
  };

  return (
    <main>
      <ButtonComponent onClick={toggleActiveStatus} className={'rounded-md mx-5'}>
        {showActive ? "Show Inactive Users" : "Show Active Users"}
      </ButtonComponent>

      <ListingComponent
        title={showActive ? "Active Users" : "Inactive Users"}
        data={filteredUsers}
        columns={["id", "email", "role"]}
        totalItems={filteredUsers.length}
        additionalStats={[
          { label: "Total Admins", value: users.filter(user => user.role === "admin").length },
          { label: "Total Inactive", value: users.filter(user => !user.isActive).length }
        ]}
        actions={getUserFunctions(showActive)}
      />
    </main>
  );
};

export default UserListing;