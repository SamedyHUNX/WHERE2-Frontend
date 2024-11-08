import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import FormInput from "./../reusable/InputField";
import ButtonComponent from "./../reusable/Button";
import ContainerComponent from "./../reusable/ContainerComponent";
import { forgotPassword, clearAuthState } from "./../../features/slices/authSlice";
import { LoadingSpinner, LoadingOverlay } from "./../reusable/Loading";


// THIS COMPONENT IS USED FOR FORGET PASSWORD FUNCTIONALITY; THE USER CAN TYPE IN HIS EMAIL AND WE WILL SEND HIM A LINK TO RESET HIS PASSWORD
const ForgetPasswordComponent = () => {
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const dispatch = useDispatch();
  const { status, error, message } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  // Clear auth state when email changes or component unmounts
  useEffect(() => {
    dispatch(clearAuthState());
    setLocalError("");
  }, [dispatch, email]);

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

    if (!validateEmail(email)) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    dispatch(forgotPassword({ email }));
  };

  const handleBack = () => {
    navigate(-1)
  }

  // Show loading overlay
  if (status === "loading") {
    return <LoadingOverlay isFullScreen={true} message="We are sending a password reset link..." />;
  }

  // Determine the message to show
  const getMessage = () => {
    if (status === 'idle') {
      return "Enter your email address and we'll send you a link to reset your password.";
    }
    if (status === 'succeeded') {
      return `Reset password email has been sent to ${email}.`;
    }
    return "Enter your email address and we'll send you a link to reset your password.";
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
              Forgot Password
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

        {(error || localError) && (
          <div className="text-red-500 text-sm text-center">
            <p>{`${error || localError} Please check your email or consider signing up.`}</p>
          </div>
        )}

        {status === "succeeded" && (
          <div className="text-green-500 text-sm text-center">
            <p>
              {message || "If the email exists, a password reset link will be sent shortly. Please check your email."}
            </p>
          </div>
        )}

        <div className="flex justify-center items-center">
          <ButtonComponent
            variant="primary"
            className="mt-2 w-[197px] sm:w-full h-[38px] sm:w-[343px] sm:h-[50px]"
            type="submit"
            disabled={status === "loading" || status === "succeeded"}
          >
            {status === "loading" ? <LoadingSpinner /> : "Send Reset Link"}
          </ButtonComponent>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className="text-sky-500 underline">
            Log in
          </Link>
        </p>
      </div>
    </ContainerComponent>
  );
};

export default ForgetPasswordComponent;