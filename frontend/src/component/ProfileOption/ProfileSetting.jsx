import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../store/auth";
import { motion } from "framer-motion";

const ProfileSetting = ({ userData }) => {
  const { updateprofile, resetPassword } = useAuth();
  // console.log(userData)
  // States for Password Reset Tab (case 2)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // States for Account Settings Tab (case 1)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");

  // Update state when userData is available/changed
  useEffect(() => {
    if (userData) {
      setFullName(userData.fullName || "");
      setPhone(userData.contact || "");
      setEmail(userData.email || "");
      setCity(userData?.address?.[0]?.city || "");
      setStateField(userData?.address?.[0]?.state || "");
      setPostcode(userData?.address?.[0]?.pincode || "");
      setCountry(userData?.address?.[0]?.country || "");
    }
  }, [userData]);

  // Password field handlers
  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  // Handle Password Form Submission (Reset Password Tab)
  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // Perform your password update logic here
    resetPassword(oldPassword, newPassword);
    
    // Reset password fields if needed
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  // Handlers for Account Settings inputs
  const handleFullNameChange = (e) => setFullName(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleCityChange = (e) => setCity(e.target.value);
  const handleStateChange = (e) => setStateField(e.target.value);
  const handlePostcodeChange = (e) => setPostcode(e.target.value);
  const handleCountryChange = (e) => setCountry(e.target.value);

  // Handle Account Details Submission (Account Settings Tab)
  const handleAccountSubmit = (e) => {
    e.preventDefault();
    // Perform any validation if necessary

    // For now, we'll just log the account data and show a success toast.
    const updatedData = {
      fullName,
      phone,
      email,
      address: {
        city,
        state: stateField,
        postcode,
        country,
      },
    };

    updateprofile(updatedData);
    console.log("Account Updated Data:", updatedData);
    toast.success("Account details updated successfully!");

    // Here you would typically call an API to update the account details
  };

  // Function to render the appropriate tab
  const [currentTab, setCurrentTab] = useState(0);
  const renderTab = (param) => {
    switch (param) {
      case 2:
        return (
          <div>
            <form
              onSubmit={handlePasswordSubmit}
              className="flex flex-col p-2 gap-3"
            >
              <div>
                <label
                  htmlFor="old-password"
                  className="block text-md -mb-1 font-medium text-zinc-800 dark:text-zinc-300 "
                >
                  Old Password
                </label>
                <input
                  type="password"
                  id="old-password"
                  className="mt-1 block w-full p-3 border border-zinc-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                  placeholder="Old password"
                  onChange={handleOldPasswordChange}
                  value={oldPassword}
                />
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-md -mb-1 font-medium text-zinc-800 dark:text-zinc-300 "
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  className="mt-1 block w-full p-3 border border-zinc-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                  placeholder="New password"
                  onChange={handleNewPasswordChange}
                  value={newPassword}
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-md -mb-1 font-medium text-zinc-800 dark:text-zinc-300 "
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  className="mt-1 block w-full p-3 border border-zinc-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                  placeholder="Confirm password"
                  onChange={handleConfirmNewPasswordChange}
                  value={confirmNewPassword}
                />
              </div>
              <div className="w-full p-1">
                <Link to={"/resetPassword"} className="text-blue-600">
                  Forgot Password
                </Link>
              </div>
              <div className="w-full p-2">
                <button
                  type="submit"
                  className="px-3 py-2 text-white bg-blue-600 rounded-md max-sm:w-full m-auto block"
                >
                  Reset The Password
                </button>
              </div>
            </form>
          </div>
        );
      case 1:
        return (
          <>
            {/* Form for Account Settings */}
            <form
              onSubmit={handleAccountSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="full-name"
                  className="block text-md -mb-1 font-medium text-zinc-800 dark:text-zinc-300 "
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="full-name"
                  className="mt-1 block w-full p-3 border border-zinc-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                  placeholder="Full Name"
                  onChange={handleFullNameChange}
                  value={fullName}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-md -mb-1 font-medium text-zinc-800 dark:text-zinc-300 "
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="mt-1 block w-full p-3 border border-zinc-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                  placeholder="Phone Number"
                  onChange={handlePhoneChange}
                  value={phone}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-md -mb-1 font-medium text-zinc-800 dark:text-zinc-300 "
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full p-3 border border-zinc-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                  placeholder="Email"
                  onChange={handleEmailChange}
                  value={email}
                />
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-md -mb-1 font-medium text-zinc-800 dark:text-zinc-300 "
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  className="mt-1 block w-full p-3 border border-zinc-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                  placeholder="City"
                  onChange={handleCityChange}
                  value={city}
                />
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-md -mb-1 font-medium text-zinc-800 dark:text-zinc-300 "
                >
                  State/County
                </label>
                <input
                  type="text"
                  id="state"
                  className="mt-1 block w-full p-3 border border-zinc-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                  placeholder="State/County"
                  onChange={handleStateChange}
                  value={stateField}
                />
              </div>

              {/* Postcode */}
              <div>
                <label
                  htmlFor="postcode"
                  className="block text-md -mb-1 font-medium text-zinc-800 dark:text-zinc-300 "
                >
                  Postcode
                </label>
                <input
                  type="text"
                  id="postcode"
                  className="mt-1 block w-full p-3 border border-zinc-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                  placeholder="Postcode"
                  onChange={handlePostcodeChange}
                  value={postcode}
                />
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-md -mb-1 font-medium text-zinc-800 dark:text-zinc-300 "
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  className="mt-1 block w-full p-3 border border-zinc-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                  placeholder="Country"
                  onChange={handleCountryChange}
                  value={country}
                />
              </div>

              {/* Submit Button spans full width on small screens */}
              <div className="md:col-span-2 ">
                <button
                  type="submit"
                  className=" py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                  Update
                </button>
              </div>
            </form>
          </>
        );
      case 0:
        return (
          <>
            <div className="xs:p-4 ">
              <h2 className="block p-2 text-lg font-bold">Profile Detail</h2>
              <div className="shadow-inner xs:p-4 bg-zinc-200 dark:bg-[#1a1a1a]/50 rounded-xl">
                <table cellPadding={5} className="w-full">
                  <tr className="w-full max-xs:flex max-xs:flex-col">
                    <th className="text-start w-max whitespace-nowrap">
                      Full Name
                    </th>
                    <td className="w-full xs:px-10 p-2 max-xs:bg-zinc-400/10 rounded-md">
                      {userData?.fullName || "loading..."}
                    </td>
                  </tr>
                  <tr className="w-full max-xs:flex max-xs:flex-col">
                    <th className="text-start w-max whitespace-nowrap">
                      Username
                    </th>
                    <td className="w-full xs:px-10 p-2 max-xs:bg-zinc-400/10 rounded-md">
                      {userData?.userName || "loading..."}
                    </td>
                  </tr>
                  <tr className="w-full max-xs:flex max-xs:flex-col">
                    <th className="text-start w-max whitespace-nowrap">
                      Email
                    </th>
                    <td className="w-full xs:px-10 p-2 max-xs:bg-zinc-400/10 rounded-md">
                      {userData?.email || "loading..."}
                    </td>
                  </tr>
                  <tr className="w-full max-xs:flex max-xs:flex-col">
                    <th className="text-start w-max whitespace-nowrap">
                      Phone Number
                    </th>
                    <td className="w-full xs:px-10 p-2 max-xs:bg-zinc-400/10 rounded-md">
                      {userData?.contact || "loading..."}
                    </td>
                  </tr>
                </table>
              </div>

              <h2 className="block p-2 text-lg font-bold mt-10">Address</h2>
              <div className="shadow-inner xs:p-4 bg-zinc-200 dark:bg-[#1a1a1a]/50 rounded-xl">
                <table cellPadding={5} className="w-full">
                  <tr className="w-full">
                    <th className="text-start w-max whitespace-nowrap">City</th>
                    <td className="w-full px-10">
                      {userData?.address?.[0]?.city || "loading..."}
                    </td>
                  </tr>
                  <tr className="w-full">
                    <th className="text-start w-max whitespace-nowrap">
                      State
                    </th>
                    <td className="w-full px-10">
                      {userData?.address?.[0]?.state || "loading..."}
                    </td>
                  </tr>
                  <tr className="w-full">
                    <th className="text-start w-max whitespace-nowrap">
                      Pin Code
                    </th>
                    <td className="w-full px-10">
                      {userData?.address?.[0]?.pincode || "loading..."}
                    </td>
                  </tr>
                  <tr className="w-full">
                    <th className="text-start w-max whitespace-nowrap">
                      Country
                    </th>
                    <td className="w-full px-10">
                      {userData?.address?.[0]?.country || "loading..."}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </>
        );
      default:
        return <></>;
    }
  };

  const tabs = ["Account Details", "Account Update", "Reset Password"];
  const [currentTab1, setCurrentTab1] = useState(0); // Use the correct state name

  const renderTab1 = (tabIndex) => {
    switch (tabIndex) {
      case 0:
        return <div>Account Details Content</div>;
      case 1:
        return <div>Account Update Content</div>;
      case 2:
        return <div>Reset Password Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-zinc-100 dark:bg-[#1a1a1a] flex flex-col items-center justify-center overflow-y-auto">
      {/* Header / Cover Section */}
      <div className="relative flex items-center bg-zinc-400 dark:bg-zinc-700 w-full h-28 md:h-[20vmin]">
        <button className="absolute top-4 right-4 bg-white dark:bg-blue-600 dark:text-zinc-200 text-zinc-700 py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition">
          <FaCamera className="inline-block mr-2 relative" />
          Change Cover
        </button>
      </div>

      {/* Main Content */}
      <div
        className="md:flex justify-around gap-4 max-md:p-4 p-3 w-full flex-col md:flex-row bg-white dark:bg-[#1a1a1a] rounded-lg h-max"
        style={{ maxWidth: "1280px" }}
      >
        {/* Profile Sidebar */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 min-w-60 md:w-1/4 flex flex-col items-center shadow-xl">
          <div className="text-center flex flex-col items-center justify-center">
            <div className="relative size-28 rounded-full bg-red-500 flex items-center justify-center">
              <img
                src={userData?.profilePicture}
                alt="User Avatar"
                className="w-full aspect-square object-cover mx-auto rounded-full border-4 border-white shadow-lg"
                loading="lazy"
              />
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
                <FaCamera />
              </button>
            </div>
            <h2 className="mt-4 text-xl font-semibold">{userData?.fullName}</h2>
            <p className="text-md -mb-1 text-zinc-400">
              User Name: {userData?.userName}
            </p>
          </div>
          <div className="mt-6 space-y-4 text-md -mb-1 w-full">
            <div className="flex justify-between">
              <span className="text-black/70 dark:text-zinc-300">
                Event Organised
              </span>
              <span className="font-bold text-zinc-500 dark:text-zinc-300">
                32
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/70 dark:text-zinc-300">
                Pending Events
              </span>
              <span className="font-bold  text-zinc-500 dark:text-zinc-300">
                26
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/70 dark:text-zinc-300">Coins</span>
              <span className="font-bold  text-zinc-500 dark:text-zinc-300">
                6
              </span>
            </div>
          </div>
        </div>

        <br className="md:hidden" />

        {/* Settings Form */}
        <div className="flex-1 p-6 shadow-lg rounded-lg dark:bg-zinc-800">
          {/* Tabs */}
          <div className=" mb-6">
            <nav className="relative flex space-x-6">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTab(index)} // Ensure the correct state setter
                  className={`relative text-md -mb-1 pb-2 transition ${
                    index === currentTab
                      ? "text-blue-500"
                      : "text-black dark:text-white/70 hover:text-blue-400"
                  }`}
                >
                  {tab}
                  {index === currentTab && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500"
                      transition={{
                        type: "spring",
                        damping: 20,
                      }}
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Render the selected tab content */}
          {renderTab(currentTab)}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
