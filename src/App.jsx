import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import SideBar from "./Components/Sidebar/SideBar";
import NavBar from "./Components/NabBar/NavBar";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import TransactionsTable from "./Pages/Transaction-Table/TransactionsTable";
import MerchantManagement from "./Pages/Merchant-Management/MerchantManagement";

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
          <Route
            path="/"
            element={<Home showSidebar={showSidebar} />}
          />
          <Route
            path="/TransactionsTable"
            element={<TransactionsTable showSidebar={showSidebar}/>}
          />
          <Route path="/MerchantManagement"
          element={<MerchantManagement showSidebar={showSidebar}/>}
          />
        </Routes>
        <Footer showSide={setShowSide} showSidebar={showSidebar} />
      </div>
    </>
  );
}

export default App;











