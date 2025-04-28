import React, { useState } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const AdminLogin = () => {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!pin) {
      setError("Please enter your admin pin");
      return;
    }

    if (pin.length !== 6) {
      setError("PIN must be 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Replace with actual authentication logic
      console.log("Admin PIN:", pin);
      console.log("Remember me:", rememberMe);

      // Redirect on successful login
      // window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("Invalid PIN. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden font-['Gilroy'] ">
      {/* Login Form */}
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 dark:bg-zinc-800/90 rounded-xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 backdrop-blur-sm"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-blue-100/90 mt-1">
              Secure access for administrators
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* PIN Field */}
            <div className="space-y-2">
              <label
                htmlFor="pin"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Enter Admin PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  id="pin"
                  name="pin"
                  type={showPin ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={pin}
                  onChange={(e) =>
                    setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  maxLength={6}
                  className="block w-full pl-10 pr-10 py-2.5 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700/50 dark:text-white"
                  placeholder="Enter PIN"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPin(!showPin)}
                  aria-label={showPin ? "Hide PIN" : "Show PIN"}
                >
                  {showPin ? (
                    <EyeOff className="h-5 w-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 rounded dark:bg-zinc-700 dark:border-zinc-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300"
                >
                  Remember this device
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Forgot PIN?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || pin.length !== 6}
              className={`w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 transition-all ${
                isLoading || pin.length !== 6
                  ? "opacity-80 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5 text-white" />
                  Verifying...
                </>
              ) : (
                "Authenticate"
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-700/30 text-center text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-700">
            © {new Date().getFullYear()} Eventopia. All rights reserved.
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
