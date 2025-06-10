
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import  useAppDispatch  from "../hooks/useAppDispatch";
import { loginUser, signupUser } from "../features/auth/authThunks";
import Cookies from 'js-cookie';
// import type { FormData }   from "../../../src/api/types/authTypes";
import axiosInstance from '../api/axiosInstance';
import "./auth.css";

// تعريف نوع البيانات
interface FormData {
  email: string;
  name: string;
  password: string;
  // confirmPassword: string;
  otp?: string[];
}

const AuthPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // حالات التطبيق
  const [isLogin, setIsLogin] = useState(true);
  const [isForget, setIsForget] = useState(false);
  const [isOTP, setIsOTP] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0);
  const [canResendOTP, setCanResendOTP] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password: '',
    // confirmPassword: '',
    otp: ['', '', '', '']
  });

  // تحويل المستخدم إذا كان مسجلاً
useEffect(() => {
  const token = Cookies.get('token');
  if (token) {
    navigate('/levels');
  }
}, [navigate]);

  // إدارة مؤقت إعادة الإرسال
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (resendTimeout > 0) {
      timer = setTimeout(() => {
        setResendTimeout(resendTimeout - 1);
      }, 1000);
    } else if (resendTimeout === 0 && !canResendOTP) {
      setCanResendOTP(true);
    }

    return () => clearTimeout(timer);
  }, [resendTimeout, canResendOTP]);

  // معالجة تغيير الحقول
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // معالجة تغيير رمز OTP
  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...formData.otp || ['', '', '', '']];
    newOtp[index] = value;
    setFormData(prev => ({
      ...prev,
      otp: newOtp
    }));
  };

  // تسجيل الدخول
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(loginUser({
        email: formData.email,
        password: formData.password
      })).unwrap();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // إنشاء حساب
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!formData.email || !formData.name || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    // if (formData.password !== formData.confirmPassword) {
    //   setFormError('Passwords do not match');
    //   return;
    // }

    try {
      setIsLoading(true);
      await dispatch(signupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })).unwrap();

      await dispatch(loginUser({
        email: formData.email,
        password: formData.password
      })).unwrap();

    } catch (err: any) {
      setFormError(err.response?.data?.message || 
                 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // طلب استعادة كلمة المرور
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!formData.email) {
      setFormError('Please enter your email');
      return;
    }

    if (!validateEmail(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.post('/api/auth/forgotpassword', {
        email: formData.email
      });
      
      setIsOTP(true);
      setResendTimeout(60); // بدء المؤقت
      setCanResendOTP(false);
      setFormError(null);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // إعادة إرسال رمز OTP
  const handleResendOTP = async () => {
    if (!canResendOTP || isLoading) return;

    const confirmResend = window.confirm('Send new verification code to your email?');
    if (!confirmResend) return;

    try {
      setIsLoading(true);
      setFormError(null);
      
      await axiosInstance.post('/api/auth/resend-otp', {
        email: formData.email
      });

      setResendTimeout(60);
      setCanResendOTP(false);
      setFormError('Verification code has been resent!');
      
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // التحقق من رمز OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (formData.otp?.some(code => !code)) {
      setFormError('Please enter the full OTP code');
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.post('/auth/verify-otp', {
        email: formData.email,
        otp: formData.otp?.join('')
      });
      
      setIsResetPassword(true);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // إعادة تعيين كلمة المرور
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // if (!formData.password || !formData.confirmPassword) {
    //   setFormError('Please fill in all fields');
    //   return;
    // }

    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    // if (formData.password !== formData.confirmPassword) {
    //   setFormError('Passwords do not match');
    //   return;
    // }

    try {
      setIsLoading(true);
      await axiosInstance.post('/api/auth/reset-password', {
        email: formData.email,
        otp: formData.otp?.join(''),
        newPassword: formData.password
      });
      
      // إعادة الضبط بعد النجاح
      setIsResetPassword(false);
      setIsOTP(false);
      setIsForget(false);
      setIsLogin(true);
      setFormData({
        email: '',
        name: '',
        password: '',
        // confirmPassword: '',
        otp: ['', '', '', '']
      });
      
      setFormError(null);
      alert('Password reset successfully! You can now login with your new password.');
      
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // التحقق من صحة البريد الإلكتروني
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
return (
  <div className="form-container">
    <div className="col col-1">
      <div className="image-layer">
        <img src="/assets/img/white-outline.png" className="form-image-main" alt="Main" />
        <img src="/assets/img/dots.png" className="form-image dots" alt="Dots" />
        <img src="/assets/img/coin.png" className="form-image coin" alt="Coin" />
        <img src="/assets/img/spring.png" className="form-image spring" alt="Spring" />
        <img src="/assets/img/rocket.png" className="form-image rocket" alt="Rocket" />
        <img src="/assets/img/cloud.png" className="form-image cloud" alt="Cloud" />
        <img src="/assets/img/stars.png" className="form-image stars" alt="Stars" />
      </div>
    </div>

    <div className="col col-2">
      {!isForget && !isOTP && !isResetPassword && (
        <div className="btn-box">
          <button 
            className={`btn btn-1 ${isLogin ? "active" : ""}`} 
            onClick={() => setIsLogin(true)}
            disabled={isLoading}
          >
            Sign In
          </button>
          <button 
            className={`btn btn-2 ${!isLogin ? "active" : ""}`} 
            onClick={() => setIsLogin(false)}
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>
      )}

      {/* Error Message */}
      {formError && (
        <div className="error-message">
       {formError}
        </div>
      )}

      {!isForget && !isOTP && !isResetPassword && (
        isLogin ? (
          <form className="login-form form" onSubmit={handleLogin}>
            <div className="form-title"><span>Sign In</span></div>
            <div className="form-inputs">
              <div className="input-box">
                <input 
                  type="text" 
                  name="email"
                  className="input-field" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  disabled={isLoading}
                />
                <i className="bx bx-user icon"></i>
              </div>
              <div className="input-box">
                <input 
                  type="password" 
                  name="password"
                  className="input-field" 
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                  disabled={isLoading}
                />
                <i className="bx bx-lock-alt icon"></i>
              </div>
              <div className="forgot-pass">
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setIsForget(true);
                }}>Forgot Password?</a>
              </div>
              <div className="input-box">
                <button 
                  className="input-submit" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : (
                    <>
                      <span>Sign In</span>
                      <i className="bx bx-right-arrow-alt"></i>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form className="register-form form" onSubmit={handleSignup}>
            <div className="form-title"><span>Create Account</span></div>
            <div className="form-inputs">
              <div className="input-box">
                <input 
                  type="text" 
                  name="email"
                  className="input-field" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  disabled={isLoading}
                />
                <i className="bx bx-envelope icon"></i>
              </div>
              <div className="input-box">
                <input 
                  type="text" 
                  name="name"
                  className="input-field" 
                  placeholder="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                  disabled={isLoading}
                />
                <i className="bx bx-user icon"></i>
              </div>
              <div className="input-box">
                <input 
                  type="password" 
                  name="password"
                  className="input-field" 
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                  disabled={isLoading}
                />
                <i className="bx bx-lock-alt icon"></i>
              </div>
              {/* <div className="input-box">
                <input 
                  type="password" 
                  name="confirmPassword"
                  className="input-field" 
                  placeholder="Confirm Password" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required 
                  disabled={isLoading}
                />
                <i className="bx bx-lock-alt icon"></i>
              </div> */}
              <div className="input-box">
                <button 
                  className="input-submit" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : (
                    <>
                      <span>Sign Up</span>
                      <i className="bx bx-right-arrow-alt"></i>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )
      )}

      {isForget && !isOTP && !isResetPassword && (
        <form className="forget-form form" onSubmit={handleForgotPassword}>
          <div className="form-title"><span>Forgot Password?</span></div>
          <p className="form-text">Don't worry! It occurs. Please enter the email address linked with your account.</p>
          <div className="form-inputs">
            <div className="input-box">
              <input 
                type="email" 
                name="email"
                className="input-field" 
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleInputChange}
                required 
                disabled={isLoading}
              />
            </div>
            <div className="input-box">
              <button 
                className="input-submit" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Code'}
              </button>
            </div>
          </div>
        </form>
      )}

      {isOTP && !isResetPassword && (
        <form className="otp-form form" onSubmit={handleVerifyOTP}>
          <div className="form-title"><span>OTP Verification</span></div>
          <p className="form-text">Enter the verification code we just sent on your email address.</p>
          <div className="form-inputs otp-boxes">
            {[0, 1, 2, 3].map((index) => (
              <input 
                key={index}
                type="text" 
                maxLength={1} 
                className="otp-input" 
                value={formData.otp?.[index] || ''}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                required 
                disabled={isLoading}
              />
            ))}
          </div>
          <div className="input-box">
            <button 
              className="input-submit" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      )}

      {isResetPassword && (
        <form className="reset-password-form form" onSubmit={handleResetPassword}>
          <div className="form-title"><span>Create New Password</span></div>
          <div className="form-inputs">
            <div className="input-box">
              <input 
                type="password" 
                name="password"
                className="input-field" 
                placeholder="New Password" 
                value={formData.password}
                onChange={handleInputChange}
                required 
                disabled={isLoading}
              />
              <i className="bx bx-lock-alt icon"></i>
            </div>
            {/* <div className="input-box">
              <input 
                type="password" 
                name="confirmPassword"
                className="input-field" 
                placeholder="Confirm Password" 
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required 
                disabled={isLoading}
              />
              <i className="bx bx-lock-alt icon"></i>
            </div> */}
            <div className="input-box">
              <button 
                className="input-submit" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </form>
      )
      
      }
    </div>
  </div>
);
}
export default AuthPage;