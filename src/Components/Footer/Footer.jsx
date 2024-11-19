import React from "react";

const Footer = ({ showSidebar }) => {
  const containerHeight = window.innerHeight - 60;

  return (
    <div
      className={`h-[55px] bg-white flex justify-center items-center ${
        showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
      }`}
    >
        <p className="text-[#7987A1] font-[500] text-[15px]"> Copyright © 2024 BetPay. All rights reserved.</p>
    </div>
  );
};

export default Footer;
