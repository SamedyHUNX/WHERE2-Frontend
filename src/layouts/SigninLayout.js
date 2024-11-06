// dependencies
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// components
import Form from "../components/reusable/Form/Form";
import Input from "../components/reusable/Form/Input";

import { LoadingSpinner, LoadingOverlay } from "../components/reusable/Loading";

// slices
import { login, clearAuthState } from "../features/slices/authSlice";

export default function SignupLayout() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        dispatch(clearAuthState());
    }, [dispatch, email, password]);

    function handleInputChange(e) {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value.trim());
        if (name === 'password') setPassword(value.trim());
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resultAction = await dispatch(login({ email, password }));
            if (login.fulfilled.match(resultAction)) {
                navigate("/");
            }
        } catch (err) {
            console.error("Failed to log in. Please try again!");
        }
    };

    if (status === "loading") {
        return <LoadingOverlay isFullScreen={true} message="We are logging you in..." />;
    }

    return (
        <Form title="Sign In">
            <p className="message"></p>
            <form className="atom-form-container" onSubmit={handleSubmit}>
                <Input key='email' name='email' placeholder='Email' value={email} onChange={handleInputChange} required />
                <Input key='password' name='password' placeholder='Password' type='password'value={password}onChange={handleInputChange} required />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button type="submit" className="submit" disabled={status === "loading" || status === "succeded"}>
                    {status === "loading" ? <LoadingSpinner /> : "Sign In"}
                </button>
            </form>
            <div className="mt-6 text-center">
                <Link 
                    to="/forget-password" 
                    className="text-[rgb(0,122,255)] underline" 
                    style={{ fontSize: "14px" }}
                >
                    Forgot Password?
                </Link>
                <p className="mt-6 message" style={{ fontSize: "14px" }}>
                    Don't have an Account? <Link to="/signup" className="text-[rgb(0,122,255)] underline"> Sign Up </Link>
                </p>
            </div>
        </Form>
    );
}
