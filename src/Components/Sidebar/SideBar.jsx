import Cookies from "js-cookie";
import { BsBank } from "react-icons/bs";
import { LuLogOut } from "react-icons/lu";
import { TbBookUpload } from "react-icons/tb";
import { TbReportSearch } from "react-icons/tb";
import { FaMoneyBillWave } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import Royal247Logo from "../../assets/Royal247Logo.png"
import { MdOutlineCurrencyExchange } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { PiHandWithdraw, PiNotebook } from "react-icons/pi";
import { FaPeopleGroup, FaRegCircleUser } from "react-icons/fa6";
import { CgArrowsExchangeV } from "react-icons/cg";


const SideBar = ({ showSidebar, setShowSide, setAuthorization }) => {

  const location = useLocation();
  const navigate = useNavigate();
  const loginType = Cookies.get('type');
  const isMobile = () => window.innerWidth < 1024;
  const [selectedPage, setSelectedPage] = useState("");

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setSelectedPage("dashboard");
    else setSelectedPage(path.substring(1));
  }, [location]);

  const fn_controlSidebar = () => {
    setShowSide(!showSidebar);
  };

  const handleMenuClick = (page, path) => {
    setSelectedPage(page);
    navigate(path);
    if (isMobile()) fn_controlSidebar();
  };

  const fn_logout = () => {
    Cookies.remove('adminId');
    Cookies.remove('token');
    Cookies.remove('type');
    setAuthorization(false);
    navigate("/login");
  }

  return (
    <div
      className={`fixed w-[270px] h-[100vh] bg-white border-r transition-all duration-500 ${showSidebar ? "left-0" : "left-[-270px]"
        }`}
      style={{ zIndex: 999 }}
    >
      <div className="flex pl-[21px] h-[55px] items-center gap-3 border-b border-secondary">
        <div>
          <img className="w-[160px]" src={Royal247Logo} alt="" />
        </div>
        <button
          className="bg-gray-200 h-[25px] w-[25px] rounded-sm flex md:hidden justify-center ml-20 items-center"
          onClick={fn_controlSidebar}
        >
          X
        </button>
      </div>
      <div className="mt-[10px] mb-[50px] overflow-auto" style={{ height: "calc(100vh - 115px)" }}>
        {/* dashboard */}
        {loginType === "admin" && (
          <Menu
            onClick={() => handleMenuClick("dashboard", "/")}
            label="Dashboard"
            icon={<MdOutlineDashboard className="text-[20px]" />}
            isActive={selectedPage === "dashboard"}
          />
        )}
        {/* transactions */}
        <Menu
          onClick={() => handleMenuClick("transactions", "/transactions")}
          label="Transactions"
          icon={<PiNotebook className="text-[20px]" />}
          isActive={selectedPage === "transactions"}
        />
        {/* withdraw request */}
        {loginType === "admin" && (
          <Menu
            onClick={() =>
              handleMenuClick("withdraw", "/withdraw")
            }
            label="Withdraw Requests"
            icon={<PiHandWithdraw className="text-[20px]" />}
            isActive={selectedPage === "withdraw"}
          />
        )}
        {/* payout */}
        {loginType === "admin" && (
          <Menu
            onClick={() =>
              handleMenuClick("payout", "/payout")
            }
            label="Payout"
            icon={<FaMoneyBillWave className="text-[20px]" />}
            isActive={selectedPage === "payout"}
          />
        )}
        {/* wallet transfer */}
        {loginType === "admin" && (
          <Menu
            onClick={() =>
              handleMenuClick("walletTransfer", "/wallet-transfer")
            }
            label="Wallet Transfer"
            icon={<CgArrowsExchangeV className="text-[22px]" />}
            isActive={selectedPage === "wallet-transfer"}
          />
        )}
        {/* exchange rate */}
        {loginType === "admin" && (
          <Menu
            onClick={() =>
              handleMenuClick("currency-exchange", "/currency-exchange")
            }
            label="Exchange Rate"
            icon={<MdOutlineCurrencyExchange className="text-[20px]" />}
            isActive={selectedPage === "currency-exchange"}
          />
        )}
        {/* banks-management */}
        {loginType === "admin" && (
          <Menu
            onClick={() =>
              handleMenuClick("banks-management", "/banks-management")
            }
            label="Banks Management"
            icon={<BsBank className="text-[20px]" />}
            isActive={selectedPage === "banks-management"}
          />

        )}
        {/* merchant management */}
        {loginType === "admin" && (
          <Menu
            onClick={() =>
              handleMenuClick("merchant-management", "/merchant-management")
            }
            label="Merchant Management"
            icon={<FaRegCircleUser className="text-[20px]" />}
            isActive={selectedPage === "merchant-management"}
          />
        )}
        {/* reports */}
        {loginType === "admin" && (
          <Menu
            onClick={() =>
              handleMenuClick("reports", "/reports")
            }
            label="Reports"
            icon={<TbReportSearch className="text-[20px]" />}
            isActive={selectedPage === "reports"}
          />
        )}
        {/* staff */}
        {loginType === "admin" && (
          <Menu
            onClick={() =>
              handleMenuClick("staff", "/staff")
            }
            label="Staff"
            name="staff"
            icon={<FaPeopleGroup className="text-[20px]" />}
            isActive={selectedPage === "staff"}
          />
        )}
        {/* upload statement */}
        {loginType === "admin" && (
          <Menu
            onClick={() => {
              handleMenuClick("upload-statement", "/upload-statement")
            }}
            label="Upload Statement"
            icon={<TbBookUpload className="text-[20px]" />}
            isActive={selectedPage === "upload-statement"}
          />
        )}
        {/* settings */}
        {loginType === "admin" && (
          <Menu
            onClick={() =>
              handleMenuClick("system-configuration", "/system-configuration")
            }
            label="Settings"
            icon={<IoSettingsOutline className="text-[20px]" />}
            isActive={selectedPage === "system-configuration"}
          />
        )}

        {/* {loginType === "admin" && (
          <Menu
            onClick={() =>
              handleMenuClick("commission", "/commission")
            }
            label="Pay-In"
            icon={<FaHandHoldingUsd className="text-[20px]" />}
            isActive={selectedPage === "commission"}
          />
        )} */}
        {/* {loginType === "admin" && (
          <Menu
            onClick={() =>
              handleMenuClick("support-help-center", "/support-help-center")
            }
            label="Support / Help Center"
            icon={<FaHeadphones className="text-[20px]" />}
            isActive={selectedPage === "support-help-center"}
          />
        )} */}

      </div>
      <div
        onClick={fn_logout}
        className="flex border-t gap-[15px] items-center py-[14px] px-[20px] cursor-pointer absolute bottom-0 w-full bg-white"
      >
        <div className="text-[rgba(105,155,247,1)]">
          <LuLogOut className="text-[20px] rotate-180" />
        </div>
        <p className="text-[14px] font-[600] text-gray-500">Logout</p>
      </div>
    </div>
  );
};

export default SideBar;

const Menu = ({ label, icon, onClick, isActive }) => {
  return (
    <div
      className={`flex border-b gap-[15px] items-center py-[14px] px-[20px] cursor-pointer ${isActive ? "bg-blue-50" : ""
        }`}
      onClick={onClick}
    >
      <div className="text-[rgba(105,155,247,1)]">{icon}</div>
      <p className="text-[14px] font-[600] text-gray-500">{label}</p>
    </div>
  );
};


// import Cookies from "js-cookie";
// import React, { useState, useEffect } from "react";
// import logo from "../../assets/logo.png";
// import { LuLogOut } from "react-icons/lu";
// import { PiNotebook } from "react-icons/pi";
// import { FaHeadphones } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { MdOutlineDashboard } from "react-icons/md";
// import { IoSettingsOutline } from "react-icons/io5";

// const SideBar = ({ showSidebar, setShowSide, setAuthorization }) => {
//   const [selectedPage, setSelectedPage] = useState(""); 

//   const navigate = useNavigate();
//   const isMobile = () => window.innerWidth < 1024;

//   useEffect(() => {
//     const storedPage = localStorage.getItem("selectedPage"); 
//     if (storedPage) {
//       setSelectedPage(storedPage); 
//     }
//   }, []);

//   const handleMenuClick = (page, path) => {
//     setSelectedPage(page); 
//     localStorage.setItem("selectedPage", page); 
//     navigate(path); 
//     if (isMobile()) fn_controlSidebar(); 
//   };

//   const fn_controlSidebar = () => {
//     setShowSide(!showSidebar);
//   };

//   const fn_logout = () => {
//     Cookies.remove('adminId');
//     Cookies.remove('token');
//     setAuthorization(false);
//     localStorage.removeItem("selectedPage"); 
//     navigate("/login");
//   };

//   return (
//     <div
//       className={`fixed w-[270px] h-[100vh] bg-white border-r transition-all duration-500 ${
//         showSidebar ? "left-0" : "left-[-270px]"
//       }`}
//       style={{ zIndex: 999 }}
//     >
//       <div className="flex pl-[21px] h-[55px] items-center gap-3 border-b border-secondary">
//         <div>
//           <img className="w-8 h-8" src={logo} alt="" />
//         </div>
//         <div className="font-roboto text-[20px] font-[600]">BetPay</div>
//         <button
//           className="bg-gray-200 h-[25px] w-[25px] rounded-sm flex md:hidden justify-center ml-20 items-center"
//           onClick={fn_controlSidebar}
//         >
//           X
//         </button>
//       </div>
//       <div className="mt-[10px]">
//         <Menu
//           onClick={() => handleMenuClick("dashboard", "/")}
//           label="Dashboard"
//           icon={<MdOutlineDashboard className="text-[20px]" />}
//           isActive={selectedPage === "dashboard"}
//         />
//         <Menu
//           onClick={() => handleMenuClick("transactions", "/transactions")}
//           label="Transaction History"
//           icon={<PiNotebook className="text-[20px]" />}
//           isActive={selectedPage === "transactions"}
//         />
//         <Menu
//           onClick={() =>
//             handleMenuClick("merchant-management", "/merchant-management")
//           }
//           label="Merchant Management"
//           icon={<FaRegCircleUser className="text-[20px]" />}
//           isActive={selectedPage === "merchant-management"}
//         />
//         <Menu
//           onClick={() =>
//             handleMenuClick("support-help-center", "/support-help-center")
//           }
//           label="Support / Help Center"
//           icon={<FaHeadphones className="text-[20px]" />}
//           isActive={selectedPage === "support-help-center"}
//         />
//         <Menu
//           onClick={() =>
//             handleMenuClick("system-configuration", "/system-configuration")
//           }
//           label="Settings"
//           icon={<IoSettingsOutline className="text-[20px]" />}
//           isActive={selectedPage === "system-configuration"}
//         />
//       </div>
//       <div
//         onClick={fn_logout}
//         className="flex border-t gap-[15px] items-center py-[14px] px-[20px] cursor-pointer absolute bottom-0 w-full"
//       >
//         <div className="text-[rgba(105,155,247,1)]"><LuLogOut className="text-[20px] rotate-180" /></div>
//         <p className="text-[14px] font-[600] text-gray-500">Logout</p>
//       </div>
//     </div>
//   );
// };

// export default SideBar;

// const Menu = ({ label, icon, onClick, isActive }) => {
//   return (
//     <div
//       className={`flex border-b gap-[15px] items-center py-[14px] px-[20px] cursor-pointer ${
//         isActive ? "bg-blue-50" : ""
//       }`}
//       onClick={onClick}
//     >
//       <div className="text-[rgba(105,155,247,1)]">{icon}</div>
//       <p className="text-[14px] font-[600] text-gray-500">{label}</p>
//     </div>
//   );
// };
