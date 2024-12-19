import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import Home from "./Components/Home/Home";
import NavBar from "./Components/NabBar/NavBar";
import Footer from "./Components/Footer/Footer";
import SideBar from "./Components/Sidebar/SideBar";
import TransactionsTable from "./Pages/Transaction-Table/TransactionsTable";
import SupportHelpCenter from "./Pages/Support-Help-Center/SupportHelpCenter";
import MerchantManagement from "./Pages/Merchant-Management/MerchantManagement";
import SystemConfigurationIntegration from "./Pages/System-Configuration-Integration/SystemConfigurationIntegration";
import VerifiedTransactions from "./Pages/Verified-Transactions/VerifiedTransactions";
import ManualVerifiedTransactions from "./Pages/Manual-Verified-Transactions/ManualVerifiedTransactions";
import UnverifiedTransactions from "./Pages/Unverified-Transactions/UnverifiedTransactions";
import DeclinedTransactions from "./Pages/Declined-Transactions/DeclinedTransactions";
import Login from "./Pages/Admin-Login/AdminLogin";

function App() {
  const [authorization, setAuthorization] = useState(
    Cookies.get("token") ? true : false
  );
  const [showSidebar, setShowSide] = useState(
    window.innerWidth > 760 ? true : false
  );

  return (
    <>
      {authorization && (
        <SideBar showSidebar={showSidebar} setShowSide={setShowSide} setAuthorization={setAuthorization} />
      )}
      <div>
        {authorization && (
          <NavBar showSidebar={showSidebar} setShowSide={setShowSide} />
        )}
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                authorization={authorization}
                setAuthorization={setAuthorization}
              />
            }
          />
          <Route
            path="/"
            element={
              <Home authorization={authorization} showSidebar={showSidebar} />
            } transactions
          />
          <Route
            path="/transactions"
            element={
              <TransactionsTable
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
          <Route
            path="/verified-transactions"
            element={
              <VerifiedTransactions
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
          <Route
            path="/manual-verified-transactions"
            element={
              <ManualVerifiedTransactions
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
          <Route
            path="/unverified-transactions"
            element={
              <UnverifiedTransactions
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
          <Route
            path="/declined-transactions"
            element={
              <DeclinedTransactions
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
          <Route
            path="/merchant-management"
            element={
              <MerchantManagement
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
          <Route
            path="/support-help-center"
            element={
              <SupportHelpCenter
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
          <Route
            path="/system-configuration"
            element={
              <SystemConfigurationIntegration
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
        </Routes>
        {authorization && <Footer />}
      </div>
    </>
  );
}

export default App;
