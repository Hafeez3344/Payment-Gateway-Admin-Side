import React, { useState, useEffect } from "react";
import { notification, Pagination, Modal, Input } from "antd";
import { useLocation } from "react-router-dom";
import { FiEye, FiUpload } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { GoCircleSlash } from "react-icons/go";
import axios from "axios";
import Cookies from "js-cookie";
import { fn_getExcelFileWithdrawData, fn_updatePayoutStatus } from "../../api/api";

const PayoutDetails = ({ showSidebar }) => {
  const location = useLocation();
  const { withraw } = location.state;
  const containerHeight = window.innerHeight - 120;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [slipData, setSlipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [utr, setUtr] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedWithdrawData, setSelectedWithdrawData] = useState(null);

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
      case "Cancel":
        return "bg-[#FF7A8F33] text-[#FF002A]";
      default:
        return "bg-[#10CB0026] text-[#0DA000]";
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Call the upload file API
      const uploadResponse = await fn_uploadFile(file);
      if (uploadResponse.status) {
        notification.success({
          message: "Success",
          description: uploadResponse.message,
          placement: "topRight",
        });
      } else {
        notification.error({
          message: "Upload Failed",
          description: uploadResponse.message,
          placement: "topRight",
        });
      }
    }
  };

  const getExcelFileData = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedWithdrawData(item);
    setImage(null);
    setImagePreview(null);
    setUtr("");
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setImage(null);
    setImagePreview(null);
    setUtr("");
    setSelectedWithdrawData(null);
  };

  const handlePayoutAction = async (action, id) => {
    try {
      const response = await fn_updatePayoutStatus(id, { status: action });
      if (response.status) {
        notification.success({
          message: "Success",
          description: `Payout has been ${action === "Approved" ? "approved" : "declined"}.`,
          placement: "topRight",
        });
        getExcelFileData();
        handleModalClose();
      } else {
        notification.error({
          message: "Error",
          description: response.message,
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An error occurred while updating the payout status.",
        placement: "topRight",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (withraw?._id) {
      getExcelFileData();
    }
  }, [withraw?._id, currentPage]);

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${
        showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
      }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-4">
          <h1 className="text-[25px] font-[500]">Payouts Details</h1>
          <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
            Dashboard - Payout Details
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex flex-col md:flex-row items-center justify-between pb-3">
            <div>
              <p className="text-black font-medium text-lg">
                List of Payout Transactions
              </p>
            </div>
          </div>

          <div className="w-full border-t-[1px] border-[#DDDDDD80] hidden sm:block mb-4"></div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center p-4">Loading...</div>
            ) : (
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
                      <td className="p-4 text-[12px] font-[700] text-[#000000B2]">
                        ₹ {item?.amount}
                      </td>
                      <td className="p-4 text-[12px] font-[600] text-[#000000B2] text-nowrap">
                        {item?.account}
                      </td>
                      <td className="p-4 text-[13px] font-[500]">
                        <span
                          className={`px-2 py-1 rounded-[20px] text-nowrap text-[11px] font-[600] max-w-20 flex items-center justify-center ${getStatusClass(
                            item?.status
                          )}`}
                        >
                          {item?.status === "Cancel"
                            ? "Cancelled"
                            : item?.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                          title="View"
                          onClick={() => handleViewDetails(item)}
                        >
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
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

      {/* Modal */}
      <Modal
        title="Payout Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        width={selectedWithdrawData?.status === "Pending" ? 600 : 900}
        style={{ fontFamily: "sans-serif" }}
        footer={null}
      >
        {selectedWithdrawData && (
          <div className="flex justify-between gap-4">
            {/* Left Column */}
            <div
              className={`${
                selectedWithdrawData.status === "Pending"
                  ? "w-full"
                  : "w-[450px]"
              }`}
            >
              <div className="flex flex-col gap-2 mt-3">
                {/* Transaction Time */}
                <p className="text-[12px] font-[500] text-gray-600 mt-[-18px]">
                  Transaction Time:{" "}
                  <span className="font-[600]">
                    {new Date(selectedWithdrawData?.createdAt).toDateString()},{" "}
                    {new Date(
                      selectedWithdrawData?.createdAt
                    ).toLocaleTimeString()}
                  </span>
                </p>

                {/* Username */}
                <div className="flex items-center gap-4 mt-[10px]">
                  <p className="text-[12px] font-[600] w-[200px]">Username:</p>
                  <Input
                    className="text-[12px] bg-gray-200"
                    readOnly
                    value={selectedWithdrawData?.username || "N/A"}
                  />
                </div>

                {/* Amount */}
                <div className="flex items-center gap-4">
                  <p className="text-[12px] font-[600] w-[200px]">Amount:</p>
                  <Input
                    className="text-[12px] bg-gray-200"
                    readOnly
                    value={`₹ ${selectedWithdrawData?.amount}` || "N/A"}
                  />
                </div>

                {/* Account Details */}
                <div className="border-t mt-2 mb-1"></div>
                <p className="font-[600] text-[14px] mb-2">Account Details</p>

                <div className="flex items-center gap-4">
                  <p className="text-[12px] font-[600] w-[200px]">
                    Account Info:
                  </p>
                  <Input
                    className="text-[12px] bg-gray-200"
                    readOnly
                    value={selectedWithdrawData?.account || "N/A"}
                  />
                </div>

                {/* Status Section */}
                <div className="border-t mt-2 mb-1"></div>
                <div className="flex items-center gap-4">
                  <p className="text-[12px] font-[600] w-[200px]">Status:</p>
                  <div
                    className={`px-3 py-2 rounded-[20px] text-[13px] font-[600] ${getStatusClass(
                      selectedWithdrawData?.status
                    )}`}
                  >
                    {selectedWithdrawData?.status}
                  </div>
                </div>

                {/* Action Section for Pending Status */}
                {selectedWithdrawData?.status === "Pending" && (
                  <>
                    <div className="border-t mt-2 mb-1"></div>

                    {/* UTR Input */}
                    <div className="flex items-center mb-3">
                      <p className="min-w-[150px] text-gray-600 text-[12px] font-[600]">
                        Enter UTR<span className="text-red-500"> *</span>:
                      </p>
                      <Input
                        className="text-[12px]"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                      />
                    </div>

                    {/* Upload Section */}
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-600 text-[12px] font-[600]">
                        Upload Proof:
                      </p>
                      <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="mb-2"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <p className="text-gray-600 text-[12px] font-[600] mb-1">
                            Preview:
                          </p>
                          <img
                            src={imagePreview}
                            alt="Upload Preview"
                            className="max-w-[300px] h-auto rounded-lg border"
                          />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-4">
                      <button
                        className="flex-1 bg-[#03996933] flex items-center justify-center text-[#039969] p-2 rounded hover:bg-[#03996950] text-[13px]"
                        onClick={() => handlePayoutAction("Approved", selectedWithdrawData?._id)}
                      >
                        <IoMdCheckmark className="mt-[3px] mr-[6px]" />
                        Approve Payout
                      </button>
                      <button
                        className="w-24 bg-[#FF405F33] flex items-center justify-center text-[#FF3F5F] p-2 rounded hover:bg-[#FF405F50] text-[13px]"
                        onClick={() => handlePayoutAction("Declined", selectedWithdrawData?._id)}
                      >
                        <GoCircleSlash className="mt-[3px] mr-[6px]" />
                        Decline
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Only show for non-pending status */}
            {selectedWithdrawData.status !== "Pending" && (
              <div className="w-[350px] border-l pl-4">
                <div className="flex flex-col gap-4">
                  {/* Payment Proof */}
                  {selectedWithdrawData.paymentProof && (
                    <div>
                      <p className="text-[14px] font-[600] mb-2">
                        Payment Proof
                      </p>
                      <div className="max-h-[400px] overflow-auto">
                        <img
                          src={selectedWithdrawData.paymentProof}
                          alt="Payment Proof"
                          className="w-full object-contain cursor-pointer"
                          onClick={() =>
                            window.open(
                              selectedWithdrawData.paymentProof,
                              "_blank"
                            )
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* UTR Number */}
                  {selectedWithdrawData.utr && (
                    <div>
                      <p className="text-[14px] font-[600] mb-2">UTR Number</p>
                      <Input
                        className="text-[12px] bg-gray-100"
                        readOnly
                        value={selectedWithdrawData.utr}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PayoutDetails;
