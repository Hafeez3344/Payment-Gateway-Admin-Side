import moment from "moment/moment";
import { MagnifyingGlass } from "react-loader-spinner";
import { Pagination, notification } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
import { fn_getUploadExcelFileData } from "../../api/api";

const Payout = ({ authorization, showSidebar }) => {
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1);
  const containerHeight = window.innerHeight - 120;
  const [currentPage, setCurrentPage] = useState(1);
  const [slipData, setSlipData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getExcelFile = async () => {
    try {
      const response = await fn_getUploadExcelFileData(currentPage);
      if (response?.status) {
        setTotalPages(response?.data?.totalPages);
        setSlipData(response?.data?.data);
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
    getExcelFile();
  }, [currentPage]);

  const handleViewTransaction = (withraw) => {
    navigate("/payout-details", { state: { withraw } });
  };

  useEffect(() => {
    if (!authorization) navigate("/login");
  }, [authorization]);

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
        }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[25px] font-[500]">All Payout Files</h1>
        </div>
        <div className="bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                  <th className="p-4 text-nowrap">Payout ID</th>
                  <th className="p-4 text-nowrap">Excel File Name</th>
                  <th className="p-4 text-nowrap">Merchant Name</th>
                  <th className="p-4 text-nowrap">DATE</th>
                  <th className="p-4 text-nowrap">No Of Withdraw</th>
                  <th className="p-4 cursor-pointer text-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {slipData?.length > 0 ? (
                  slipData?.map((transaction, index) => (
                    <tr
                      key={transaction?._id}
                      className="text-gray-800 text-sm border-b"
                    >
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {transaction?.payoutId}
                      </td>
                      <td className="p-4">
                        <span className="text-[12px] font-[700] text-black whitespace-nowrap">
                          {transaction?.fileName}
                        </span>
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2] whitespace-nowrap">
                        {transaction?.merchantId?.merchantName}
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2] whitespace-nowrap ">
                        {moment.utc(transaction?.createdAt).format('DD MMM YYYY, hh:mm A')}
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2] whitespace-nowrap ">
                        {transaction?.noOfWithdraws}
                      </td>
                      <td className="p-4 flex space-x-2 transaction-view-model">
                        <button
                          className="bg-blue-100 text-blue-600 rounded-full px-2 py-2 mx-2"
                          title="View"
                          onClick={() => handleViewTransaction(transaction)}
                        >
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No Excel Sheet File Uploaded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col md:flex-row items-center p-4 justify-between space-y-4 md:space-y-0">
            <p className="text-[13px] font-[500] text-gray-500 text-center md:text-left"></p>
            <Pagination
              className="self-center md:self-auto"
              onChange={(e) => setCurrentPage(e)}
              defaultCurrent={1}
              total={totalPages * 10}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payout;
