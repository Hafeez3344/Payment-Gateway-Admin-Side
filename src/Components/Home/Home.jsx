import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { FaCircleExclamation } from "react-icons/fa6";
import { fn_getAdminsTransactionApi, fn_getCardDataByStatus, fn_getAllTransactionApi } from "../../api/api";
import graph from "../../assets/graph.png";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Home = ({ authorization, showSidebar }) => {
  const navigate = useNavigate();
  const containerHeight = window.innerHeight - 120;
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cardData, setCardData] = useState({
    approved: {},
    pending: {},
    failed: {}
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const [totalTransaction, setTotalTransactions] = useState(0);
  const [declineTransactions, setDeclineTransactions] = useState(0);
  const [verifiedTransactions, setVerifiedTransactions] = useState(0);
  const [unverifiedTransactions, setUnverifiedTransactions] = useState(0);
  // const [manualVerified, setManualVerified] = useState(0);

  useEffect(() => {
    window.scroll(0, 0);
    if (!authorization) {
      navigate("/login");
    }
    fetchAllData();
  }, [authorization, navigate]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        approvedData,
        pendingData,
        declineData,
        totalData,
        recentTrxData
      ] = await Promise.all([
        fn_getCardDataByStatus('Approved', activeFilter),
        fn_getCardDataByStatus('Pending', activeFilter),
        fn_getCardDataByStatus('Decline', activeFilter),
        fn_getAllTransactionApi(),
        fn_getAdminsTransactionApi()
      ]);
      console.log("activeFilter ", activeFilter);
      console.log("approvedData ", approvedData);
      console.log("pendingData ", pendingData);
      console.log("declineData ", declineData);
      console.log("totalData ", totalData);
      // Set transaction counts
      setVerifiedTransactions(approvedData?.data?.data || 0);
      setUnverifiedTransactions(pendingData?.data?.data || 0);
      setDeclineTransactions(declineData?.data?.data || 0);
      setTotalTransactions(totalData?.data?.data || 0);

      // Set card data
      setCardData({
        approved: approvedData?.data || {},
        pending: pendingData?.data || {},
        failed: declineData?.data || {}
      });

      // Set recent transactions
      if (recentTrxData?.status) {
        setRecentTransactions(recentTrxData.data?.data?.slice(0, 10) || []);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = async (filterType) => {
    setLoading(true);
    setActiveFilter(filterType);
    try {
      const [
        approvedData,
        pendingData,
        declineData,
        totalData,
      ] = await Promise.all([
        fn_getCardDataByStatus('Approved', filterType),
        fn_getCardDataByStatus('Pending', filterType),
        fn_getCardDataByStatus('Decline', filterType),
        fn_getAllTransactionApi(),
      ]);

      // Set transaction counts
      setVerifiedTransactions(approvedData?.data?.data || 0);
      setUnverifiedTransactions(pendingData?.data?.data || 0);
      setDeclineTransactions(declineData?.data?.data || 0);
      setTotalTransactions(totalData?.data?.data || 0);

      // Set card data
      setCardData({
        approved: approvedData?.data || {},
        pending: pendingData?.data || {},
        failed: declineData?.data || {}
      });
    } catch (err) {
      console.error('Error fetching filtered data:', err);
      setError("Failed to fetch filtered data");
    } finally {
      setLoading(false);
    }
  };

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Approved",
        data: [
          10300, 15200, 19300, 14500, 5300, 10200, 12200, 7100, 16300, 13500,
          5300, 7400,
        ],
        backgroundColor: "#009666",
        // borderRadius: {
        //   topLeft: 10,
        //   topRight: 10,
        // },
      },
      {
        label: "Manual Varified",
        data: [
          15300, 5200, 17300, 18500, 5300, 17200, 12400, 7100, 14300, 13500,
          5300, 7400,
        ],
        backgroundColor: "#0C67E9",
      },
      {
        label: "Pending",
        data: [
          16300, 15200, 15300, 13500, 15300, 14200, 10200, 10200, 7100, 13500,
          5900, 3300,
        ],
        backgroundColor: "#F67A03",
      },
      {
        label: "Faild",
        data: [
          4500, 4000, 9300, 15000, 4000, 11000, 2000, 8000, 10200, 17400, 15300,
          18800,
        ],
        backgroundColor: "#FF3E5E",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    datasets: {
      bar: {
        barPercentage: 0.6,
        categoryPercentage: 0.9,
      },
    },
  };

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
        }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-5">
          <h1 className="text-[25px] font-[500]">Admin Dashboard</h1>
          <div className="flex space-x-2 text-[12px]">
            <button
              onClick={() => handleFilterClick('all')}
              className={`${activeFilter === 'all' ? 'text-white bg-[#0864E8]' : 'text-black'} 
                border w-[70px] sm:w-[70px] p-1 rounded`}
            >
              ALL
            </button>
            <button
              onClick={() => handleFilterClick('today')}
              className={`${activeFilter === 'today' ? 'text-white bg-[#0864E8]' : 'text-black'} 
                border w-[70px] sm:w-[70px] p-1 rounded`}
            >
              TODAY
            </button>
            <button
              onClick={() => handleFilterClick('7days')}
              className={`${activeFilter === '7days' ? 'text-white bg-[#0864E8]' : 'text-black'} 
                border w-[70px] sm:w-[70px] p-1 rounded`}
            >
              7 DAYS
            </button>
            <button
              onClick={() => handleFilterClick('30days')}
              className={`${activeFilter === '30days' ? 'text-white bg-[#0864E8]' : 'text-black'} 
                border w-[70px] sm:w-[70px] p-1 rounded`}
            >
              30 DAYS
            </button>
          </div>
        </div>

        {/* Boxes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
          <Boxes
            number={verifiedTransactions}
            amount={cardData.approved?.amount}
            title={"SYSTEM APPROVED TRANSACTIONS"}
            bgColor={
              "linear-gradient(to right, rgba(0, 150, 102, 1), rgba(59, 221, 169, 1))"
            }
            link={"/transactions?status=Approved"}
          />
          {/* <Boxes
            number={manualVerifiedTransactions}
            amount={cardData.manualVerified?.amount}
            title={"MANUAL VERIFIED TRANSACTIONS"}
            bgColor={
              "linear-gradient(to right, rgba(8, 100, 232, 1), rgba(108, 168, 255, 1))"
            }
          /> */}
          <Boxes
            number={unverifiedTransactions}
            amount={cardData.pending?.amount}
            title={"PENDING TRANSACTIONS"}
            bgColor={
              "linear-gradient(to right, rgba(245, 118, 0, 1), rgba(255, 196, 44, 1))"
            }
            link={"/transactions?status=Pending"}
          />
          <Boxes
            number={declineTransactions}
            amount={cardData.failed?.amount}
            title={"FAILED TRANSACTIONS"}
            bgColor={
              "linear-gradient(to right, rgba(255, 61, 92, 1), rgba(255, 122, 143, 1))"
            }
            link={"/transactions?status=Decline"}
          />
        </div>

        {/* Graph and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Graph Section */}
          <div className="col-span-2 bg-white p-6 mb-4 md:mb-0 md:mr-4 rounded shadow flex-1 h-[100%]">
            <div className="w-full">
              <div className="justify-between items-center mb-4">
                <h2 className="text-[16px] font-[700]">TRANSACTION STATS</h2>
                <p className="text-[11px] font-[500] text-gray-500 mt-1">
                  Order status and tracking. Track your order from ship date to
                  arrival.To begin, enter your order number.
                </p>
                <div className="grid grid-cols-2 gap-4 md:flex md:gap-12 mt-3">
                  <Stat
                    label="System Approved"
                    value={verifiedTransactions}
                    color="#029868"
                  />
                  <Stat label="Pending" value={unverifiedTransactions} color="#F67A03" />
                  <Stat label="Decline" value={declineTransactions} color="#FF3E5E" />
                  {/* <Stat label="Manual Verified"value={manualVerified} color="#0C67E9" /> */}
                </div>
              </div>
              <div className="w-full h-[300px]">
                <Bar data={data} options={options} />
              </div>
            </div>
          </div>

          {/* Recent Transactions Section */}
          <div className="bg-white p-6 rounded shadow w-full flex-1 h-[100%]">
            <h2 className="text-[16px] font-[700]">RECENT TRANSACTIONS</h2>
            <p className="text-[11px] font-[500] text-gray-500 pt-1">
              Customer is an individual or business that purchases the goods or services, and the process has evolved to include real-time tracking.
            </p>

            <div className="">
              {loading ? (
                <p className="text-center py-4">Loading...</p>
              ) : error ? (
                <div className="flex items-center space-x-2 mt-2 text-gray-500">
                  <FaCircleExclamation className="text-gray-500" />
                  <p>{error}</p>
                </div>
              ) : recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <RecentTransaction
                    key={index}
                    name={transaction?.bankId?.bankName || "UPI"}
                    utrId={transaction?.utr || "N/A"}
                    status={transaction?.status || "Pending"}
                    color={getStatusColor(transaction?.status)}
                    amount={`₹${transaction?.amount || 0}`}
                  />
                ))
              ) : (
                <p className="text-center py-4 text-gray-500">No recent transactions</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this helper function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return '#029868';
    case 'Decline':
      return '#FF3F5E';
    case 'Pending':
      return '#F67A03';
    default:
      return '#7987A1';
  }
};

const Boxes = ({ number, amount, title, bgColor, link }) => (
  <Link
    to={link}
    className="bg-white px-[14px] py-[10px] rounded-[5px] shadow text-white"
    style={{ backgroundImage: bgColor }}
  >
    <h2 className="text-[13px] uppercase font-[500]">{title}</h2>
    <p className="mt-[13px] text-[20px] font-[700]">₹ {number}</p>
    <p className="pt-[3px] text-[13px] font-[500] mb-[7px]">
      Amount: <span className="font-[700]">₹ {amount}</span>
    </p>
  </Link>
);

const Stat = ({ label, value, color }) => (
  <div>
    <p className="text-[15px] font-[700]">₹ {value}</p>
    <div className="flex pt-1 gap-1 items-center">
      <GoDotFill style={{ color }} />
      <p className="text-[12px] font-[500]">{label}</p>
    </div>
  </div>
);

const RecentTransaction = ({ name, status, color, amount, utrId }) => (
  <div className="flex justify-between items-center py-3 border-b">
    {/* Left Section */}
    <div className="flex flex-col">
      <div className="flex items-center">
        <p className="text-[15px] font-[600]">{name}</p>
      </div>

      {/* UTR ID and Status aligned from the left */}
      <div className="flex items-center gap-4 text-[10px] pt-1 text-[#7987A1] font-[600]">
        {/* UTR ID */}
        <span>UTR: {utrId}</span>
        {/* Status aligned to the right of UTR ID */}
        <span className="text-[10px] font-[600]" style={{ color }}>
          {status}
        </span>
      </div>
    </div>

    {/* Right Section - Amount */}
    <div className="flex flex-col items-end">
      <p className="text-[16px] font-[600]">{amount}</p>
    </div>
  </div>
);

export default Home;
