import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ContainerComponent from "./../reusable/ContainerComponent";
import FormInput from "./../reusable/InputField";
import ButtonComponent from "./../reusable/Button";
import {
  verifyAccount,
  clearAuthState,
  sendWelcomeEmail,
  resendVerificationCode,
} from "./../../features/slices/authSlice";
import { LoadingOverlay } from "./../reusable/Loading";

const VerificationComponent = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const [inputError, setInputError] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { status, error, message, isVerified } = useSelector(state => state.auth);
  const email = location.state?.email || "";

  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (inputError) {
      const timeout = setTimeout(() => setInputError(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [inputError]);

  useEffect(() => {
    if (isVerified) {
      const trimmedEmail = email.trim();
      
      if (trimmedEmail) {
        dispatch(sendWelcomeEmail({ email: trimmedEmail }))
          .unwrap()
          .then(() => console.log("Welcome email sent successfully"))
          .catch(err => console.error("Failed to send welcome email:", err))
          .finally(() => {
            const timer = setTimeout(() => {
              dispatch(clearAuthState());
              navigate("/login");
            }, 100);
            return () => clearTimeout(timer);
          });
      } else {
        console.error("Invalid email address: Email is empty.");
        const timer = setTimeout(() => {
          dispatch(clearAuthState());
          navigate("/login");
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isVerified, email, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && verificationCode) {
      try {
        await dispatch(verifyAccount({ email, verificationCode })).unwrap();
      } catch (err) {
        console.error("Verification failed:", err);
        setInputError(true);
        setVerificationCode(""); // Reset verification code on error
      }
    }
  };

  const handleResendCode = async () => {
    if (email && timeLeft === 0) {
      try {
        await dispatch(resendVerificationCode({ email })).unwrap();
        setTimeLeft(600);
        setResendMessage("Verification code resent successfully!");
      } catch (e) {
        console.error("Failed to resend verification code:", e);
        setResendMessage("Failed to resend verification code. Please try again.");
      }
    }
  };

  const handleBack = () => {
    navigate(-1)
  }

  if (status === "loading") {
    return (
      <LoadingOverlay isFullScreen={true} message="We are verifying your account..." />
    );
  }

  if (!email) {
    return <div>Loading...</div>;
  }

  return (
    <ContainerComponent className="lg:h-[718px]">
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
              Verify Your Account
            </h2>
            <div className="w-1/4 h-0.5 bg-gray-300 mx-auto mt-4"></div>
          </div>

      <p className="text-sm text-gray-600 text-center mb-6">
        Please enter the verification code sent to <span className="font-bold text-sky-500 underline">{email}</span>
      </p>

      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <FormInput
          name="verificationCode"
          label="Verification Code"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
          className={inputError ? "border-red-500" : ""}
          error={inputError && "Verification code is required"}
        />
        <p className="text-sm text-gray-500">
          Code will expire in {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </p>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {isVerified && (
          <p className="text-green-500 text-sm text-center">
            {message || "Account verified successfully. Redirecting to login..."}
          </p>
        )}
        <div className="flex justify-center items-center">
          <ButtonComponent
            variant="primary"
            className="mt-2 w-[197px] h-[38px] sm:w-[343px] sm:h-[50px]"
            type="submit"
            disabled={status === "loading" || status === "succeeded" || !verificationCode}
          >
            {status === "loading" ? "Verifying..." : "Verify"}
          </ButtonComponent>
        </div>
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={handleResendCode}
          className="text-[rgb(0,122,255)] underline text-sm"
          // disabled={timeLeft > 0}
        >
          Resend Code
        </button>
      </div>
    </ContainerComponent>
  );
};

export default VerificationComponent;
