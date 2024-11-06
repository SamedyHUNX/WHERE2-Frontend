import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FormInput from "./../reusable/InputField";
import ButtonComponent from "./../reusable/Button";
import ContainerComponent from "./../reusable/ContainerComponent";
import { forgotPassword, clearAuthState } from "./../../features/slices/authSlice";
import { LoadingSpinner, LoadingOverlay } from "./../reusable/Loading";
import config from "./../../config";


// THIS COMPONENT IS USED FOR FORGET PASSWORD FUNCTIONALITY; THE USER CAN TYPE IN HIS EMAIL AND WE WILL SEND HIM A LINK TO RESET HIS PASSWORD
const ForgetPasswordComponent = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { status, error, message } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      dispatch(forgotPassword({ email }));
    }
  };

  if (status === "loading") {
    return <LoadingOverlay isFullScreen={true} message="We are sending a password reset link..."/>
  }

  return (
    <ContainerComponent title="FORGET PASSWORD">
      <p className="text-sm text-gray-600 text-center mb-6">
        Enter your email address and we'll send you a link to reset your
        password.
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
          className={error ? "border-rose-400 border-[1px]" : ""}
        />

        {error && (
          <div className="text-red-500 text-sm text-center">
            <p>{`${error} Please check your email or consider signing up.`}</p>
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