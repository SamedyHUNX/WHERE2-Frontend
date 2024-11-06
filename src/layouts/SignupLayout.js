// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin } from "lucide-react";

// Import components
import Form from "../components/reusable/Form/Form";
import Radio from "../components/reusable/Radio/Radio";
import Personal from "./Signup.Personal.Layout";
import Business from "./Signup.Business.Layout";

// Import custom hooks
import useGeolocation from '../hooks/useGeolocation';

// Import Redux slices
import { clearAuthState } from '../features/slices/authSlice';

// Define options for account types
const options = [
    { value: 'personal', label: 'Personal', defaultChecked: true },
    { value: 'business', label: 'Business', defaultChecked: false },
];

export default function RegisterLayout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /**
     * State to manage the selected account type (personal or business).
     * @type {[string, function]}
     */
    const [selectedOption, setSelectedOption] = useState(options[0].value);

    /**
     * State to manage form data for registration.
     * @type {[Object, function]}
     */
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

    /**
     * State to manage error messages.
     * @type {[string, function]}
     */
    const [error, setError] = useState("");

    /**
     * Geolocation hook to manage user's location.
     */
    const { location, getLocation, isGettingLocation, error: locationError } = useGeolocation();

    /**
     * Handle option change for account type (Personal/Business).
     * @param {Object} event - The event object.
     */
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setError("");
    };

    /**
     * Update formData with the user's location when it is obtained.
     */
    useEffect(() => {
        if (location) {
            setFormData((prevData) => ({
                ...prevData,
                location: `${location.latitude}, ${location.longitude}`,
            }));
        }
    }, [location]);

    /**
     * Clear authentication state on component mount.
     */
    useEffect(() => {
        dispatch(clearAuthState());
    }, [dispatch]);

    /**
     * Handle location button click to get the user's current location.
     */
    const handleLocationButtonClick = () => {
        getLocation();
    };

    /**
     * Component for the "Get Location" button.
     * @returns {JSX.Element}
     */
    const GetLocationButton = () => (
        <button
            type="button"
            className="mx-3"
            onClick={handleLocationButtonClick}
            disabled={isGettingLocation}
            title="Get current location"
        >
            <MapPin />
        </button>
    );

    /**
     * Component for the "Get Date of Birth" button.
     * @returns {JSX.Element}
     */
        const GetDateOfBirth = () => (
            <button
                type="button"
                className="mx-3"
                onClick={handleLocationButtonClick}
                // disabled={isGettingLocation}
                title="Get birth date"
            >
                <MapPin />
            </button>
        );

    return (
        <Form title="Sign Up">
            <p className="message">Signup now and get full access to our app.</p>
            <Radio options={options} onChange={handleOptionChange} />
            {selectedOption === 'personal' && (
                <Personal 
                    formData={formData} 
                    setFormData={setFormData} 
                    GetLocation={GetLocationButton} 
                    setError={setError} 
                    error={error} 
                />
            )}
            {selectedOption === 'business' && (
                <Business 
                    formData={formData} 
                    setFormData={setFormData} 
                    GetLocation={GetLocationButton} 
                    setError={setError} 
                    error={error} 
                />
            )}
            <p className="signin">
                Already have an account? <Link to="/login" className="text-[rgb(0,122,255)] underline">Sign in</Link>
            </p>
        </Form>
    );
}
