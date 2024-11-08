import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "./../reusable/InputField";
import ButtonComponent from "./../reusable/Button";
import ContainerComponent from "./../reusable/ContainerComponent";
import { login, clearAuthState } from "./../../features/slices/authSlice";
import { Checkbox, InputLabel } from "@mui/material";
import { LoadingSpinner, LoadingOverlay } from "./../reusable/Loading.js";

// LOGIN COMPONENT
const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  // Navigate if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Read email from localStorage if 'remember me' is checked
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  // Clear authentication state on form reset or new input
  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch, email, password]);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Handle email change with validation
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    try {
      // Store email in localStorage if rememberMe is checked
      if (rememberMe) {
        localStorage.setItem("email", email);
      } else {
        localStorage.removeItem("email");
      }

      const resultAction = await dispatch(login({ email, password }));
      if (login.fulfilled.match(resultAction)) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Loading spinner while logging in
  if (status === "loading") {
    return <LoadingOverlay isFullScreen={true} message="We are logging you in..." />;
  }

  return (
    <ContainerComponent title="LOG IN" className="lg:h-[718px]">
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <FormInput
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
          autoComplete="email"
          className={`${emailError || error ? "border-rose-400 border-[1px]" : "border-emerald-400 border-[1px]"}`}
        />
        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        
        <FormInput
          name="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className={error ? "border-rose-400 border-[1px]" : ""}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="rememberMe" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <InputLabel 
            htmlFor="rememberMe" 
            className="text-sm text-gray-600 cursor-pointer"
          >
            Remember me
          </InputLabel>
        </div>

        <div className="flex justify-center items-center">
          <ButtonComponent
            variant={"primary"}
            className="mt-2 w-[197px] h-[38px] sm:w-[343px] sm:h-[50px]"
            type="submit"
            disabled={status === "loading" || status === "succeeded"}
          >
            {status === "loading" ? <LoadingSpinner /> : "Login"}
          </ButtonComponent>
        </div>
      </form>
      <div className="mt-6 text-center">
        <Link
          to="/forget-password"
          className="text-[rgb(0,122,255)] underline text-sm"
        >
          Forgot Password?
        </Link>
        <p className="mt-6 text-sm text-gray-600">
          Don't have an Account?{" "}
          <Link to="/signup" className="text-[rgb(0,122,255)] underline">
            Sign Up
          </Link>
        </p>
      </div>
    </ContainerComponent>
  );
};

export default LoginComponent;

