import React from "react";

const Footer = ({ showSidebar }) => {
  const containerHeight = window.innerHeight - 60;

  return (
    <div
      className={`h-[55px] bg-white flex justify-center items-center ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
        }`}
    >
      <a 
        href="https://netrex.ae/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#7987A1] font-[500] text-[15px] hover:text-[#5d6b82] transition-colors duration-300"
      >
        Developed by NETREX Inc. All rights reserved
      </a>
    </div>
  );
};

export default Footer;
