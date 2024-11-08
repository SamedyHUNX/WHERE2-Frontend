import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import FormInput from "./../reusable/InputField";
import ButtonComponent from "../reusable/Button";
import ContainerComponent from "./../reusable/ContainerComponent";
import { clearAuthState } from "./../../features/slices/authSlice";
import { LoadingOverlay, LoadingSpinner } from "./../reusable/Loading";
import { MapPin, Eye, EyeOff } from "lucide-react";
import useGeolocation from "./../../hooks/useGeolocation";

// THIS COMPONENT IS USED TO REGISTER USER
const RegisterComponent = () => {
  const location = useLocation();
  const [accountType, setAccountType] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const STORAGE_KEY = 'registration_form_data';
  
  // Initialize form data with previous values if they exist
  const [formData, setFormData] = useState(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    const savedData = storedData ? JSON.parse(storedData) : location.state?.formData || {
      entity: "",
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      dateOfBirth: "",
      location: "",
      phoneNumber: "",
      password: "",
      passwordConfirm: "",
    };
    return savedData;
  });


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, message } = useSelector((state) => state.auth);

  const {
    location: geoLocation,
    getLocation,
    isGettingLocation,
    error: locationError,
  } = useGeolocation();

  useEffect(() => {
    return () => {
      // Only clear if navigating away from registration flow
      if (!window.location.pathname.includes('terms-and-conditions')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('registration_account_type');
      }
    };
  }, []);

  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (geoLocation) {
      setFormData((prevData) => ({
        ...prevData,
        location: geoLocation,
      }));
    }
  }, [geoLocation]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Save account type to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('registration_account_type', accountType);
  }, [accountType]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name, value) => {
    // Return null if field is valid, error message if invalid
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
        return null;
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters long';
        return null;
      
      case 'passwordConfirm':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return null;
      
      case 'phoneNumber':
        if (!value) return 'Phone number is required';
        if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) {
          return 'Please enter a valid 10-digit phone number';
        }
        return null;

      default:
        if (!value && touchedFields[name]) return 'This field is required';
        return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prevData => ({ ...prevData, [name]: value }));
    
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    // Validate field
    const error = validateField(name, value);
    
    // Update validation errors - remove error if field is valid
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      
      // Special handling for password confirmation
      if (name === 'password') {
        // Revalidate password confirmation if it exists
        if (formData.passwordConfirm) {
          const confirmError = validateField('passwordConfirm', formData.passwordConfirm);
          if (confirmError) {
            newErrors.passwordConfirm = confirmError;
          } else {
            delete newErrors.passwordConfirm;
          }
        }
      }
      
      return newErrors;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const validateForm = () => {
    const personalFields = [
      "firstName",
      "lastName",
      "userName",
      "email",
      "password",
      "passwordConfirm",
      "location",
    ];
    const businessFields = [
      "entity",
      "firstName",
      "lastName",
      "location",
      "phoneNumber",
      "email",
      "password",
      "passwordConfirm",
      "dateOfBirth",
    ];

    const requiredFields =
      accountType === "business" ? businessFields : personalFields;

    let errors = {};
    requiredFields.forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      errors = { ...errors, ...fieldErrors };
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        userName: accountType === "personal" ? formData.userName : undefined,
        location: formData.location,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        entity: formData.entity,
        formType: accountType,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
          : null,
      };

      // Pass the form data along with the registration data
      navigate("/terms-and-conditions", { 
        state: { 
          registrationData,
          formData: formData // Save form data for back navigation
        } 
      });
    }
  };

  const renderInput = (name, label, type = "text", required = true) => {
    const hasError = touchedFields[name] && validationErrors[name];
    const isPassword = type === "password";
    
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <FormInput
            name={name}
            type={isPassword ? (name === "password" ? (showPassword ? "text" : "password") : (showConfirmPassword ? "text" : "password")) : type}
            value={formData[name]}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required={required}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className={`w-full ${hasError ? 'border-red-500' : ''}`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => name === "password" ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {(name === "password" ? showPassword : showConfirmPassword) ? 
                              <Eye className="h-5 w-5 text-gray-500" /> :
                <EyeOff className="h-5 w-5 text-gray-500" /> 
              }
            </button>
          )}
        </div>
        {hasError && (
          <p className="text-red-500 text-xs mt-1">{validationErrors[name]}</p>
        )}
      </div>
    );
  };

  const handleBack = () => {
    navigate(-1)
  }

  if (status === "loading") {
    return <LoadingOverlay isFullScreen={true} message="We are creating your account..." />;
  }

  if (isGettingLocation) {
    return (
      <ContainerComponent title="CREATE ACCOUNT">
        <div className="flex justify-center">
          <LoadingOverlay message="We are fetching your location..." />
        </div>
      </ContainerComponent>
    );
  }

  return (
    <ContainerComponent>
            <div className="h-[50px]">
                <button
                  onClick={handleBack}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back
                </button>
              </div>

              <div className="mb-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 tacking-tight">
              Create a new account
            </h2>
          </div>

      <div className="flex justify-center mb-6 w-full">
        <button
          className={`mr-4 pb-2 ${
            accountType === "personal"
              ? "border-b-4 border-[#E6F3F9] font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setAccountType("personal")}
        >
          Personal
        </button>
        <button
          className={`ml-4 pb-2 ${
            accountType === "business"
              ? "border-b-4 border-[#E6F3F9] font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setAccountType("business")}
        >
          Business
        </button>
      </div>
      
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        {accountType === "business" && renderInput("entity", "Entity Name")}
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
          {renderInput("firstName", "First Name")}
          {renderInput("lastName", "Last Name")}
        </div>
        
        {accountType === "personal" && renderInput("userName", "Username")}
        {renderInput("email", "Email", "email")}
        {renderInput("phoneNumber", "Phone Number", "tel")}
        
        <div className="relative">
          {renderInput("location", "Location")}
          <button
            type="button"
            onClick={getLocation}
            disabled={isGettingLocation}
            className="absolute right-2 bottom-2 transform -translate-y-1/2"
            title="Get current location"
          >
            <MapPin size={20} />
          </button>
        </div>
        
        {locationError && (
          <p className="text-red-500 text-sm">{locationError}</p>
        )}
        
        {accountType === "business" && renderInput("dateOfBirth", "Date of Birth", "date")}
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
          {renderInput("password", "Password", "password")}
          {renderInput("passwordConfirm", "Confirm Password", "password")}
        </div>

        {status === "failed" && (
          <p className="text-red-500 text-sm text-center">{message}</p>
        )}

        <div className="flex justify-center items-center">
          <ButtonComponent
            variant="primary"
            className="mt-2 w-[197px] sm:w-full h-[38px] sm:w-[343px] sm:h-[50px]"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? <LoadingSpinner /> : "Next"}
          </ButtonComponent>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[rgb(0,122,255)] underline">
            Log in
          </Link>
        </p>
      </div>
    </ContainerComponent>
  );
};

export default RegisterComponent;