import React from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { RiMessageLine } from "react-icons/ri";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { MdOutlineFullscreen } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";

const NavBar = ({setShowSide, showSidebar}) => {
  const fn_controlSidebar = () => {
    setShowSide(!showSidebar)
  }
  return (
    <div className={`h-[55px]  flex justify-between transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"}`}>
      <div className="flex w-full justify-between items-center pl-7">
        <div className="text-[20px]">
          <FaBarsStaggered onClick={fn_controlSidebar} className="cursor-pointer" />
        </div>
        <div className="flex items-center gap-7 pr-7">
        <div className="text-[25px]">
          <RiMessageLine />
        </div>
        <div className="text-[25px]">
          <MdOutlineNotificationsNone />
        </div>
        <div className="text-[26px]">
          <MdOutlineFullscreen />
        </div>
        <div className="text-[20px]">
          <FaRegUser />
        </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
