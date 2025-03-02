import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Pagination, Modal, Input, notification } from "antd";

import { FiEye } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { GoCircleSlash } from "react-icons/go";
import BACKEND_URL, { fn_getAllWithdrawTransactions } from "../../api/api";

const Withdraw = ({ setSelectedPage, authorization, showSidebar }) => {

    const navigate = useNavigate();
    const [utr, setUtr] = useState("");
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const containerHeight = window.innerHeight - 120;
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        window.scroll(0, 0);
        if (!authorization) {
            navigate("/login");
            return;
        }
        fetchTransactions();
    }, [authorization, navigate, setSelectedPage]);

    const fetchTransactions = async () => {
        try {
            const response = await fn_getAllWithdrawTransactions();
            if (response.status) {
                console.log('Withdraw transactions:', response.data?.data);
                setTransactions(response.data?.data || []);
                console.log('Transaction structure:', JSON.stringify(response.data?.data[0], null, 2));
            } else {
                console.error(response.message);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setLoading(false);
        }
    };

    const handleViewTransaction = (transaction) => {
        setSelectedTransaction(transaction);
        setOpen(true);
    };

    const handleModalClose = () => {
        setOpen(false);
        setSelectedTransaction(null);
    };

    const handleTransactionAction = async (action, id) => {
        try {
            if (action == "Approved" && utr === "" && selectedTransaction?.withdrawBankId) return notification.error({
                message: "Error",
                description: "Enter UTR",
                placement: "topRight"
            })
            const token = Cookies.get("token");
            const formData = new FormData();
            formData.append("status", action);
            formData.append("utr", utr);
            if (image) formData.append("image", image);
            const response = await axios.put(`${BACKEND_URL}/withdraw/update/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            if (response.status === 200) {
                fetchTransactions();
                handleModalClose();
                return notification.success({
                    message: "Success",
                    description: "Transaction updated successfully",
                    placement: "topRight",
                });
            }
        } catch (error) {
            console.log('Error in handleTransactionAction:', error);
        }
    };

    return (
        <>
            <div
                style={{ minHeight: `${containerHeight}px` }}
                className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"}`}
            >
                <div className="p-7">
                    <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-4">
                        <h1 className="text-[25px] font-[500]">Withdraw Request</h1>
                        <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
                            Dashboard - Data Table
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex flex-col md:flex-row items-center justify-between pb-3">
                            <div>
                                <p className="text-black font-medium text-lg">
                                    List of withdraw Transaction
                                </p>
                            </div>
                        </div>
                        <div className="w-full border-t-[1px] border-[#DDDDDD80] hidden sm:block mb-4"></div>
                        <div className="overflow-x-auto">
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <table className="min-w-full border">
                                    <thead>
                                        <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                                            <th className="p-4 text-nowrap">S_No</th>
                                            <th className="p-4">DATE</th>
                                            <th className="p-4 text-nowrap">MERCHANT NAME</th>
                                            <th className="p-4 text-nowrap">EXCHANGE</th>
                                            <th className="p-4 text-nowrap">AMOUNT</th>
                                            <th className="pl-8">Status</th>
                                            <th className="pl-7">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions?.map((transaction, index) => (
                                            <tr key={transaction?._id} className="text-gray-800 text-sm border-b">
                                                <td className="p-4 text-[13px] font-[600] text-[#000000B2]">{index + 1}</td>
                                                <td className="p-4 text-[13px] font-[600] text-[#000000B2] whitespace-nowrap">
                                                    {new Date(transaction?.createdAt).toDateString()},{" "}
                                                    {new Date(transaction?.createdAt).toLocaleTimeString()}
                                                </td>
                                                <td className="p-4 text-[13px] font-[700] text-[#000000B2]">
                                                    {transaction?.merchantId?.merchantName || 'N/A'}
                                                </td>
                                                <td className="p-4 text-[13px] font-[700] text-[#000000B2]">
                                                    {transaction?.exchangeId?.currency || 'N/A'}
                                                </td>
                                                <td className="p-4 text-[13px] font-[700] text-[#000000B2]">
                                                    {transaction?.amount} {transaction?.exchangeId?._id === "67c1cb2ffd672c91b4a769b2" ? "INR" : transaction?.exchangeId?._id === "67c1e65de5d59894e5a19435" ? "INR" : transaction?.exchangeId?.currency}
                                                </td>
                                                <td className="p-4 text-[13px] font-[500]">
                                                    <span className={`px-2 py-1 rounded-[20px] text-nowrap text-[11px] font-[600] max-w-20 flex items-center justify-center ${transaction.status === "Decline" ? "bg-[#FF7A8F33] text-[#FF002A]" :
                                                        transaction?.status === "Pending" ? "bg-[#FFC70126] text-[#FFB800]" :
                                                            "bg-[#10CB0026] text-[#0DA000]"}`}>
                                                        {transaction?.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                                                        title="View"
                                                        onClick={() => handleViewTransaction(transaction)}
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
                        <div className="flex flex-col md:flex-row items-center p-4 justify-between space-y-4 md:space-y-0">
                            <p className="text-[13px] font-[500] text-gray-500 text-center md:text-left"></p>
                            <Pagination
                                className="self-center md:self-auto"
                                defaultCurrent={1}
                                total={transactions?.length}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Transaction Details"
                open={open}
                onOk={handleModalClose}
                onCancel={handleModalClose}
                width={500}
                style={{
                    fontFamily: "sans-serif"
                }}
                footer={null}
            >
                {selectedTransaction && (
                    <div className="flex flex-col md:flex-row">
                        <div className="flex flex-col gap-2 mt-3 w-full">
                            <p className="text-[12px] font-[500] text-gray-600 mt-[-18px]">Request Creation Time: <span className="font-[600]">{new Date(selectedTransaction?.createdAt).toDateString()}, {new Date(selectedTransaction?.createdAt).toLocaleTimeString()}</span></p>
                            {/* Merchant Name */}
                            <div className="flex items-center gap-4 mt-[10px]">
                                <p className="text-[12px] font-[600] w-[200px]">Merchant Name:</p>
                                <Input
                                    className="text-[12px] bg-gray-200"
                                    readOnly
                                    value={selectedTransaction?.merchantId?.merchantName || 'N/A'}
                                />
                            </div>

                            {/* Exchange */}
                            <div className="flex items-center gap-4">
                                <p className="text-[12px] font-[600] w-[200px]">Exchange:</p>
                                <Input
                                    className="text-[12px] bg-gray-200"
                                    readOnly
                                    value={selectedTransaction?.exchangeId?.currency || 'N/A'}
                                />
                            </div>

                            {/* Withdrawal Amount */}
                            <div className="flex items-center gap-4">
                                <p className="text-[12px] font-[600] w-[200px]">Withdrawal Amount:</p>
                                <Input
                                    className="text-[12px] bg-gray-200"
                                    readOnly
                                    value={`${selectedTransaction?.amount} ${selectedTransaction?.exchangeId?._id === "67c1cb2ffd672c91b4a769b2" ? "INR" : selectedTransaction?.exchangeId?._id === "67c1e65de5d59894e5a19435" ? "INR" : selectedTransaction?.exchangeId?.currency}`}
                                />
                            </div>

                            {/* Bank Details Section */}
                            {selectedTransaction?.withdrawBankId && (
                                <>
                                    <div className="border-t mt-2 mb-1"></div>
                                    <p className="font-[600] text-[14px] mb-2">Bank Details</p>

                                    <div className="flex items-center gap-4">
                                        <p className="text-[12px] font-[600] w-[200px]">Bank Name:</p>
                                        <Input
                                            className="text-[12px] bg-gray-200"
                                            readOnly
                                            value={selectedTransaction?.withdrawBankId?.bankName || 'N/A'}
                                        />
                                    </div>
                                    {selectedTransaction?.withdrawBankId?.bankName !== "UPI" && (
                                        <div className="flex items-center gap-4">
                                            <p className="text-[12px] font-[600] w-[200px]">Account Title:</p>
                                            <Input
                                                className="text-[12px] bg-gray-200"
                                                readOnly
                                                value={selectedTransaction?.withdrawBankId?.accountHolderName || 'N/A'}
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <p className="text-[12px] font-[600] w-[200px]">{selectedTransaction?.withdrawBankId?.bankName !== "UPI" ? "IFSC Code:" : "UPI ID:"}</p>
                                        <Input
                                            className="text-[12px] bg-gray-200"
                                            readOnly
                                            value={selectedTransaction?.withdrawBankId?.iban || 'N/A'}
                                        />
                                    </div>

                                    {selectedTransaction?.withdrawBankId?.bankName !== "UPI" && (
                                        <div className="flex items-center gap-4">
                                            <p className="text-[12px] font-[600] w-[200px]">Account Number:</p>
                                            <Input
                                                className="text-[12px] bg-gray-200"
                                                readOnly
                                                value={selectedTransaction?.withdrawBankId?.accountNo || 'N/A'}
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Note Section */}
                            <div className="border-t mt-2 mb-1"></div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[12px] font-[600]">Note From Merchant:</p>
                                <textarea
                                    className="w-full p-2 text-[12px] border rounded resize-none outline-none"
                                    rows={3}
                                    readOnly
                                    value={selectedTransaction?.note || 'N/A'} F
                                />
                            </div>

                            {/* Action Buttons */}
                            {selectedTransaction?.status === "Pending" && selectedTransaction?.withdrawBankId && (
                                <>
                                    <div className="border-t mt-2 mb-1"></div>
                                    <div className="flex items-center">
                                        <p className="w-[150px] text-gray-600 text-[12px] font-[600]">Upload Proof:</p>
                                        <input type="file" onChange={(e) => setImage(e.target.files?.[0])} />
                                    </div>
                                    <div className="flex items-center">
                                        <p className="min-w-[150px] text-gray-600 text-[12px] font-[600]">Enter UTR<span className="text-red-500">{" "}*</span>:</p>
                                        <Input className="text-[12px]" value={utr} onChange={(e) => setUtr(e.target.value)} />
                                    </div>

                                </>
                            )}
                            {selectedTransaction?.status === "Pending" && (
                                <div className="flex gap-4 mt-2">
                                    <button
                                        className="bg-[#03996933] flex text-[#039969] p-2 rounded hover:bg-[#03996950] text-[13px]"
                                        onClick={() => handleTransactionAction("Approved", selectedTransaction?._id)}
                                        disabled={selectedTransaction?.status === "Approved" || selectedTransaction?.status === "Decline"}
                                    >
                                        <IoMdCheckmark className="mt-[3px] mr-[6px]" />
                                        Approve Withdrawal
                                    </button>
                                    <button
                                        className="bg-[#FF405F33] flex text-[#FF3F5F] p-2 rounded hover:bg-[#FF405F50] text-[13px]"
                                        onClick={() => handleTransactionAction("Decline", selectedTransaction?._id)}
                                        disabled={selectedTransaction?.status === "Approved" || selectedTransaction?.status === "Decline"}
                                    >
                                        <GoCircleSlash className="mt-[3px] mr-[6px]" />
                                        Decline Withdrawal
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

        </>
    );
};

export default Withdraw;