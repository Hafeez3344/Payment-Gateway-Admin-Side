import { MagnifyingGlass } from "react-loader-spinner";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect } from "react";
import { Pagination, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";

const Payout = ({ authorization, showSidebar }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const containerHeight = window.innerHeight - 120;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [slipData, setSlipData] = useState([
    {
      _id: "1",
      excelName: "Sample1.xlsx",
      createdAt: new Date().toISOString(),
      data: [
        {
          date: "2025-03-06",
          utr: "1234567890",
          total: "1000",
          description: "Sample transaction 1",
        },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    setLoading(true);
    try {
      const fileInput = event.target;
      const file = fileInput.files[0];

      if (!file) {
        console.error("No file selected");
        setLoading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Simulate file upload and processing
        setTimeout(() => {
          setLoading(false);
          notification.success({
            message: "File uploaded successfully",
            description: "Your file has been uploaded and processed.",
            placement: "topRight",
          });
          setSlipData((prevData) => [
            ...prevData,
            {
              _id: (prevData.length + 1).toString(),
              excelName: file.name,
              createdAt: new Date().toISOString(),
              data: jsonData,
            },
          ]);
        }, 2000);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setLoading(false);
      console.error("Error during file upload:", error);
    }
  };

  const handleViewTransaction = (transaction) => {
    navigate("/payout-details", { state: { transaction } });
  };

  useEffect(() => {
    if (!authorization) navigate("/login");
  }, [authorization, currentPage]);

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
        {/* <div className="bg-white rounded-lg flex justify-center items-center h-40 p-4">
          <div className="flex flex-col items-center justify-center w-full">
            <p className="text-[18px] font-[600] text-center mb-3">
              Please Upload Your Excel Sheet Here
            </p>
            <div className="flex items-center mb-2 relative justify-center">
              <label
                htmlFor="file-upload"
                className="flex items-center bg-blue-500 text-white rounded py-2 px-4 cursor-pointer gap-2"
              >
                <FiUpload />
                Choose a file
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              {loading && (
                <div className="absolute right-[-60px]">
                  <MagnifyingGlass
                    visible={true}
                    height="50"
                    width="50"
                    ariaLabel="magnifying-glass-loading"
                    wrapperStyle={{}}
                    wrapperClass="magnifying-glass-wrapper"
                    glassColor="white"
                    color="gray"
                  />
                </div>
              )}
            </div>
            <span className="text-[11px] text-[#00000040]">Excel Files Only</span>
          </div>
        </div> */}
        {/* <div className="flex justify-between my-4">
          <p className="text-black font-medium text-lg">All Payout Files</p>
        </div> */}
        <div className="bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                  <th className="p-4">S_ID</th>
                  <th className="p-4">Excel File Name</th>
                  <th className="p-4">DATE</th>
                  <th className="p-4">No Of Withdraw</th>
                  <th className="p-4 cursor-pointer">Action</th>
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
                        {index + 1}
                      </td>
                      <td className="p-4">
                        <span className="text-[12px] font-[700] text-black whitespace-nowrap">
                          {transaction?.excelName}
                        </span>
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2] whitespace-nowrap ">
                        {new Date(transaction?.createdAt).toDateString()},
                        {new Date(transaction?.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2] whitespace-nowrap ">
                        {transaction?.data?.length || 0}
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