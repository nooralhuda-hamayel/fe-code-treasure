import React, { useState } from "react";
import "./auth.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForget, setIsForget] = useState(false);
  const [isOTP, setIsOTP] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  return (
    <div className="form-container">
      <div className="col col-1">
        <div className="image-layer">
          <img src="/assets/img/white-outline.png" className="form-image-main" />
          <img src="/assets/img/dots.png" className="form-image dots" />
          <img src="/assets/img/coin.png" className="form-image coin" />
          <img src="/assets/img/spring.png" className="form-image spring" />
          <img src="/assets/img/rocket.png" className="form-image rocket" />
          <img src="/assets/img/cloud.png" className="form-image cloud" />
          <img src="/assets/img/stars.png" className="form-image stars" />
        </div>
      </div>

      <div className="col col-2">
        {!isForget && !isOTP && !isResetPassword && (
          <div className="btn-box">
            <button className={`btn btn-1 ${isLogin ? "active" : ""}`} onClick={() => setIsLogin(true)}>
              Sign In
            </button>
            <button className={`btn btn-2 ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>
              Sign Up
            </button>
          </div>
        )}

        {!isForget && !isOTP && !isResetPassword && (
          isLogin ? (
            <div className="login-form form">
              <div className="form-title"><span>Sign In</span></div>
              <div className="form-inputs">
                <div className="input-box">
                  <input type="text" className="input-field" placeholder="Username" required />
                  <i className="bx bx-user icon"></i>
                </div>
                <div className="input-box">
                  <input type="password" className="input-field" placeholder="Password" required />
                  <i className="bx bx-lock-alt icon"></i>
                </div>
                <div className="forgot-pass">
                  <a href="#" onClick={() => setIsForget(true)}>Forgot Password?</a>
                </div>
                <div className="input-box">
                  <button className="input-submit">
                    <span>Sign In</span>
                    <i className="bx bx-right-arrow-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="register-form form">
              <div className="form-title"><span>Create Account</span></div>
              <div className="form-inputs">
                <div className="input-box">
                  <input type="text" className="input-field" placeholder="Email" required />
                  <i className="bx bx-envelope icon"></i>
                </div>
                <div className="input-box">
                  <input type="text" className="input-field" placeholder="Username" required />
                  <i className="bx bx-user icon"></i>
                </div>
                <div className="input-box">
                  <input type="password" className="input-field" placeholder="Password" required />
                  <i className="bx bx-lock-alt icon"></i>
                </div>
                <div className="input-box">
                  <button className="input-submit">
                    <span>Sign Up</span>
                    <i className="bx bx-right-arrow-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {isForget && !isOTP && !isResetPassword && (
          <div className="forget-form form">
            <div className="form-title"><span>Forgot Password?</span></div>
            <p className="form-text">Don't worry! It occurs. Please enter the email address linked with your account.</p>
            <div className="form-inputs">
              <div className="input-box">
                <input type="email" className="input-field" placeholder="Enter your email" required />
              </div>
              <div className="input-box">
                <button className="input-submit" onClick={() => setIsOTP(true)}>
                  <span>Send Code</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {isOTP && !isResetPassword && (
          <div className="otp-form form">
            <div className="form-title"><span>OTP Verification</span></div>
            <p className="form-text">Enter the verification code we just sent on your email address.</p>
            <div className="form-inputs otp-boxes">
              <input type="text" maxLength={1} className="otp-input" />
              <input type="text" maxLength={1} className="otp-input" />
              <input type="text" maxLength={1} className="otp-input" />
              <input type="text" maxLength={1} className="otp-input" />
            </div>
            <div className="input-box">
              <button className="input-submit" onClick={() => setIsResetPassword(true)}>
                <span>Verify</span>
              </button>
            </div>
          </div>
        )}

        {isResetPassword && (
          <div className="reset-password-form form">
            <div className="form-title"><span>Create New Password</span></div>
            <div className="form-inputs">
              <div className="input-box">
                <input type="password" className="input-field" placeholder="New Password" required />
                <i className="bx bx-lock-alt icon"></i>
              </div>
              <div className="input-box">
                <input type="password" className="input-field" placeholder="Confirm Password" required />
                <i className="bx bx-lock-alt icon"></i>
              </div>
              <div className="input-box">
                <button className="input-submit">
                  <span>Reset Password</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
