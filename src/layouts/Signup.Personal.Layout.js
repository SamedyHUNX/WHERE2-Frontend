import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/reusable/Form/Input";

export default function PersonalLayout({ formData, setFormData, GetLocation, setError, error }) {
    const navigate = useNavigate(); 

    // Define the input fields for the personal layout
    const personalFields = [
        { name: 'firstName', placeholder: 'Firstname' },
        { name: 'lastName', placeholder: 'Lastname' },
        { name: 'userName', placeholder: 'Username' },
        { name: 'email', placeholder: 'Email' },
        { name: 'phoneNumber', placeholder: 'Phone Number' },
        { name: 'location', placeholder: 'Location', Util: GetLocation },
        { name: 'password', placeholder: 'Password', type: 'password' },
        { name: 'passwordConfirm', placeholder: 'Confirm Password', type: 'password' },
    ];

    // Define the required fields for validation
    const requiredFields = [
        "firstName",
        "lastName",
        "userName",
        "email",
        "password",
        "passwordConfirm",
        "location",
    ];

    // Handle input changes and update formData state
    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value.trim() }));
    }

    // Validate the form input values
    function validateForm() {
        const missingFields = requiredFields.filter((field) => !formData[field] || /^\s*$/.test(formData[field]));

        if (missingFields.length > 0) {
            setError(`Please fill in all fields`);
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
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (validateForm()) {
            const registrationData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                userName: formData.userName,
                location: formData.location,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
                passwordConfirm: formData.passwordConfirm,
                entity: formData.entity,
                formType: "personal",
                dateOfBirth: formData.dateOfBirth
                    ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
                    : null,
            };

            navigate("/terms-and-conditions", { state: { registrationData } });
        }
    }

    return (
        <form className="atom-form-container">
            <div className="flex">
                {personalFields.slice(0, 2).map(field => (
                    <Input
                        key={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        Util={field.Util}
                    />
                ))}
            </div>
            {personalFields.slice(2).map(field => (
                <Input
                    key={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    Util={field.Util}
                />
            ))}
            {error && <p className="error-message">{error}</p>}
            <button className="submit" onClick={handleSubmit}>Submit</button>
        </form>
    );
}
