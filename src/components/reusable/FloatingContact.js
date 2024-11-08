import React, { useState } from 'react';
import axios from 'axios';
import FormInput from "./../reusable/InputField"
import ButtonComponent from './Button';
import config from './../../config';
import { MessageCircle, X } from 'lucide-react';

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation - accepts multiple formats
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Name validation
    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // Message validation
    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
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

      if (response.status === 200) {
        console.log('Message sent successfully!');
      }

      setIsOpen(false);
      setLoading(false);
      setFormData({ fullName: '', phoneNumber: '', email: '', message: '' });
    } catch (error) {
      setLoading(false);
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="fixed lg:bottom-[8vh] lg:right-[5vw] sm:bottom-[4vh] sm:right-6 z-50">
      {isOpen && (
        <div className="absolute lg:bottom-24 sm:bottom-[6vh] right-0 lg:w-96 sm:w-[350px] bg-white rounded-lg shadow-xl transform transition-all duration-300 animate-slide-up">
          <div className="flex justify-between items-center p-4 border-b">
            <div>
              <h2 className="text-2xl font-semibold my-[16px]">Contact Us</h2>
              <p className="text-sm text-gray-600 mt-1">
                If you have any questions, feel free to contact us. We will reponse back to you as soon as possible.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <FormInput
              label={<span>Full Name <span className="text-red-500">*</span></span>}
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
              error={errors.fullName}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}

            <FormInput
              label={<span>Phone number <span className="text-red-500">*</span></span>}
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              error={errors.phoneNumber}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}

            <FormInput
              label={<span>Email Address <span className="text-red-500">*</span></span>}
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              error={errors.email}
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
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.message ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            <ButtonComponent
              variant='primary'
              size="medium"
              rounded={false}
              fullWidth
              type="submit"
              className={"bg-blue-500"}
            >
              {
                loading ? "Sending your message..." : "Start Conversation"
              }
            </ButtonComponent>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-[80px] h-[80px] rounded-full ${isOpen ? "bg-red-500" : "bg-sky-500"} text-white shadow-lg flex items-center justify-center hover:bg-sky-600 transition-all duration-200`}
      >
        { isOpen ? <X size={36}/> : <MessageCircle size={36} /> }
      </button>
    </div>
  );
};

export default FloatingContact;