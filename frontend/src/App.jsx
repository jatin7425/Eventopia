import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/AuthPage';
import WelcomePage from './pages/WelcomePage';
import EventSelection from './pages/EventSelection';
import ProfileDashboard from './pages/ProfileDashboard';
import PasswordReset from './pages/PasswordReset';
import LocomotiveScroll from 'locomotive-scroll';
import VendorCollection from './component/Vendor/VendorCollection';
import ProductCollection from './component/ProductCard/ProductCollection';
import SubscriptionPage from './pages/SubscriptionPage';
import AIChatSupport from './component/AIChat/AIChatSupport';
import VendorOrderManager from './component/Vendor/VendorOrderManager';
import EventInvitaion from './component/EventAcception/EventInvitaion';
import AdminPage from './pages/AdminPage';


const App = () => {

  const locomotiveScroll = new LocomotiveScroll();
  
  // Render the routes
  return (
    <div
      className="dark:bg-[#1a1a1a] dark:text-white bg-white font-['Founders_Grotesk'] "
      data-scroll-container
    >
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<WelcomePage />} />
        <Route path="/user/:page" element={<ProfileDashboard />} />
        <Route path="/resetPassword" element={<PasswordReset />} />
        <Route path="/eventSelection" element={<EventSelection />} />
        <Route path="/user/:page/:vendorId" element={<ProfileDashboard />} />
        <Route path="/vendorCollection" element={<VendorCollection />} />
        <Route path="/productCollection/:id" element={<ProductCollection />} />
        <Route path="/subscriptionPage" element={<SubscriptionPage />} />
        <Route path="/aichatbot" element={<AIChatSupport />} />
        <Route path="/vendorordermanager" element={<VendorOrderManager />} />
        <Route path="/eventinvitaion" element={<EventInvitaion />} />
        <Route path="/@bw!n" element={<AdminPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
