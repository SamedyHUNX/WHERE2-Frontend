// dependencies
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// components
import Form from "../components/reusable/Form/Form";
import Input from "../components/reusable/Form/Input";
import { LoadingSpinner, LoadingOverlay } from "../components/reusable/Loading";

// slices
import { forgotPassword, clearAuthState } from "../features/slices/authSlice";

// config
import config from "../config";

/**
 * ForgetPasswordLayout
 * 
 * This component handles the forget password functionality. 
 * Users can input their email address, and the component will handle the 
 * process of sending a password reset link to their email.
 */
export default function ForgetPasswordLayout() {
    /**
     * State to manage the email input.
     * @type {[string, function]}
     */
    const [email, setEmail] = useState("");

    // Hook to dispatch actions to the Redux store
    const dispatch = useDispatch();

    // Extract status, error, and message from the auth slice of the Redux store
    const { status, error, message } = useSelector((state) => state.auth);

    /**
     * useEffect to clear authentication state on component mount.
     */
    useEffect(() => {
        dispatch(clearAuthState());
    }, [dispatch, email]);

    /**
     * Handle form submission.
     * @param {Object} e - The event object.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email) {
            // Log the email in non-production environments
            if (config.env !== 'production') {
                console.log("Submitting email:", email);
            }
            // Dispatch the forgotPassword action with the email
            dispatch(forgotPassword({ email }));
        }
    };

    // If the status is loading, show the loading overlay
    if (status === "loading") {
        return <LoadingOverlay isFullScreen={true} message="We are sending a password reset link..." />
    }

    return (
        <Form title="Forget Password">
            <p className="message">Enter your email address and we'll send you a link to reset your password.</p>
            <form className="atom-form-container" onSubmit={handleSubmit} style={{gap:"50px", marginTop:"10px"}}>
                <Input
                    key='email'
                    name='email'
                    placeholder='Email'
                    type='email'
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
                    <button
                        type="submit"
                        className="submit"
                        disabled={status === "loading" || status === "succeeded"}
                    >
                        {status === "loading" ? <LoadingSpinner /> : "Reset Password"}
                    </button>
                </div>
            </form>
            <p className="mt-6 message flex justify-center" style={{ fontSize: "14px" }}>
                Return back to login <Link to="/login" className="text-[rgb(0,122,255)] underline"> Log in </Link>
            </p>
        </Form>
    );
}
