import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Pagination, Modal, notification } from "antd";
import { FiUpload } from "react-icons/fi";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { MagnifyingGlass } from "react-loader-spinner";

import {
  fn_compareTransactions,
  fn_getAllMerchantApi,
  PDF_READ_URL,
  fn_crateTransactionSlip,
  fn_showTransactionSlipData,
  fn_deleteTransactionSlipApi,
} from "../../api/api";

const UploadStatement = ({ setSelectedPage, authorization, showSidebar }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const containerHeight = window.innerHeight - 120;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [slipData, setSlipData] = useState([]);
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

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(PDF_READ_URL, formData);

      if (!response?.data?.data) {
        console.error("No transaction data returned from API");
        setLoading(false);
        return;
      }

      const transactions = response.data.data
        .map((item) => {
          console.log("item ", item);
          const getTransactionData = (item) => {
            const hasValidRef =
              item?.refNo || item?.reference_number || item?.reference_no;

            if (!hasValidRef && item?.description) {
              const patterns = [
                /UPI\/(\d+)\//,
                /IMPS-IN\/(\d+)\//,
                /[^\d](\d{16,})[^\d]/,
                /[^\d](\d{10,})[^\d]/,
                /(\d{14,}):/,
                /(\d{12}):Int\.Pd/,
                /(\d{9,}):Int\.Pd/,
                /(\d{9,}):[^\/\s]+/,
              ];

              if (item.description.includes("BY CASH")) {
                return {
                  date: item?.date || "",
                  utr: "",
                  description: item?.description || "",
                  total: item?.amount || item?.deposit || item?.credit || "",
                };
              }

              const exactMatch = item.description.match(/134001510478:Int\.Pd/);
              if (exactMatch) {
                return {
                  date: item?.date || "",
                  utr: "134001510478",
                  description: item?.description || "",
                  total: item?.amount || item?.deposit || item?.credit || "",
                };
              }

              for (const pattern of patterns) {
                const match = item.description.match(pattern);
                if (match && match[1]) {
                  return {
                    date: item?.date || "",
                    utr: match[1],
                    description: item?.description || "",
                    total: item?.amount || item?.deposit || item?.credit || "",
                  };
                }
              }
            }

            return {
              date: item?.date || "",
              utr: hasValidRef || "",
              description: item?.description || "",
              total: item?.amount || item?.deposit || item?.credit || "",
            };
          };
          if (item?.type === "CR") {
            return getTransactionData(item);
          } else if (item?.type === "DR") {
            return null;
          } else {
            if (
              item?.deposit !== "" &&
              item?.deposit !== undefined &&
              item?.deposit !== null
            ) {
              return getTransactionData(item);
            } else if (item?.deposit === "") {
              return null;
            } else {
              if (item?.credit !== "") {
                return getTransactionData(item);
              } else if (item?.credit === "") {
                return null;
              } else {
                return getTransactionData(item);
              }
            }
          }
        })
        ?.filter((data) => data !== null);

      const data = {
        pdfName: file.name,
        data: transactions,
        merchant: Cookies.get("merchantId"),
      };

      let localMatchedEntries = 0;

      const transactionPromises = transactions?.map(async (item) => {
        const comRes = await fn_compareTransactions(item);
        if (comRes?.status === true) {
          localMatchedEntries += 1;
        }
      });

      await Promise.all(transactionPromises);
      const response2 = await fn_crateTransactionSlip(data);

      if (!response2?.status) {
        setLoading(false);
        return notification.error({
          message: response2?.message,
          description: (
            <>
              Total Entries: {transactions?.length}
              <br />
              Matched Entries: {localMatchedEntries}
            </>
          ),
          placement: "topRight",
        });
      }

      fileInput.value = "";
      fetchTransactions(currentPage);
      setLoading(false);
      notification.success({
        message: "Transactions Updated",
        description: (
          <>
            Total Entries: {transactions?.length}
            <br />
            Matched Entries: {localMatchedEntries}
          </>
        ),
        placement: "topRight",
      });
      fetchSlipData();
    } catch (error) {
      setLoading(false);
      console.error("Error during file upload:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (pageNumber) => {
    try {
      const result = await fn_getAllMerchantApi(null, pageNumber);
      console.log("Fetched transactions:", result);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlipData = async () => {
    try {
      const result = await fn_showTransactionSlipData();
      if (result.status) {
        setSlipData(result.data || []);
      } else {
        console.error("Failed to fetch slip data:", result.message);
        setSlipData([]);
      }
    } catch (error) {
      console.error("Error fetching slip data:", error);
      setSlipData([]);
    }
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const fn_deleteTransaction = async (id) => {
    try {
      const response = await fn_deleteTransactionSlipApi(id);
      if (response?.status) {
        notification.success({
          message: "Success",
          description: "Transaction Deleted!",
          placement: "topRight",
        });
        fetchSlipData();
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  useEffect(() => {
    if (!authorization) navigate("/login");
    setSelectedPage("upload-statement");
    fetchSlipData();
    fetchTransactions(currentPage);
  }, [authorization, setSelectedPage, currentPage]);

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${
        showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
      }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[25px] font-[500]">Upload Statement</h1>
        </div>
        <div className="bg-white rounded-lg flex justify-center items-center h-40 p-4">
          <div className="flex flex-col items-center justify-center w-full">
            <p className="text-[18px] font-[600] text-center mb-3">
              Please Upload your Statement Here
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
                accept=".pdf"
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
            <span className="text-[11px] text-[#00000040]">PDF Files Only</span>
          </div>
        </div>
        <div className="flex justify-between my-4">
          <p className="text-black font-medium text-lg">All Statements</p>
        </div>
        <div className="bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                  <th className="p-4">S_ID</th>
                  <th className="p-4">PDF NAME</th>
                  <th className="p-4">DATE</th>
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
                          {transaction?.pdfName}
                        </span>
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2] whitespace-nowrap ">
                        {new Date(transaction?.createdAt).toDateString()},
                        {new Date(transaction?.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="p-4 flex space-x-2 transaction-view-model">
                        <button
                          className="bg-blue-100 text-blue-600 rounded-full px-2 py-2 mx-2"
                          title="View"
                          onClick={() => handleViewTransaction(transaction)}
                        >
                          <FiEye />
                        </button>
                        <Modal
                          centered
                          footer={null}
                          width={900}
                          style={{ fontFamily: "sans-serif", padding: "10px" }}
                          title={
                            <p className="text-[20px] font-[600] text-center font-sans">
                              {selectedTransaction?.pdfName} | {""}
                              {new Date(
                                selectedTransaction?.createdAt
                              ).toDateString()}
                            </p>
                          }
                          open={open}
                          onCancel={() => {
                            setOpen(false);
                          }}
                          onClose={() => {
                            setOpen(false);
                          }}
                        >
                          <div
                            style={{ maxHeight: "400px", overflowY: "auto" }}
                          >
                            {/* Slip File Upload Table  */}
                            <table className="min-w-full border">
                              <thead>
                                <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                                  <th className="p-4">S_ID</th>
                                  <th className="p-4">Date</th>
                                  <th className="p-4">UTR</th>
                                  <th className="p-4">Deposit</th>
                                  <th className="p-4">Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedTransaction?.data?.map(
                                  (transaction, index) => (
                                    <tr
                                      key={index}
                                      className="text-gray-800 text-sm border-b"
                                    >
                                      <td className="p-4 text-[12px] font-[600] text-[#000000B2]">
                                        {index + 1}
                                      </td>
                                      <td className="p-4 text-[12px] font-[600] text-[#000000B2]">
                                        {transaction?.date}
                                      </td>
                                      <td className="p-4 text-[12px] font-[600] text-[#000000B2]">
                                        {transaction?.utr}
                                      </td>
                                      <td className="p-4 text-[12px] font-[700] text-[#000000B2]">
                                        {transaction?.total}
                                      </td>
                                      <td className="p-4 text-[12px] font-[600] text-[#000000B2]" title={transaction?.description}>
                                        {transaction?.description?.substring(0, 60)}{transaction?.description?.length > 60 && "..."}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                          <span className="text-[15px] font-[600] mt-8 block font-sans">
                            Upload Time: {""}
                            <span className="text-[13px] font-[600] text-gray-600">
                              {new Date(transaction?.createdAt).toDateString()}
                            </span>
                            , {""}
                            <span className="text-[13px] font-[600] text-gray-600">
                              {new Date(
                                transaction?.createdAt
                              ).toLocaleTimeString()}
                            </span>
                          </span>
                        </Modal>

                        <button
                          className="bg-red-100 text-red-600 rounded-full px-2 py-2 mx-2"
                          title="Delete"
                          onClick={() => fn_deleteTransaction(transaction?._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No Transaction Slip Uploaded
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

export default UploadStatement;
