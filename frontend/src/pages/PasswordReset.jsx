import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function PasswordReset() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    emailOrContact: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.emailOrContact) && !/^[0-9]{10}$/.test(formData.emailOrContact)) {
      toast.error('Please enter a valid email or 10-digit contact number.');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('/request-password-reset', {
        email: validateEmail(formData.emailOrContact) ? formData.emailOrContact : undefined,
        contact: !validateEmail(formData.emailOrContact) ? formData.emailOrContact : undefined,
      });
      toast.success('OTP sent successfully. Please check your email or SMS.');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword(formData.newPassword)) {
      toast.error('Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('/reset-password', {
        email: validateEmail(formData.emailOrContact) ? formData.emailOrContact : undefined,
        contact: !validateEmail(formData.emailOrContact) ? formData.emailOrContact : undefined,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      toast.success('Password reset successfully.');
      setStep(1);
      setFormData({ emailOrContact: '', otp: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-gray-800 rounded shadow-lg">
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-700 dark:text-gray-200">Request Password Reset</h2>
            <div>
              <label htmlFor="emailOrContact" className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                Email or Contact
              </label>
              <input
                type="text"
                name="emailOrContact"
                id="emailOrContact"
                value={formData.emailOrContact}
                onChange={handleChange}
                required
                placeholder="Enter your email or contact"
                className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 ${isLoading && 'opacity-50 cursor-not-allowed'}`}
            >
              {isLoading ? 'Sending...' : 'Request OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-700 dark:text-gray-200">Reset Password</h2>
            <div>
              <label htmlFor="otp" className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                OTP
              </label>
              <input
                type="text"
                name="otp"
                id="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                placeholder="Enter OTP"
                className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                placeholder="Enter new password"
                className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 ${isLoading && 'opacity-50 cursor-not-allowed'}`}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
