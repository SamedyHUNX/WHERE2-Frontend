import React, { useState, useEffect } from "react";
import axios from "axios";
import FormInput from "./../reusable/InputField";
import { Alert, AlertTitle } from "@mui/material";
import ButtonComponent from "./Button";
import config from "./../../config";
import useAuth from "./../../hooks/useAuth";
import fetchProfile from "./functions/FetchProfile";
import { MessageCircle, X } from "lucide-react";

const FloatingContact = () => {
  const { token, isLoggedIn, role } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      if (isLoggedIn) {
        try {
          const data = await fetchProfile();
          setUserData(data);
          const fullName =
            data.firstName && data.lastName
              ? `${data.firstName} ${data.lastName}`
              : data.userName || "";

          setFormData((prevData) => ({
            ...prevData,
            fullName: fullName,
            email: data.email || "",
            phoneNumber: data.phoneNumber || data.phone || "",
          }));
        } catch (err) {
          console.error("Error loading profile:", err);
        }
      }
    };
    loadProfile();
  }, [isLoggedIn]);

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    // if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
    //   newErrors.phoneNumber = "Please enter a valid phone number";
    // }

    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.post(config.contact.sendEmail, formData);

      if (response.status === 201) {
        setAlert({
          show: true,
          type: "success",
          message: "Message sent successfully! We will get back to you soon.",
        });

        // Reset form after successful submission
        setTimeout(() => {
          setIsOpen(false);
          setFormData({
            fullName: "",
            phoneNumber: "",
            email: "",
            message: "",
          });
          setAlert({ show: false, type: "", message: "" });
        }, 3000);
      }
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
      console.error("Error submitting form:", error);
    } finally {
      setIsOpen(false);
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Alert Box at the top-right of the screen */}
      {alert.show && (
        <div
          className={`fixed top-[8vh] right-[5vw] z-50 p-4 rounded-md shadow-lg max-w-xs ${
            alert.type === "success"
              ? "bg-sky-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <strong>{alert.type === "success" ? "Success" : "Error"}</strong>
          <p>{alert.message}</p>
        </div>
      )}

      <div className="fixed lg:bottom-[4vh] lg:right-[5vw] sm:bottom-[4vh] sm:right-6 z-50">
        {isOpen && (
          <div className="absolute lg:bottom-24 sm:bottom-[6vh] right-0 lg:w-96 sm:w-[350px] bg-white rounded-lg shadow-xl transform transition-all duration-300 animate-slide-up">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h2 className="text-2xl font-semibold my-[16px]">Contact Us</h2>
                <p className="text-sm text-gray-600 mt-1">
                  If you have any questions, feel free to contact us. We will
                  respond back to you as soon as possible.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <FormInput
                label={
                  <span>
                    Full Name <span className="text-red-500">*</span>
                  </span>
                }
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
                error={errors.fullName}
                disabled={isLoggedIn}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}

              <FormInput
                label={
                  <span>
                    Phone number <span className="text-red-500">*</span>
                  </span>
                }
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                error={errors.phoneNumber}
                disabled={isLoggedIn}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}

              <FormInput
                label={
                  <span>
                    Email Address <span className="text-red-500">*</span>
                  </span>
                }
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                error={errors.email}
                disabled={isLoggedIn}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className={`mt-1 pl-2 border-gray-300 border-2 pt-2 block w-full hover:bg-gray-100 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.message ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <ButtonComponent
                variant="primary"
                size="medium"
                rounded={false}
                fullWidth
                type="submit"
                className="bg-blue-500"
              >
                {loading ? "Sending your message..." : "Start Conversation"}
              </ButtonComponent>
            </form>
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-[80px] h-[80px] rounded-full ${
            isOpen ? "bg-red-500" : "bg-sky-500"
          } text-white shadow-lg flex items-center justify-center hover:bg-sky-600 transition-all duration-200`}
        >
          {isOpen ? <X size={36} /> : <MessageCircle size={36} />}
        </button>
      </div>
    </div>
  );
};

export default FloatingContact;
