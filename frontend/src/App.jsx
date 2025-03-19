import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/AuthPage';
import WelcomePage from './pages/WelcomePage';
import EventSelection from './pages/EventSelection';
import ProfileDashboard from './pages/ProfileDashboard';
import PasswordReset from './pages/PasswordReset';
import FamilyEvent from './pages/FamilyEvent';
import VendorProduct from './pages/VendorProduct';
import LocomotiveScroll from 'locomotive-scroll';
import VendorCollection from './component/VendorCards/VendorCollection';
import ProductCollection from './component/ProductCard/ProductCollection';
import SubscriptionPage from './pages/SubscriptionPage';
// import AdminPanelPage from './pages/AdminPanelPage';


const App = () => {

  const locomotiveScroll = new LocomotiveScroll();
  
  // Render the routes
  return (
    <div
      className="dark:bg-[#1a1a1a] dark:text-white bg-white "
      data-scroll-container
    >
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        {/* <Route path="/adminPanel" element={<AdminPanelPage/>} /> */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/user/:page" element={<ProfileDashboard />} />
        <Route path="/resetPassword" element={<PasswordReset />} />
        <Route path="/eventSelection" element={<EventSelection />} />
        <Route path="/vendorProducts" element={<VendorProduct />} />
        <Route path="/user/:page/:vendorId" element={<ProfileDashboard />} />
        <Route path="/vendorCollection" element={<VendorCollection />} />
        <Route path="/productCollection/:id" element={<ProductCollection />} />
        <Route path="/subscriptionPage" element={<SubscriptionPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
