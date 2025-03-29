import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import Home from "./Components/Home/Home";
import NavBar from "./Components/NabBar/NavBar";
import Footer from "./Components/Footer/Footer";
import SideBar from "./Components/Sidebar/SideBar";
import TransactionsTable from "./Pages/Transaction-Table/TransactionsTable";
import SupportHelpCenter from "./Pages/Support-Help-Center/SupportHelpCenter";
import SystemConfigurationIntegration from "./Pages/System-Configuration-Integration/SystemConfigurationIntegration";
import VerifiedTransactions from "./Pages/Verified-Transactions/VerifiedTransactions";
import ManualVerifiedTransactions from "./Pages/Manual-Verified-Transactions/ManualVerifiedTransactions";
import UnverifiedTransactions from "./Pages/Unverified-Transactions/UnverifiedTransactions";
import DeclinedTransactions from "./Pages/Declined-Transactions/DeclinedTransactions";
import Login from "./Pages/Admin-Login/AdminLogin";
import BankManagement from "./Pages/Banks/Banks";
import MerchantManagement from "./Pages/Merchant-Management/MerchantManagement";
import UploadStatement from "./Pages/Upload-Statement/UploadStatement";
import CurrencyExchange from "./Pages/Currency-Exchange/CurrencyExchange";
import Staff from "./Pages/Staff/Staff";
import Reports from "./Pages/Reports/Reports";
import Commission from "./Pages/Commission/Commission";
import Withdraw from "./Pages/Withdraw-Page/Withdraw";
import Payout from "./Pages/Payout/Payout";
import PayoutDetails from "./Pages/Payout/PayoutDetails";
import WalletTransfer from "./Pages/WalletTransfer/WalletTransfer";

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
      <div className="min-h-[100vh]">
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
            path="/wallet-transfer"
            element={
              <WalletTransfer
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
            path="/banks-management"
            element={
              <BankManagement
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
                setAuthorization={setAuthorization}
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
            path="/upload-statement"
            element={
              <UploadStatement
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
          <Route
            path="/currency-exchange"
            element={
              <CurrencyExchange
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
          <Route
            path="/reports"
            element={
              <Reports
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
          <Route
            path="/commission"
            element={
              <Commission
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
          <Route
            path="/staff"
            element={
              <Staff
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
          <Route
            path="/withdraw"
            element={
              <Withdraw
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
          <Route
            path="/payout"
            element={
              <Payout
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
          <Route
            path="/payout-details"
            element={
              <PayoutDetails
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
