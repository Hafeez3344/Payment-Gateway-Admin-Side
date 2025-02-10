import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Pagination, Modal, Input, notification, DatePicker, Space } from "antd";

import { FaRegEdit } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { GoCircleSlash } from "react-icons/go";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { RiFindReplaceLine } from "react-icons/ri";
import { FaIndianRupeeSign } from "react-icons/fa6";

import BACKEND_URL, { fn_deleteTransactionApi, fn_getAllTransactionApi, fn_updateTransactionStatusApi } from "../../api/api";

const TransactionsTable = ({ authorization, showSidebar, permissionsData, loginType }) => {

  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const { RangePicker } = DatePicker;
  const [open, setOpen] = useState(false);
  const status = searchParams.get("status");
  const [isEdit, setIsEdit] = useState(false);
  const [merchant, setMerchant] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const containerHeight = window.innerHeight - 120;
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [declineButtonClicked, setDeclinedButtonClicked] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchTransactions = async (pageNumber) => {
    try {
      const result = await fn_getAllTransactionApi(status || null, pageNumber);
      if (result?.status) {
        if (result?.data?.status === "ok") {
          setTransactions(result?.data?.data);
          setTotalPages(result?.data?.totalPages);
        } else {
          setTransactions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTransactions([]);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
    if (!authorization) {
      navigate("/login");
      return;
    };
    fetchTransactions(currentPage);
  }, [currentPage]);

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction?.createdAt);

    const adjustedEndDate = dateRange[1] ? new Date(dateRange[1]) : null;
    if (adjustedEndDate) {
      adjustedEndDate.setHours(23, 59, 59, 999);
    }

    const isWithinDateRange =
      (!dateRange[0] || transactionDate >= dateRange[0]) &&
      (!adjustedEndDate || transactionDate <= adjustedEndDate);

    return (
      transaction?.utr?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (merchant === "" || transaction?.merchantName === merchant) &&
      isWithinDateRange
    );
  });

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const handleTransactionAction = async (action, transactionId) => {
    const response = await fn_updateTransactionStatusApi(transactionId, {
      status: action,
    });
    if (response.status) {
      fetchTransactions(currentPage);
      notification.success({
        message: "Success",
        description: "Transaction Updated!",
        placement: "topRight",
      });
      setIsEdit(false);
      setOpen(false);
    } else {
      setIsEdit(false);
      console.error(`Failed to ${action} transaction:`, response.message);
    }
  };

  const handleEditTransactionAction = async (status, id, amount, utr) => {
    const response = await fn_updateTransactionStatusApi(id, {
      status: status,
      total: parseInt(amount),
      utr: utr,
    });
    if (response.status) {
      fetchTransactions(currentPage);
      notification.success({
        message: "Success",
        description: "Transaction Updated!",
        placement: "topRight",
      });
      setOpen(false);
      setIsEdit(false);
    } else {
      setIsEdit(false);
      console.error(`Failed to ${action} transaction:`, response.message);
    }
  };

  const fn_declineButtonClicked = () => {
    setDeclinedButtonClicked(!declineButtonClicked);
  }

  return (
    <>
      <div
        style={{ minHeight: `${containerHeight}px` }}
        className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"}`}
      >
        <div className="p-7">
          <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
            <h1 className="text-[25px] font-[500]">All Transaction</h1>
            <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
              Dashboard - Data Table
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex flex-col md:flex-row items-center justify-between pb-3">
              <div>
                <p className="text-black font-medium text-lg">
                  List of all Transactions
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                <Space direction="vertical" size={10}>
                  <RangePicker
                    value={dateRange}
                    onChange={(dates) => {
                      setDateRange(dates);
                    }}
                  />
                </Space>
                {/* Search Input */}
                <div className="flex flex-col w-full md:w-40">
                  <input
                    type="text"
                    placeholder="Search by UTR"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border w-full border-gray-300 rounded py-1.5 text-[12px] pl-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>
            <div className="w-full border-t-[1px] border-[#DDDDDD80] hidden sm:block mb-4"></div>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                    <th className="p-4 text-nowrap">TRN-ID</th>
                    <th className="p-4">DATE</th>
                    <th className="p-4 text-nowrap">User Name</th>
                    <th className="p-4 text-nowrap">BANK NAME</th>
                    <th className="p-4 text-nowrap">TOTAL AMOUNT</th>
                    <th className="p-4 ">UTR#</th>
                    <th className="pl-8">Status</th>
                    <th className="pl-7 cursor-pointer">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction?._id}
                        className="text-gray-800 text-sm border-b"
                      >
                        <td className="p-4 text-[13px] font-[600] text-[#000000B2]">{transaction?.trnNo}</td>
                        <td className="p-4 text-[13px] font-[600] text-[#000000B2] whitespace-nowrap">
                          {new Date(transaction?.createdAt).toDateString()},{" "}
                          {new Date(transaction?.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="p-4 text-[13px] font-[700] text-[#000000B2]">{transaction?.username && transaction?.username !== "" ? transaction?.username : "GUEST"}</td>
                        <td className="p-4">
                          {transaction?.bankId?.bankName ? (
                            <div className="">
                              <span className="text-[13px] font-[700] text-black whitespace-nowrap">
                                {transaction?.bankId?.bankName}
                              </span>
                            </div>
                          ) : (
                            <div className="">
                              <p className="text-[14px] font-[700] text-black ">
                                UPI
                              </p>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-[13px] font-[700] text-[#000000B2]">
                          <FaIndianRupeeSign className="inline-block mt-[-1px]" />{" "}
                          {transaction?.total}
                        </td>
                        <td className="p-4 text-[12px] font-[700] text-[#0864E8]">{transaction?.utr}</td>
                        <td className="p-4 text-[13px] font-[500]">
                          <span
                            className={`px-2 py-1 rounded-[20px] text-nowrap text-[11px] font-[600] min-w-20 flex items-center justify-center ${transaction?.status === "Verified"
                              ? "bg-[#10CB0026] text-[#0DA000]"
                              : transaction?.status === "Unverified"
                                ? "bg-[#FFC70126] text-[#FFB800]"
                                : transaction?.status === "Manual Verified"
                                  ? "bg-[#0865e851] text-[#0864E8]"
                                  : "bg-[#FF7A8F33] text-[#FF002A]"
                              }`}
                          >
                            {transaction?.status?.charAt(0).toUpperCase() +
                              transaction?.status?.slice(1)}
                          </span>
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
                        No Transactions found.
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
      <Modal
        centered
        footer={null}
        width={900}
        style={{ fontFamily: "sans-serif", padding: "20px" }}
        title={
          <p className="text-[20px] font-[700]">
            Transaction Details
          </p>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setIsEdit(false);
        }}
        onClose={() => {
          setOpen(false);
          setIsEdit(false);
        }}
      >
        {selectedTransaction && (
          <div className="flex flex-col md:flex-row">
            {/* Left side input fields */}
            <div className="flex flex-col gap-2 mt-3 w-full md:w-1/2">
              <p className="font-[500] mt-[-20px] mb-[15px]">Transaction Id: <span className="text-gray-500 font-[700]">30</span></p>
              {[
                {
                  label: "Amount:",
                  value: selectedTransaction?.total,
                },
                {
                  label: "UTR#:",
                  value: selectedTransaction?.utr,
                },
                {
                  label: "Date & Time:",
                  value: `${new Date(
                    selectedTransaction.createdAt
                  ).toLocaleString()}`,
                },
                {
                  label: "Bank Name:",
                  value:
                    selectedTransaction.bankId?.bankName ||
                    "UPI",
                },
                // {
                //   label: "Description:",
                //   value:
                //     selectedTransaction.description || "",
                //   isTextarea: true,
                // },
              ].map((field, index) => (
                <div
                  className="flex items-center gap-4"
                  key={index}
                >
                  <p className="text-[12px] font-[600] w-[150px]">
                    {field.label}
                  </p>
                  {field.isTextarea ? (
                    <textarea
                      className="w-[50%] text-[11px] border rounded p-1 resize-none outline-none input-placeholder-black overflow-hidden"
                      value={field.value}
                      rows={3}
                      readOnly
                      style={{
                        overflow: "auto",
                        resize: "none",
                      }}
                    />
                  ) : (
                    <Input
                      prefix={
                        field.label === "Amount:" ? (
                          <FaIndianRupeeSign className="mt-[2px]" />
                        ) : null
                      }
                      className={`w-[50%] text-[12px] input-placeholder-black ${isEdit &&
                        (field.label === "Amount:" ||
                          field?.label === "UTR#:")
                        ? "bg-white"
                        : "bg-gray-200"
                        }`}
                      readOnly={
                        isEdit &&
                          (field.label === "Amount:" ||
                            field?.label === "UTR#:")
                          ? false
                          : true
                      }
                      value={field?.value}
                      onChange={(e) => {
                        if (field?.label === "Amount:") {
                          setSelectedTransaction((prev) => ({
                            ...prev,
                            total: e.target.value,
                          }));
                        } else {
                          setSelectedTransaction((prev) => ({
                            ...prev,
                            utr: e.target.value,
                          }));
                        }
                      }}
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-[#03996933] flex text-[#039969] p-2 rounded hover:bg-[#03996950] text-[13px]"
                  onClick={() =>
                    handleTransactionAction(
                      "Verified",
                      selectedTransaction?._id
                    )
                  }
                  disabled={selectedTransaction?.status === "Verified"}
                >
                  <IoMdCheckmark className="mt-[3px] mr-[6px]" />
                  Approve Transaction
                </button>
                <button
                  className={`flex p-2 rounded text-[13px] ${declineButtonClicked ? "bg-[#140e0f33] text-black" : "bg-[#FF405F33] hover:bg-[#FF405F50] text-[#FF3F5F]"}`}
                  onClick={() => handleTransactionAction("Decline", selectedTransaction?._id)}
                  disabled={selectedTransaction?.status === "Verified"}
                  // onClick={fn_declineButtonClicked}
                >
                  <GoCircleSlash className="mt-[3px] mr-[6px]" />
                  Decline TR
                </button>
                <button
                  className="bg-[#F6790233] flex text-[#F67A03] ml-[20px] p-2 rounded hover:bg-[#F6790250] text-[13px]"
                  disabled={selectedTransaction?.status === "Verified"}
                  onClick={() => {
                    if (!isEdit) {
                      setIsEdit(true);
                    } else {
                      handleEditTransactionAction(
                        "Manual Verified",
                        selectedTransaction._id,
                        selectedTransaction?.total,
                        selectedTransaction?.utr
                      );
                    }
                  }}
                >
                  {!isEdit ? (
                    <>
                      <FaRegEdit className="mt-[2px] mr-2" />{" "}
                      Edit TR
                    </>
                  ) : (
                    <>
                      <FaRegEdit className="mt-[2px] mr-2" />{" "}
                      Update TR
                    </>
                  )}
                </button>
              </div>

              {/* Bottom Divider and Activity */}
              <div className="border-b w-[370px] mt-4"></div>
              {declineButtonClicked && (
                <>
                  <p className="text-[14px] font-[700]">
                    Enter Reason for Decline
                  </p>
                  <textarea
                    className="w-[91%] border h-[150px] focus:outline-gray-200 rounded-[5px] px-[10px] py-[7px] text-[13px]"
                    placeholder="Enter Reason for Declined the Transaction"
                  />
                  <div className="flex gap-[10px]">
                    <button className="bg-[#FF405F33] flex text-[#FF3F5F] py-2 px-[20px] rounded hover:bg-[#FF405F50] text-[13px] w-[max-content]">Submit</button>
                    <button className="bg-gray-200 flex text-black py-2 px-[20px] rounded text-[13px] w-[max-content]" onClick={() => setDeclinedButtonClicked(!declineButtonClicked)}>Cancel</button>
                  </div>
                </>
              )}
            </div>
            {/* Right side with border and image */}
            <div className="w-full md:w-1/2 md:border-l my-10 md:mt-0 pl-0 md:pl-6 flex flex-col justify-between items-center h-full">
              <img
                src={`${BACKEND_URL}/${selectedTransaction?.image}`}
                alt="Payment Proof"
                className="max-h-[400px]"
              />

              <div className="flex">
                <button
                  className="mt-12 border flex border-black px-1 py-1 rounded"
                  onClick={() => {
                    const input =
                      document.createElement("input");
                    input.type = "file";
                    input.click();
                  }}
                >
                  <RiFindReplaceLine className="mt-[5px] mr-2 text-[#699BF7]" />
                  <p>Replace Payment Proof</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TransactionsTable;
