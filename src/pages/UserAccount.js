import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FormInput from "./../components/reusable/InputField";
import useAuth from "./../hooks/useAuth";
import { Loader2, MapPin } from "lucide-react"
import { LoadingOverlay } from "./../components/reusable/Loading";
import VisitorTracker from "./../components/reusable/VisitorTracker";
import PictureUpload from "./../components/reusable/PhotoUpload";
import useGeolocation from "./../hooks/useGeolocation";
import axios from "axios";
import config from "./../config";
import * as yup from 'yup';

const updateProfileSchema = yup.object().shape({
  phoneNumber: yup.string().trim().matches(/^\+?[\d\s-()]{10,}$/, 'Invalid phone number format'),
  location: yup.string().trim().max(200),
  bio: yup.string().trim().max(500),
  gender: yup.string().trim().oneOf(['male', 'female', 'others', 'Not specified']),
  dateOfBirth: yup.date().max(new Date(), 'Date of birth cannot be in the future').nullable(),
});

const UserAccount = ({ userInfo }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const { role, loading, isLoggedIn, token, userId } = useAuth();
  const { location: geoLocation, getLocation, isGettingLocation, error: geoError } = useGeolocation();
  const [validationErrors, setValidationErrors] = useState({});

  const [editableFields, setEditableFields] = useState({
    bio: userInfo?.bio || '',
    phoneNumber: userInfo?.phoneNumber || '',
    location: userInfo?.location || '',
    gender: userInfo?.gender || 'Not specified',
    dateOfBirth: userInfo?.dateOfBirth || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!role || !isLoggedIn || !token)) {
      setShowLoadingOverlay(true);
      const timer = setTimeout(() => {
        setShowLoadingOverlay(false);
        navigate("/login", { replace: true });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, role, isLoggedIn, token, navigate]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Update location field when geolocation is received
  useEffect(() => {
    if (geoLocation && isEditing) {
      setEditableFields(prev => ({
        ...prev,
        location: geoLocation
      }));
    }
  }, [geoLocation, isEditing]);

  const handleEdit = () => {
    setValidationErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditableFields({
      bio: userInfo?.bio || '',
      phoneNumber: userInfo?.phoneNumber || '',
      location: userInfo?.location || '',
      gender: userInfo?.gender || 'Not specified',
      dateOfBirth: userInfo?.dateOfBirth || ''
    });
    setValidationErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setValidationErrors({});

    try {
      await updateProfileSchema.validate(editableFields, { abortEarly: false });

      const response = await axios.patch(
        `${config.profile.updateMyProfile(userId)}`,
        editableFields,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === "success") {
        const updatedData = response.data.data;
        setEditableFields({
          bio: updatedData.bio || '',
          phoneNumber: updatedData.phoneNumber || '',
          location: updatedData.location || ''
        });
        setIsEditing(false);
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setValidationErrors(errors);
      } else if (error.response) {
        setValidationErrors({ api: error.response.data.message || 'Failed to update profile' });
      } else {
        setValidationErrors({ api: 'Network error. Please try again.' });
      }
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLocationUpdate = async () => {
    try {
      await getLocation();
      if (geoError) {
        setValidationErrors(prev => ({
          ...prev,
          location: geoError
        }));
      }
    } catch (error) {
      setValidationErrors(prev => ({
        ...prev,
        location: 'Failed to get location'
      }));
    }
  };

  if (loading) {
    return <LoadingOverlay isFullScreen={true} message="We are fetching your profile..." />;
  }

  if (!userInfo) {
    return <div>No user information available.</div>;
  }

  const formattedDate = new Date(userInfo.createdAt).toLocaleDateString("en-CA");

  return (
    <>
      {showLoadingOverlay && (
        <LoadingOverlay message="You are not logged in. You are being redirected to the login page..." isFullScreen={true} />
      )}

      <section className="w-full h-full bg-white rounded-3xl mb-[32px] shadow-md border">
        <div className="lg:w-full lg:py-[128px] lg:mx-auto h-full min-h-fit px-4 lg:px-[64px] pb-12 sm:px-6 lg:pb-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center justify-center">
              <PictureUpload userId={userInfo.id} folder={'profile-picture'} />
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}
          </div>

          <p className="text-center mb-3">{userInfo.firstName ? userInfo.firstName : userInfo.userName}</p>

          {validationErrors.api && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {validationErrors.api}
            </div>
          )}

          <FormInput
            label="Bio"
            value={isEditing ? editableFields.bio : userInfo?.bio}
            onChange={(e) => setEditableFields(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell everyone about yourself..."
            className="p-3 sm:p-4 h-fit"
            rounded
            disabled={!isEditing}
            error={validationErrors.bio}
          />

          <div className="space-y-6 min-h-full">
            {userInfo.entity && (
              <FormInput
                label="Entity"
                value={userInfo.entity}
                disabled
                rounded
                className="p-3 sm:p-4"
              />
            )}

            <div className="flex flex-col lg:flex-row gap-4">
              <FormInput
                label="First Name"
                value={userInfo.firstName}
                placeholder="First Name"
                className="p-3 sm:p-4"
                disabled
                rounded
              />
              <FormInput
                label="Last Name"
                value={userInfo.lastName}
                placeholder="Last Name"
                className="p-3 sm:p-4"
                disabled
                rounded
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <FormInput
                label="Email"
                value={userInfo.email}
                type="email"
                rounded
                disabled
                className="p-3 sm:p-4"
              />
              <FormInput
                label="Phone Number"
                value={isEditing ? editableFields.phoneNumber : userInfo.phoneNumber}
                onChange={(e) => setEditableFields(prev => ({ ...prev, phoneNumber: e.target.value }))}
                type="tel"
                rounded
                disabled={!isEditing}
                className="p-3 sm:p-4"
                error={validationErrors.phoneNumber}
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
            <FormInput
              label="Gender"
              value={isEditing ? editableFields.gender : (userInfo?.gender || 'Not specified')}
              onChange={(e) => setEditableFields(prev => ({ ...prev, gender: e.target.value }))}
              disabled={!isEditing}
              rounded
              className="p-3 sm:p-4"
              error={validationErrors.gender}
              type="select"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'others', label: 'Others' },
                { value: 'Not specified', label: 'Not specified' }
              ]}
            />
            <FormInput
              label="Date of Birth"
              value={isEditing 
                ? editableFields.dateOfBirth 
                : userInfo?.dateOfBirth 
                  ? new Date(userInfo.dateOfBirth).toISOString().split('T')[0] 
                  : ''
              }
              onChange={(e) => setEditableFields(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              type="date"
              rounded
              disabled={!isEditing}
              className="p-3 sm:p-4"
              error={validationErrors.dateOfBirth}
            />
          </div>

            <div className="relative">
              <FormInput
                label="Location"
                placeholder="Enter Location"
                value={isEditing ? editableFields.location : userInfo.location}
                onChange={(e) => setEditableFields(prev => ({ ...prev, location: e.target.value }))}
                disabled={!isEditing || isGettingLocation}
                rounded
                className="p-3 sm:p-4"
                error={validationErrors.location}
              />
              {isEditing && (
                <button
                  onClick={handleLocationUpdate}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700"
                  type="button"
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <MapPin className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>

            <FormInput
              label="Account Creation Date"
              value={formattedDate}
              disabled
              rounded
              className="p-3 sm:p-4"
            />

            <FormInput
              label="Account Status"
              value={userInfo.isActive ? "Active" : "Not Active"}
              disabled
              rounded
              className="p-3 sm:p-4"
            />
            <VisitorTracker path={location.pathname} />
          </div>
        </div>
      </section>
    </>
  );
};

export default UserAccount;
