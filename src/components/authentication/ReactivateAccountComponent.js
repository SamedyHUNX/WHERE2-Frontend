import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import { reactivateAccount, clearAuthState } from './../../features/slices/authSlice';
import { LoadingOverlay, LoadingSpinner } from './../reusable/Loading';
import ContainerComponent from './../reusable/ContainerComponent';
import ButtonComponent from './../reusable/Button';
import FormInput from './../reusable/InputField';

// THIS COMPONENT IS USED FOR REACTIVATE ACCOUNT FUNCTIONALITY;
const ReactivateAccountComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState("");
    const dispatch = useDispatch();
    const { status, error, message } = useSelector((state) => state.auth);
  
    const navigate = useNavigate();
  
    // Automatic navigation when account is reactivated
    useEffect(() => {
      if (status === "succeeded") {
        const timeoutId = setTimeout(() => {
          navigate("/login");
        }, 2000); // 2-second delay to show success message
  
        return () => clearTimeout(timeoutId);
      }
    }, [status, navigate]);
  
    // Clear auth state when email changes or component unmounts
    useEffect(() => {
      dispatch(clearAuthState());
      setLocalError("");
    }, [dispatch, email, password]);
  
    // Email validation
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLocalError("");
  
      // Client-side validation
      if (!email.trim()) {
        setLocalError("Please enter your email address.");
        return;
      }
  
      if (!password.trim()) {
        setLocalError("Please enter your password.");
        return;
      }
  
      if (!validateEmail(email)) {
        setLocalError("Please enter a valid email address.");
        return;
      }
  
      // Dispatch the reactivateAccount action
      dispatch(reactivateAccount({ email, password }));
    };
  
    const handleBack = () => {
      navigate(-1)
    }
  
    // Show loading overlay
    if (status === "loading") {
      return <LoadingOverlay isFullScreen={true} message="Sending your reactivate account request..." />;
    }
  
    // Determine the message to show
    const getMessage = () => {
      if (status === 'idle') {
        return "Enter your email and password to reactivate your account.";
      }
      if (status === 'succeeded') {
        return "Your account has been successfully reactivated.";
      }
      return "Enter your email and password to reactivate your account.";
    };
  
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
          <h2 className="text-2xl font-bold text-center text-gray-800 tracking-tight">
            Reactivate Account
          </h2>
          <div className="w-1/4 h-0.5 bg-gray-300 mx-auto mt-4"></div>
        </div>
  
        <p className="text-sm text-gray-600 text-center mb-6">
          {getMessage()}
        </p>
  
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <FormInput
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading" || status === "succeeded"}
            className={error || localError ? "border-rose-400 border-[1px]" : ""}
          />
          
          <FormInput
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={status === "loading" || status === "succeeded"}
            className={error || localError ? "border-rose-400 border-[1px]" : ""}
          />
  
          {(error || localError) && (
            <div className="text-red-500 text-sm text-center">
              <p>{`${error || localError} Please check your credentials.`}</p>
            </div>
          )}
  
          {status === "succeeded" && (
            <div className="text-green-500 text-sm text-center">
              <p>
                {message || "Your account has been successfully reactivated."}
              </p>
            </div>
          )}
  
          <div className="flex justify-center items-center">
            <ButtonComponent
              variant="primary"
              className="mt-2 w-[197px] sm:w-full h-[38px] sm:w-[343px] sm:h-[50px]"
              type="submit"
              disabled={status === "loading" || status === "succeeded" || !email || !password}
            >
              {status === "loading" ? <LoadingSpinner /> : "Reactivate Account"}
            </ButtonComponent>
          </div>
        </form>
  
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an active account?{" "}
            <Link to="/login" className="text-sky-500 underline">
              Log in
            </Link>
          </p>
        </div>
      </ContainerComponent>
    );
  };
  
export default ReactivateAccountComponent;