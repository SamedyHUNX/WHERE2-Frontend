import config from "./../../../config";

// Function to handle the deletion API call
  const deleteUser = async (userId) => {
    const response = await fetch(config.analytics.deleteUserById(userId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error deactivating user');
    }
  
    return response;
  };


export default deleteUser