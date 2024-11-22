import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import graph from "../../assets/graph.png";
import { GoDotFill } from "react-icons/go";

const Home = ({ showSidebar }) => {
  const containerHeight = window.innerHeight - 120;

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div
    className={`bg-gray-100 transition-all duration-500 ${
      showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
    }`}
    style={{ minHeight: `${containerHeight}px` }}
  >
      <div className="p-7">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[25px] font-[500]">Admin Dashboard</h1>
          <div className="flex space-x-2 text-[12px]">
            <button className="text-black border w-[70px] sm:w-[70px] p-1 rounded">
              TODAY
            </button>
            <button className="text-black border w-[70px] sm:w-[70px] p-1 rounded">
              7 DAYS
            </button>
            <button className="text-black border w-[70px] sm:w-[70px] p-1 rounded">
              30 DAYS
            </button>
          </div>
        </div>

        {/* Boxes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          <Boxes
            number={"6,273"}
            amount={"876347"}
            title={"SYSTEM VERIFIED TRANSACTIONS"}
            bgColor={
              "linear-gradient(to right, rgba(0, 150, 102, 1), rgba(59, 221, 169, 1))"
            }
          />
          <Boxes
            number={"3,512"}
            amount={"574535"}
            title={"MANUAL VERIFIED TRANSACTIONS"}
            bgColor={
              "linear-gradient(to right, rgba(8, 100, 232, 1), rgba(108, 168, 255, 1))"
            }
          />
          <Boxes
            number={"6,273"}
            amount={"876347"}
            title={"PENDING TRANSACTIONS"}
            bgColor={
              "linear-gradient(to right, rgba(245, 118, 0, 1), rgba(255, 196, 44, 1))"
            }
          />
          <Boxes
            number={"6,273"}
            amount={"876347"}
            title={"FAILED TRANSACTIONS"}
            bgColor={
              "linear-gradient(to right, rgba(255, 61, 92, 1), rgba(255, 122, 143, 1))"
            }
          />
        </div>

        {/* Graph and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Graph Section */}
          <div className="col-span-2  bg-white p-6 mb-4 md:mb-0 md:mr-4 rounded shadow flex-1 h-[100%]">
            <h2 className="text-[16px] font-[700]">TRANSACTION STATS</h2>
            <p className="text-[11px] font-[500] text-gray-500 mt-1">
              Order status and tracking. Track your order from ship date to
              arrival.To begin, enter your order number.
            </p>
            <div className="grid grid-cols-2 gap-4 md:flex md:gap-12 mt-3">
              <Stat label="System Verified" value="120,750" color="#029868" />
              <Stat label="Declined" value="56,108" color="#FF3E5E" />
              <Stat label="Unverified" value="32,894" color="#F67A03" />
              <Stat label="Manual Verified" value="51,235" color="#0C67E9" />
            </div>
            <img className="pt-8" src={graph} alt="Graph" />
          </div>

          {/* Recent Transactions Section */}
          <div className="bg-white p-6 rounded shadow w-full flex-1 h-[100%]">
            <h2 className="text-[16px] font-[700]">RECENT TRANSACTIONS</h2>
            <p className="text-[11px] font-[500] text-gray-500 pt-1">
              Customer is an individual or business that purchases the goods
              service has evolved to include real-time.
            </p>
            <RecentTransaction
              name="Saman Paret"
              company="Bookfir"
              status="Verified"
              color="#029868"
              amount="₹4,980"
            />
            <RecentTransaction
              name="Rahul Dev"
              company="Bookfir"
              status="Declined"
              color="#FF3F5E"
              amount="₹8,923"
            />
            <RecentTransaction
              name="Arjun Sharma"
              company="Bookfir"
              status="Manual"
              color="#0864E8"
              amount="₹5,723"
            />
            <RecentTransaction
              name="Arjun Sharma"
              company="Bookfir"
              status="Manual"
              color="#0864E8"
              amount="₹5,723"
            />
            <RecentTransaction
              name="Rahul Dev"
              company="Bookfir"
              status="Declined"
              color="#FF3F5E"
              amount="₹8,923"
            />
            <RecentTransaction
              name="Saman Paret"
              company="Bookfir"
              status="Verified"
              color="#029868"
              amount="₹4,980"
            />
            <RecentTransaction
              name="Saman Paret"
              company="Bookfir"
              status="Verified"
              color="#029868"
              amount="₹4,980"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Boxes = ({ number, amount, title, bgColor }) => (
  <div
    className="bg-white px-[14px] py-[10px] rounded-[5px] shadow text-white"
    style={{ backgroundImage: bgColor }}
  >
    <h2 className="text-[13px] uppercase font-[500]">{title}</h2>
    <p className="mt-[13px] text-[20px] font-[700]">{number}</p>
    <p className="pt-[3px] text-[13px] font-[500] mb-[7px]">
      Amount: <span className="font-[700]">₹{amount}</span>
    </p>
  </div>
);

const Stat = ({ label, value, color }) => (
  <div>
    <p className="text-[15px] font-[700]">{value}</p>
    <div className="flex pt-1 gap-1 items-center">
      <GoDotFill className={`text-[${color}]`} />
      <p className="text-[12px] font-[500]">{label}</p>
    </div>
  </div>
);

const RecentTransaction = ({ name, company, status, color, amount }) => (
  <div className="flex gap-28 pt-3 border-b-2 py-3">
    <div>
      <p className="text-[15px] font-[600]">{name}</p>
      <p className="text-[10px] pt-1 text-[#7987A1] font-[600]">
        {company} <span className={`pl-10 text-[${color}]`}>{status}</span>
      </p>
    </div>
    <div>
      <p className="text-[16px] font-[600]">{amount}</p>
    </div>
  </div>
);

export default Home;
