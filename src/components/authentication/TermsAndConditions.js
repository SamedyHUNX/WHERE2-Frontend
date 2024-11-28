import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "./../reusable/Button";
import ContainerComponent from "../reusable/ContainerComponent";
import { register } from "../../features/slices/authSlice";
import { LoadingSpinner, LoadingOverlay } from "../reusable/Loading";


// HARD CODED TERMS AND CONDITIONS; WE WILL UPDATE THIS WHEN WE HAVE COME UP WITH TERMS AND CONDITIONS LATER
const termsAndConditions = [
  {
    p1: "Account Registration: By signing up, you agree to create an account to access our services. This means you'll provide some basic information, like your name and email address, so we can help you get started.",
  },
  
  {
    p2: "Cookies and Browsing History: To improve your experience, we use cookies to keep track of your browsing history. This helps us understand how you use our service. By using our site, you grant us permission to use cookies. If you have any questions about this, feel free to ask!",
  },
  
  {
    p3: "We reserve the right to update or amend these Terms and Conditions at any time. By continuing to use our services and clicking 'Agree' to the current Terms and Conditions, you automatically consent to any future changes we may make. We encourage you to periodically review this page to stay informed about any updates."
  }
];

const TermsAndConditionsComponent = () => {
  const [agreed, setAgreed] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get both status and error from Redux state
  const { status, error: reduxError } = useSelector((state) => state.auth);
  const [localError, setLocalError] = useState("");

  const registrationData = location.state?.registrationData;

  // Clear error when component unmounts or status changes
  useEffect(() => {
    if (status === 'idle') {
      setLocalError("");
    }
  }, [status]);

  // Handle Redux errors
  useEffect(() => {
    if (reduxError) {
      setLocalError(reduxError.message);
      setShowLoadingOverlay(false);
    }
  }, [reduxError]);

  // Check for registration data
  useEffect(() => {
    if (!registrationData) {
      setLocalError("Please fill in your registration details first.");
      return;
    }
  }, [registrationData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(""); // Clear previous errors

    // Validation checks
    if (!registrationData) {
      setLocalError("Please fill in your registration details first.");
      return;
    }

    if (!agreed) {
      setLocalError("Please agree to the terms and conditions to proceed.");
      return;
    }

    try {
      setShowLoadingOverlay(true);
      const result = await dispatch(register(registrationData)).unwrap();
      
      // If successful, navigate to verification
      const email = result.email || registrationData.email;
      const timer = setTimeout(() => {
        navigate("/signup/verification", { state: { email } });
      }, 500);

      return () => clearTimeout(timer);
    } catch (err) {
      setShowLoadingOverlay(false);
      // The error will be handled by the useEffect watching reduxError
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (status === "loading") {
    return <LoadingOverlay isFullScreen={true} message="We are processing your request..." />;
  }

  return (
    <>
      {showLoadingOverlay && (
        <LoadingOverlay isFullScreen={true} message="We are processing your request..." />
      )}
      <ContainerComponent>
        <div className="mb-4">
          <button
            onClick={handleBack}
            className="text-gray-600 transition-colors hover:text-gray-800"
          >
            ← Back
          </button>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold text-center text-gray-800">
            Our Terms and Services
          </h2>
          <div className="w-1/4 h-0.5 bg-gray-300 mx-auto mt-4"></div>
        </div>

        <div className="mb-6 overflow-y-auto max-h-[40vh]">
          <h3 className="mb-2 font-semibold">1. Clause 1</h3>
          <p className="mb-4 text-sm text-gray-600">{termsAndConditions[0].p1}</p>

          <h3 className="mb-2 font-semibold">2. Clause 2</h3>
          <p className="mb-4 text-sm text-gray-600">{termsAndConditions[1].p2}</p>
          <h3 className="mb-2 font-semibold">3. Clause 3</h3>
          <p className="mb-4 text-sm text-gray-600">{termsAndConditions[2].p3}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="agree"
              className="mr-2"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="agree" className="text-sm text-gray-600">
              Agree to Terms and Services
            </label>
          </div>

          {localError && (
            <div className="p-3 mb-4 border border-red-200 rounded-md bg-red-50">
              <p className="text-sm text-center text-red-600">{localError}</p>
            </div>
          )}

          <div className="flex items-center justify-center">
            <ButtonComponent
              variant="primary"
              className="mt-2 w-[197px] sm:w-full h-[38px] sm:w-[343px] sm:h-[50px]"
              disabled={!agreed || status === "loading" || status === "succeeded"}
              type="submit"
            >
              {status === "loading" ? <LoadingSpinner /> : "Agree & Proceed"}
            </ButtonComponent>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="underline text-sky-500">
              Log in
            </Link>
          </p>
        </div>
      </ContainerComponent>
    </>
  );
};

export default TermsAndConditionsComponent;
