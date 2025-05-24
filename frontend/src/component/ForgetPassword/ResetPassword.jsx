import React, { useState } from 'react'
import { useAuth } from '../../store/auth';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
    const [step, setStep] = useState(1)
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const { forgetPassword } = useAuth();
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const handlePasswordReset = () => {
        try {
            setIsLoading(true)
            if (newPassword !== confirmPassword) {
                throw new Error("Passwords do not match");
            }
            const res = forgetPassword(token, newPassword)
            if (res.data.message == "Invalid or expired token") {
                toast.error(res.data.message)
                return
            }
            setStep(2)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-800 to-zinc-600 flex items-center justify-center p-4">
            <div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-zinc-900 rounded-xl shadow-2xl p-8 sm:p-10">
                    {step === 1 && (
                        <div
                            key="step1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 text-indigo-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-center text-zinc-300 mb-2">
                                Create New Password
                            </h1>
                            <p className="text-zinc-600 text-center mb-8">
                                Your new password must be different from previous used
                                passwords.
                            </p>

                            <form onSubmit={handlePasswordReset}>
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label
                                            htmlFor="newPassword"
                                            className="block text-sm font-medium text-zinc-400 mb-2"
                                        >
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg text-black border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                                            placeholder="••••••••"
                                            required
                                            minLength="8"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="confirmPassword"
                                            className="block text-sm font-medium text-zinc-400 mb-2"
                                        >
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg text-black border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                                            placeholder="••••••••"
                                            required
                                            minLength="8"
                                        />
                                    </div>
                                </div>

                                <button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={
                                        isLoading ||
                                        !newPassword ||
                                        newPassword !== confirmPassword
                                    }
                                    className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition duration-200 flex items-center justify-center ${isLoading ||
                                        !newPassword ||
                                        newPassword !== confirmPassword
                                        ? "opacity-70"
                                        : ""
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 2 && (
                        <div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="text-center"
                        >
                            <div className="flex justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-300 mb-4">
                                Password Updated!
                            </h2>
                            <p className="text-zinc-400 mb-6">
                                Your password has been successfully reset. You can now login
                                with your new password.
                            </p>
                            <Link
                                to="/auth"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => (window.location.href = "/auth")}
                                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                            >
                                Go to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
