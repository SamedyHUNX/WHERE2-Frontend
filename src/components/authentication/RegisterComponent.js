import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import FormInput from "./../reusable/InputField";
import ButtonComponent from "../reusable/Button";
import ContainerComponent from "./../reusable/ContainerComponent";
import { clearAuthState } from "./../../features/slices/authSlice";
import { LoadingOverlay, LoadingSpinner } from "./../reusable/Loading";
import { MapPin } from "lucide-react";
import useGeolocation from "./../../hooks/useGeolocation";

// THIS COMPONENT IS USED TO REGISTER USER
const RegisterComponent = () => {
  // THERE ARE TWO TYPE OF FORMS: PERSONAL AND BUSSINESSS
  const [accountType, setAccountType] = useState("personal");
  const [formData, setFormData] = useState({
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
  });
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, message } = useSelector((state) => state.auth);

  const {
    location,
    getLocation,
    isGettingLocation,
    error: locationError,
  } = useGeolocation();

  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (location) {
      setFormData((prevData) => ({
        ...prevData,
        location,
      }));
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

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

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(", ")}`);
      return false;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  if (status === "loading") {
    return <LoadingOverlay isFullScreen={true} message="We are creating your account..."/>
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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

      navigate("/terms-and-conditions", { state: { registrationData } });
    }
  };

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
    <ContainerComponent title="CREATE ACCOUNT">
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
        {accountType === "business" && (
          <FormInput
            name="entity"
            label="Enter your entity name"
            type="text"
            value={formData.entity}
            onChange={handleInputChange}
            required
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
          />
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
          <FormInput
            name="firstName"
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <FormInput
            name="lastName"
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
        {accountType === "personal" && (
          <FormInput
            name="userName"
            label="Username"
            type="text"
            value={formData.userName}
            onChange={handleInputChange}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        )}
        <FormInput
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        <FormInput
          name="phoneNumber"
          label="Phone Number"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        <div className="relative">
          <FormInput
            name="location"
            label="Location"
            type="text"
            value={formData.location}
            onChange={handleInputChange}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
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
        {isGettingLocation && <LoadingOverlay />}
        {locationError && (
          <p className="text-red-500 text-sm">{locationError}</p>
        )}
        {accountType === "business" && (
          <FormInput
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
          <FormInput
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <FormInput
            name="passwordConfirm"
            label="Confirm Password"
            type="password"
            value={formData.passwordConfirm}
            onChange={handleInputChange}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
