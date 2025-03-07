import React, { useState, useEffect } from "react";
import { notification, Pagination } from "antd";
import { useLocation } from "react-router-dom";
import { FiXCircle } from "react-icons/fi";
import { fn_getExcelFileWithdrawData } from "../../api/api";

const PayoutDetails = ({ showSidebar }) => {

  const location = useLocation();
  const { withraw } = location.state;
  const containerHeight = window.innerHeight - 120;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [slipData, setSlipData] = useState([]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-[#10CB0026] text-[#0DA000]";
      case "Pending":
        return "bg-[#FFC70126] text-[#FFB800]";
      case "Manual Verified":
        return "bg-[#0865e851] text-[#0864E8]";
      case "Declined":
        return "bg-[#FF7A8F33] text-[#FF002A]";
      default:
        return "bg-[#10CB0026] text-[#0DA000]";
    }
  };

  const getExcelFileData = async () => {
    try {
      const response = await fn_getExcelFileWithdrawData(withraw._id);
      if (response?.status) {
        setSlipData(response?.data?.data || []);
        setTotalPages(response?.data?.totalPages || 1);
      } else {
        notification.error({
          message: "Error",
          description: response?.message,
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error fetching excel data:", error);
    }
  };

  useEffect(() => {
    if (withraw?._id) {
      getExcelFileData();
    }
  }, [withraw?._id, currentPage]);

  const handleCancelPayout = (index) => {
    console.log(`Cancel payout at index: ${index}`);
  };

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${
        showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
      }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[25px] font-[500]">Payouts Details</h1>
        </div>
        <div className="bg-white">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                <th className="p-4">S_ID</th>
                <th className="p-4">Username</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Bank / UPI</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {slipData?.map((item, index) => (
                <tr key={index} className="text-gray-800 text-sm border-b">
                  <td className="p-4 text-[12px] font-[600] text-[#000000B2]">
                    {index + 1}
                  </td>
                  <td className="p-4 text-[12px] font-[600] text-[#000000B2]">
                    {item?.username}
                  </td>
                  <td className="p-4 text-[12px] font-[600] text-[#000000B2]">
                    {item?.amount} INR
                  </td>
                  <td className="p-4 text-[12px] font-[700] text-[#000000B2]">
                    {item?.account}
                  </td>
                  <td className="p-4 text-[13px] font-[500]">
                    <span className={`px-2 py-1 rounded-[20px] text-nowrap max-w-[100px] text-[11px] font-[600] min-w-10 flex items-center justify-center ${getStatusClass(item?.status)}`}>
                      {item?.status}
                    </span>
                  </td>
                  <td className="p-4 text-[12px] font-[600]">
                    <button
                      className="text-red-600 hover:text-red-800 p-2 text-lg"
                      onClick={() => handleCancelPayout(index)}
                    >
                      <FiXCircle />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            current={currentPage}
            total={totalPages * 10}
            onChange={(page) => setCurrentPage(page)}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
};

export default PayoutDetails;