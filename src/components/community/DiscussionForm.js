import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGeolocation from "./../../hooks/useGeolocation";
import ContainerComponent from "./../reusable/ContainerComponent";
import FormInput from "./../reusable/InputField";
import ButtonComponent from "./../reusable/Button";
import { MapPin } from "lucide-react";
import { useLocation } from "react-router-dom";
import { LoadingSpinner } from "./../reusable/Loading";


const DiscussionForm = ({ formData, handleChange, handleLocationChange, handleSubmit, isSubmitting, error }) => {
    const navigate = useNavigate();
    const { isGettingLocation, getLocation, error: locationError } = useGeolocation();
    const location = useLocation();

     // State for validation errors
     const [validationErrors, setValidationErrors] = useState({
      title: '',
      content: '',
      location: ''
    });

    const notDiscussionPath = location.pathname !== '/discussions';

    // Validation functions
    const validateTitle = (title) => {
      if (!title.trim()) {
          return 'Title is required';
      }
      if (title.trim().length < 10) {
          return 'Title must be at least 10 characters long';
      }
      return '';
  };

  const validateContent = (content) => {
      if (!content.trim()) {
          return 'Content is required';
      }
      if (content.trim().length < 10) {
          return 'Content must be at least 10 characters long';
      }
      return '';
  };

  const validateLocation = (location) => {
      if (!notDiscussionPath) {
          if (!location.trim()) {
              return 'Location is required';
          }
      }
      return '';
  };

  // Enhanced change handler with validation
  const handleValidatedChange = (e) => {
      const { name, value } = e.target;
      
      // Call original handleChange
      handleChange(e);

      // Perform validation based on field
      let error = '';
      switch (name) {
          case 'title':
              error = validateTitle(value);
              break;
          case 'content':
              error = validateContent(value);
              break;
          case 'location':
              error = validateLocation(value);
              break;
          default:
              break;
      }

      // Update validation errors
      setValidationErrors(prev => ({
          ...prev,
          [name]: error
      }));
  };

  // Submit handler with comprehensive validation
  const handleValidatedSubmit = (e) => {
      e.preventDefault();

      // Validate all fields
      const titleError = validateTitle(formData.title);
      const contentError = validateContent(formData.content);
      const locationError = validateLocation(formData.location);

      // Update validation errors
      setValidationErrors({
          title: titleError,
          content: contentError,
          location: locationError
      });

      // Only submit if no errors
      const hasErrors = titleError || contentError || locationError;
      if (!hasErrors) {
          handleSubmit(e);
      }
  };
  
  return (
    <ContainerComponent className={`${notDiscussionPath ? "w-full" : ""} rounded-md`} title="Create New Post">
        <form onSubmit={handleValidatedSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                    {error}
                </div>
            )}
            
            {/* Title Input with Validation */}
            <div>
                <FormInput
                    label="Title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleValidatedChange}
                    placeholder="Title needs to be at least 10 characters long."
                    required
                    className={validationErrors.title ? "border-red-500" : ""}
                />
                {validationErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                )}
            </div>

            {/* Location Input (only for discussions page) */}
            {!notDiscussionPath && (
                <div className="relative">
                    <FormInput
                        name="location"
                        label="Location"
                        placeholder="Click on the pin button to automatically fill in the location."
                        type="text"
                        value={formData.location}
                        onChange={handleValidatedChange}
                        required
                        autoComplete="off"
                        className={validationErrors.location ? "border-red-500" : ""}
                    />
                    {validationErrors.location && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>
                    )}
                    <ButtonComponent
                        variant="primary"
                        size="small"
                        onClick={() => {
                            getLocation().then((location) => {
                                // Clear any previous location error
                                setValidationErrors(prev => ({
                                    ...prev,
                                    location: ''
                                }));
                                handleLocationChange(location);
                            });
                        }}
                        disabled={isGettingLocation}
                        className="absolute right-2 bottom-0 transform -translate-y-1/2"
                    >
                        {isGettingLocation ? (
                            <LoadingSpinner size={16} />
                        ) : (
                            <MapPin size={20} />
                        )}
                    </ButtonComponent>
                </div>
            )}

            {/* Content Textarea with Validation */}
            <div>
                <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 whitespace-nowrap"
                >
                    Content
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleValidatedChange}
                    placeholder="Content needs to be at least 10 characters long."
                    required
                    className={`mt-3 p-2 block w-full text-justify rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border-[2px] min-h-[200px] p-2 resize-none ${validationErrors.content ? 'border-red-500' : ''}`}
                />
                {validationErrors.content && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.content}</p>
                )}
            </div>

            {/* Hidden input for pathname */}
            <input
                type="hidden"
                name="pathname"
                value={formData.pathname}
            />

            {/* Submit and Cancel Buttons */}
            <div className="flex gap-4 justify-end">
                <ButtonComponent
                    variant="outline"
                    rounded={false}
                    onClick={() => window.location.reload()}
                    className={"mt-12 w-[197px] h-[38px] sm:w-[343px] sm:h-[50px]"}
                    disabled={isSubmitting}
                >
                    Cancel
                </ButtonComponent>
                <ButtonComponent
                    variant="primary"
                    type="submit"
                    rounded={false}
                    className={"mt-12 w-[197px] h-[38px] sm:w-[343px] sm:h-[50px]"}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating your post..." : "Post"}
                </ButtonComponent>
            </div>
        </form>
    </ContainerComponent>
);
};

export default DiscussionForm;