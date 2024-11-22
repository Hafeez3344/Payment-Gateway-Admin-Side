import "./App.css";
import React, { useState } from "react";
import Home from "./Components/Home/Home";
import NavBar from "./Components/NabBar/NavBar";
import Footer from "./Components/Footer/Footer";
import { Routes, Route } from "react-router-dom";
import SideBar from "./Components/Sidebar/SideBar";
import TransactionsTable from "./Pages/Transaction-Table/TransactionsTable";
import SupportHelpCenter from "./Pages/Support-Help-Center/SupportHelpCenter";
import MerchantManagement from "./Pages/Merchant-Management/MerchantManagement";
import SystemConfigurationIntegration from "./Pages/System-Configuration-Integration/SystemConfigurationIntegration";
import VerifiedTransactions from "./Pages/Verified-Transactions/VerifiedTransactions";
import ManualVerifiedTransactions from "./Pages/Manual-Verified-Transactions/ManualVerifiedTransactions";
import UnverifiedTransactions from "./Pages/Unverified-Transactions/UnverifiedTransactions";
import DeclinedTransactions from "./Pages/Declined-Transactions/DeclinedTransactions";

function App() {
  const [showSidebar, setShowSide] = useState(
    window.innerWidth > 760 ? true : false
  );
  return (
    <>
      <SideBar showSidebar={showSidebar} setShowSide={setShowSide} />
      <div>
        <NavBar setShowSide={setShowSide} showSidebar={showSidebar} />
        <Routes>
          <Route path="/" element={<Home showSidebar={showSidebar} />} />
          <Route
            path="/TransactionsTable"
            element={<TransactionsTable showSidebar={showSidebar} />}
          />
          <Route
            path="/VerifiedTransactions"
            element={<VerifiedTransactions showSidebar={showSidebar} />}
          />
          <Route
            path="/ManualVerifiedTransactions"
            element={<ManualVerifiedTransactions showSidebar={showSidebar} />}
          />
          <Route
            path="/UnverifiedTransactions"
            element={<UnverifiedTransactions showSidebar={showSidebar} />}
          />
          <Route
            path="/DeclinedTransactions"
            element={<DeclinedTransactions showSidebar={showSidebar} />}
          />
          <Route
            path="/MerchantManagement"
            element={<MerchantManagement showSidebar={showSidebar} />}
          />
          <Route
            path="/SupportHelpCenter"
            element={<SupportHelpCenter showSidebar={showSidebar} />}
          />
          <Route
            path="/SystemConfigurationIntegration"
            element={
              <SystemConfigurationIntegration showSidebar={showSidebar} />
            }
          />
        </Routes>
        <Footer showSide={setShowSide} showSidebar={showSidebar} />
      </div>
    </>
  );
}

export default App;
