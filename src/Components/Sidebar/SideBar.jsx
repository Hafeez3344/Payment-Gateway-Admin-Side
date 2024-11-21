import React from "react";
import logo from "../../assets/logo.png";
import { MdOutlineDashboard } from "react-icons/md";
import { PiNotebook } from "react-icons/pi";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaHeadphones } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

const SideBar = ({showSidebar, setShowSide}) => {
  const fn_controlSidebar = () => {
    setShowSide(!showSidebar)
  }
  return (
    <div className={`fixed w-[270px] h-[100vh] bg-white border-r transition-all duration-500 ${showSidebar ? "left-0" : "left-[-270px]"}`}>
      <div className="flex pl-[21px] h-[55px] items-center gap-3 border-b border-secondary">
        <div className="">
          <img className="w-8 h-8" src={logo} alt="" />
        </div>
        <div    className=" font-roboto text-[20px] font-[600]">BetPay</div>
        <button className="bg-gray-200 h-[25px] w-[25px] rounded-sm flex md:hidden justify-center ml-20 items-center" onClick={fn_controlSidebar}>X</button>
      </div>
      <div className="mt-[10px]">
        <Menu
          label="Dashboard"
          icon={<MdOutlineDashboard className="text-[20px]" />}
        />
        <Menu 
        label="Transaction History" 
        icon={<PiNotebook className="text-[20px]" />}
          
        />
        <Menu label="Merchant Management" 
          icon={< FaRegCircleUser  className="text-[20px]" />}

        />
        <Menu label="Support / Help Center" 
          icon={<FaHeadphones className="text-[20px]" />}

        />
        <Menu label="Setting" 
          icon={<IoSettingsOutline  className="text-[20px]" />}

        />
      </div>
    </div>
  );
};

export default SideBar;

const Menu = ({ label, icon }) => {
  return (
    <div className="flex border-b gap-[15px] items-center py-[14px] px-[20px]">
      <div className="text-[rgba(105,155,247,1)]">
        {icon}
      </div>
      <p className="text-[14px] font-[600] text-gray-500">{label}</p>
    </div>
  );
};
