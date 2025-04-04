import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import apiConfig from "./config/apiconfig";
import './index.css';
import './styles/login.css';

const SignUp = () => {
    const navigate = useNavigate(); 
    
    useEffect(() => {
        const checkTokenExpiration = () => {
            const tokenExpiry = localStorage.getItem('token_expiry');
            if (tokenExpiry) {
                const expiryTime = parseInt(tokenExpiry, 10);
                const currentTime = new Date().getTime();
                
                if (currentTime > expiryTime) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('token');
                    localStorage.removeItem('token_expiry');
                    localStorage.removeItem('user');
                    console.log('Token expired, user logged out automatically');
                }
            }
        };
        
        checkTokenExpiration();
        
        const interval = setInterval(checkTokenExpiration, 60000);
        
        return () => clearInterval(interval);
    }, [navigate]);
    const [activeTab, setActiveTab] = useState('login');

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        phone_number: '',
        user_type: 'STUDENT' // Default to STUDENT
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // New state for email validation
    const [emailError, setEmailError] = useState('');
    
    // New state for OTP popup
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [verificationEmail, setVerificationEmail] = useState('');

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
        
        // Clear email error when typing in login form
        if (name === 'email') {
            setEmailError('');
        }
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({
            ...registerData,
            [name]: value
        });
        
        // Validate email when it changes in registration form
        if (name === 'email') {
            validateEmail(value);
        }
    };
    
    // Email validation function
    const validateEmail = (email) => {
        setEmailError('');
        
        if (email) {
            // Check if email ends with woxsen.edu.in
            if (!email.endsWith('@woxsen.edu.in')) {
                setEmailError('Email must be from the woxsen.edu.in domain');
                return false;
            }
        }
        
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Validate email before submission
        if (!validateEmail(loginData.email)) {
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            console.log('Sending login request with:', loginData);

            const response = await fetch(apiConfig.getUrl('api/auth/login/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const responseText = await response.text();
            console.log('Raw response:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse response as JSON:', e);
                throw new Error('Received invalid response from server');
            }

            if (!response.ok) {
                const errorMessage = data.detail || 
                                    data.non_field_errors || 
                                    (data.email && data.email[0]) || 
                                    (data.password && data.password[0]) || 
                                    'Login failed';

                throw new Error(typeof errorMessage === 'string' ? 
                    errorMessage : JSON.stringify(errorMessage));
            }

            console.log('Login successful, received:', data);

            if (data.access) {
                // Store JWT tokens with expiration (48 hours)
                const expiryTime = new Date().getTime() + (48 * 60 * 60 * 1000); // 48 hours in milliseconds
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('token_expiry', expiryTime.toString());

                if (data.refresh) {
                    localStorage.setItem('refresh_token', data.refresh);
                }

                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                console.log('JWT authentication data saved with 48-hour expiration');
                setSuccess('Login successful!');
                
                window.dispatchEvent(new Event("auth_state_changed"));

                navigate('/forms');
            } else {
                if (data.token) {
                    const expiryTime = new Date().getTime() + (48 * 60 * 60 * 1000); // 48 hours
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('token_expiry', expiryTime.toString());
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                    console.log('Authentication data saved (legacy format) with 48-hour expiration');
                    setSuccess('Login successful!');
                    
                    // Dispatch auth state changed event to update navbar immediately
                    window.dispatchEvent(new Event("auth_state_changed"));
                    
                    // Use React Router's navigate for legacy token as well
                    navigate('/');
                } else {
                    throw new Error('No authentication token received from server');
                }
            }
        } catch (err) {
            console.error('Login error:', err);

            if (err.message === 'Failed to fetch') {
                setError('Cannot connect to the server. Please check your internet connection or if the server is running.');
            } else {
                setError(err.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Validate email before submission
        if (!validateEmail(registerData.email)) {
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            console.log('Sending registration request with:', registerData);

            const response = await fetch(apiConfig.getUrl('api/auth/register/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(registerData)
            });

            const responseText = await response.text();
            console.log('Raw response:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse response as JSON:', e);
                throw new Error('Received invalid response from server');
            }

            if (!response.ok) {
                let errorMessage = 'Registration failed';

                if (data.email) {
                    errorMessage = `Email: ${data.email[0]}`;
                } else if (data.username) {
                    errorMessage = `Username: ${data.username[0]}`;
                } else if (data.password) {
                    errorMessage = `Password: ${data.password[0]}`;
                } else if (data.phone_number) {
                    errorMessage = `Phone Number: ${data.phone_number[0]}`;
                } else if (data.user_type) {
                    errorMessage = `User Type: ${data.user_type[0]}`;
                } else if (data.non_field_errors) {
                    errorMessage = data.non_field_errors[0];
                } else if (data.detail) {
                    errorMessage = data.detail;
                }

                throw new Error(errorMessage);
            }

            console.log('Registration successful:', data);
            setSuccess('Registration successful! Please verify your email with OTP.');

            // Show OTP popup after successful registration
            setVerificationEmail(registerData.email);
            setShowOtpPopup(true);

        } catch (err) {
            console.error('Registration error:', err);

            if (err.message === 'Failed to fetch') {
                setError('Cannot connect to the server. Please check your internet connection.');
            } else {
                setError(err.message || 'Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // New function to handle OTP verification
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const verificationData = {
                email: verificationEmail,
                otp: otpValue
            };

            console.log('Sending OTP verification request with:', verificationData);

            const response = await fetch(apiConfig.getUrl('api/auth/verify_otp/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(verificationData)
            });

            const responseText = await response.text();
            console.log('Raw OTP verification response:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse response as JSON:', e);
                throw new Error('Received invalid response from server');
            }

            if (!response.ok) {
                const errorMessage = data.detail || 'OTP verification failed';
                throw new Error(errorMessage);
            }

            console.log('OTP verification successful:', data);
            setSuccess('Email verified successfully! You can now log in.');

            // Reset the form and close OTP popup
            setRegisterData({
                name: '',
                username: '',
                email: '',
                password: '',
                phone_number: '',
                user_type: 'STUDENT'
            });
            setOtpValue('');
            setShowOtpPopup(false);

            // Redirect to login if status code is 201
            if (response.status === 201) {
                setActiveTab('login');
            }

        } catch (err) {
            console.error('OTP verification error:', err);

            if (err.message === 'Failed to fetch') {
                setError('Cannot connect to the server. Please check your internet connection.');
            } else {
                setError(err.message || 'OTP verification failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
    
        try {
            console.log('Sending OTP resend request for:', verificationEmail);
    
            const resendOtpPayload = {
                email: verificationEmail,
                name: registerData.name,
                phone_number: registerData.phone_number,
                user_type: registerData.user_type
            };
    
            const token = localStorage.getItem('access_token');
    
            const response = await fetch(apiConfig.getUrl('api/auth/resend_otp/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }) 
                },
                body: JSON.stringify(resendOtpPayload)
            });
    
            const responseText = await response.text();
            console.log('Raw OTP resend response:', responseText);
    
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse response as JSON:', e);
                throw new Error('Received invalid response from server');
            }
    
            if (!response.ok) {
                throw new Error(data.detail || 'Failed to resend OTP');
            }
    
            console.log('OTP resend successful:', data);
            setSuccess('A new OTP has been sent to your email.');
    
        } catch (err) {
            console.error('OTP resend error:', err);
            setError(err.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Function to handle OTP input change
    const handleOtpChange = (e) => {
        setOtpValue(e.target.value);
    };

    // Function to close OTP popup
    const handleCloseOtpPopup = () => {
        setShowOtpPopup(false);
        setActiveTab('login');
    };

    return (
        <div className="auth-wrapper">
        <div className="auth-container">
            <div className="tabs">
                <button 
                    className={activeTab === 'login' ? 'active' : ''} 
                    onClick={() => setActiveTab('login')}
                >
                    Login
                </button>
                <button 
                    className={activeTab === 'register' ? 'active' : ''} 
                    onClick={() => setActiveTab('register')}
                >
                    Register
                </button>
            </div>

            {/* Status messages */}
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* OTP Verification Popup */}
            {showOtpPopup && (
            <div className="otp-popup-overlay">
             <div className="otp-popup">
            <h2>Verify Your Email</h2>
            <p>Enter the OTP sent to your email: {verificationEmail}</p>
            <form onSubmit={handleVerifyOtp}>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otpValue}
                    onChange={handleOtpChange}
                    required
                />
                <div className="otp-popup-buttons">
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button type="button" onClick={handleCloseOtpPopup}>
                        Cancel
                    </button>
                </div>
            </form>
            <button 
                className="resend-otp-btn"
                onClick={handleResendOtp}
                disabled={isLoading}
            >
                {isLoading ? 'Resending...' : 'Resend OTP'}
            </button>
        </div>
        
    </div>
)}

            {activeTab === 'login' ? (
                <form className="form-container" onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email (must have @woxsen.edu.in)" 
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                        className={emailError && activeTab === 'login' ? 'input-error' : ''}
                    />
                    {emailError && activeTab === 'login' && (
                        <div className="error-message">{emailError}</div>
                    )}
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                    />
                    <button type="submit" disabled={isLoading || emailError}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            ) : (
                <form className="form-container" onSubmit={handleRegister}>
                    <h2>Register</h2>
                    <input 
                        type="text" 
                        name="name"
                        placeholder="Full Name" 
                        value={registerData.name}
                        onChange={handleRegisterChange}
                        required
                    />

                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email (must end with @woxsen.edu.in)" 
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                        className={emailError && activeTab === 'register' ? 'input-error' : ''}
                    />
                    {emailError && activeTab === 'register' && (
                        <div className="error-message">{emailError}</div>
                    )}
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                    />
                    <input 
                        type="tel" 
                        name="phone_number"
                        placeholder="Phone Number" 
                        value={registerData.phone_number}
                        onChange={handleRegisterChange}
                        required
                    />
                    <select
                        name="user_type"
                        value={registerData.user_type}
                        onChange={handleRegisterChange}
                        required
                        className="form-select"
                    >
                        <option value="STUDENT">Student</option>
                        <option value="FACULTY">Faculty</option>
                    </select>
                    <button type="submit" disabled={isLoading || emailError}>
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
            )}
        </div>
        </div>
    );
};

export default SignUp;