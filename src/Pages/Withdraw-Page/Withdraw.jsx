import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment/moment";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Pagination, Modal, Input, notification, Select, Button } from "antd";


import { FiEye } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { GoCircleSlash } from "react-icons/go";
import { FaIndianRupeeSign } from "react-icons/fa6";

import BACKEND_URL, { fn_getAllWithdrawTransactions, fn_getMerchantApi, fn_getBankByAccountTypeApi } from "../../api/api";

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const cleanPath = imagePath.replace('uploads/', '');
    return `${BACKEND_URL}/uploads/${cleanPath}`;
};

const Withdraw = ({ setSelectedPage, authorization, showSidebar }) => {

    const navigate = useNavigate();
    const [utr, setUtr] = useState("");
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const containerHeight = window.innerHeight - 120;
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const [note, setNote] = useState("");
    const [banks, setBanks] = useState([]);
    const [merchants, setMerchants] = useState([]);
    const [exchanges, setExchanges] = useState([]);
    const [exchange, setExchange] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [exchangeData, setExchangeData] = useState({});
    const [selectedBank, setSelectedBank] = useState(null);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [merchantWallet, setMerchantWallet] = useState(null);
    const [selectedMerchant, setSelectedMerchant] = useState(null);
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

    useEffect(() => {
        window.scroll(0, 0);
        if (!authorization) {
            navigate("/login");
            return;
        }
        fetchTransactions();
        fn_getExchanges();
        fetchMerchants();
    }, [authorization, navigate, setSelectedPage, currentPage]);

    const fetchTransactions = async () => {
        try {
            const response = await fn_getAllWithdrawTransactions(currentPage);
            if (response.status) {
                console.log('Withdraw transactions:', response.data?.data);
                setTransactions(response.data?.data || []);
                console.log('Transaction structure:', JSON.stringify(response.data?.data[0], null, 2));
                setTotalPages(response?.data?.totalPage);
            } else {
                console.error(response.message);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setLoading(false);
        }
    };

    const fn_getExchanges = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/exchange/get`)
            if (response?.status === 200) {
                setExchanges(response?.data?.data?.map((item) => ({
                    value: item?._id,
                    label: item?.currency,
                    rate: item?.currencyRate,
                    charges: item?.charges
                })));
            }
        } catch (error) {
            console.log("error while fetching exchange ", error);
        }
    };

    useEffect(() => {
        if (exchange) {
            const selectedExchange = exchanges.find(e => e.value === exchange);
            setExchangeData(selectedExchange || {});
        }
    }, [exchange, exchanges]);

    const fetchMerchants = async () => {
        try {
            const response = await fn_getMerchantApi();
            if (response.status) {
                const merchantOptions = response.data?.data?.map(merchant => ({
                    value: merchant._id,
                    label: merchant.merchantName
                }));
                setMerchants(merchantOptions);
            }
        } catch (error) {
            console.error("Error fetching merchants:", error);
        }
    };

    const fn_getMerchantBanks = async () => {
        const response = await fn_getBankByAccountTypeApi(selectedMerchant);
        if (response?.status) {
            setBanks(response?.data?.data?.map((item) => {
                return {
                    value: item?._id,
                    label: `${item?.accountType === "upi" ? `UPI - ${item?.iban}` : `${item?.bankName} - ${item?.accountNo}`}`
                }
            }));
        }
    };

    const handleWithdrawRequest = () => {
        setWithdrawModalOpen(true);
    };

    const resetForm = () => {
        setNote("");
        setExchange(null);
        setExchangeData({});
        setSelectedBank(null);
        setWithdrawAmount('');
        setSelectedMerchant(null);
    };

    const handleWithdrawSubmit = async () => {
        if (!selectedMerchant) {
            return notification.error({
                message: "Error",
                description: "Please select a merchant",
                placement: "topRight",
            });
        }

        if (!withdrawAmount || !exchange) {
            return notification.error({
                message: "Error",
                description: "Please fill all required fields",
                placement: "topRight",
            });
        }

        if (exchange === "67c1e65de5d59894e5a19435" && !selectedBank) {
            return notification.error({
                message: "Error",
                description: "Please Select Bank",
                placement: "topRight",
            });
        }

        const data = {
            amount: ((parseFloat(withdrawAmount) - (parseFloat(exchangeData?.charges) * parseFloat(withdrawAmount)) / 100) / parseFloat(exchangeData?.rate)).toFixed(2),
            withdrawBankId: exchange === "67c1e65de5d59894e5a19435" ? selectedBank : null,
            note: note,
            exchangeId: exchange,
            amountINR: withdrawAmount,
            merchantId: selectedMerchant,
            createdBy: "admin"
        };

        try {
            const token = Cookies.get("token");
            const response = await axios.post(`${BACKEND_URL}/withdraw/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            if (response?.status === 200) {
                fetchTransactions();
                setWithdrawModalOpen(false);
                resetForm();
                notification.success({
                    message: "Success",
                    description: "Withdraw Request Created!",
                    placement: "topRight",
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: error?.response?.data?.message || "Network Error",
                placement: "topRight",
            });
        }
    };

    const handleViewTransaction = (transaction) => {
        setUtr("");
        setImage(null);
        setSelectedTransaction(transaction);
        setOpen(true);
    };

    const handleModalClose = () => {
        setUtr("");
        setImage(null);
        setImagePreview(null);
        setOpen(false);
    };

    const handleTransactionAction = async (action, id) => {
        try {
            const isBankOrUPI = selectedTransaction?.exchangeId?._id === "67c1e65de5d59894e5a19435";
            if (action === "Approved" &&
                selectedTransaction?.withdrawBankId &&
                isBankOrUPI &&
                utr === "") {
                return notification.error({
                    message: "Error",
                    description: "Enter UTR",
                    placement: "topRight"
                });
            }

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

    const handleExchangeChange = (value) => {
        setExchange(value);
        if (value === "67c1e65de5d59894e5a19435") {
            fn_getMerchantBanks();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const fn_merchantWallet = async () => {
        try {
            const token = Cookies.get("token");
            const response = await axios.get(`${BACKEND_URL}/ledger/withdrawData?merchantId=${selectedMerchant}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.status === 200) {
                setMerchantWallet(response?.data);
            }
        } catch (error) {
            console.log(`error while getting wallet `, error);
        }
    }

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    useEffect(() => {
        if (selectedMerchant) {
            fn_getMerchantBanks();
            fn_merchantWallet();
        }
    }, [selectedMerchant]);

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
                            {/* Add back the withdraw button */}
                            <Button type="primary" onClick={handleWithdrawRequest}>
                                Create Withdraw
                            </Button>
                        </div>
                        <div className="w-full border-t-[1px] border-[#DDDDDD80] hidden sm:block mb-4"></div>
                        <div className="overflow-x-auto">
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="text-center p-4">Loading...</td>
                                </tr>

                            ) : (
                                <table className="min-w-full border">
                                    <thead>
                                        <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                                            <th className="p-4 text-nowrap">S_No</th>
                                            <th className="p-4">DATE</th>
                                            <th className="p-4 text-nowrap">MERCHANT NAME</th>
                                            <th className="p-4 text-nowrap">EXCHANGE</th>
                                            <th className="p-4 text-nowrap">AMOUNT</th>
                                            <th className="p-4 text-nowrap">Withdraw AMOUNT</th>
                                            <th className="pl-8">Status</th>
                                            <th className="pl-7">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions?.map((transaction, index) => (
                                            <tr key={transaction?._id} className="text-gray-800 text-sm border-b">
                                                <td className="p-4 text-[13px] font-[600] text-[#000000B2]">{index + 1}</td>
                                                <td className="p-4 text-[13px] font-[600] text-[#000000B2] whitespace-nowrap">
                                                    {moment.utc(transaction?.createdAt).format('DD MMM YYYY, hh:mm A')}
                                                </td>
                                                <td className="p-4 text-[13px] font-[700] text-[#000000B2]">
                                                    {transaction?.merchantId?.merchantName || 'N/A'}
                                                </td>
                                                <td className="p-4 text-[13px] font-[700] text-[#000000B2]">
                                                    {transaction?.exchangeId?.currency || 'N/A'}
                                                </td>
                                                <td className="p-4 text-[13px] font-[700] text-[#000000B2]">
                                                    {transaction?.amountINR} {transaction?.exchangeId?._id === "67c1cb2ffd672c91b4a769b2" ? "INR" : transaction?.exchangeId?._id === "67c1e65de5d59894e5a19435" ? "INR" : transaction?.exchangeId?.currency}
                                                </td>
                                                <td className="p-4 text-[13px] font-[700] text-[#000000B2]">
                                                    {transaction?.amount} {transaction?.exchangeId?._id === "67c1cb2ffd672c91b4a769b2" ? "INR" : transaction?.exchangeId?._id === "67c1e65de5d59894e5a19435" ? "INR" : transaction?.exchangeId?.currency}
                                                </td>
                                                <td className="relative p-4 text-[13px] font-[500]">
                                                    <span className={`px-2 py-1 rounded-[20px] text-nowrap text-[11px] font-[600] max-w-20 flex items-center justify-center ${transaction.status === "Decline" ? "bg-[#FF7A8F33] text-[#FF002A]" :
                                                        transaction?.status === "Pending" ? "bg-[#FFC70126] text-[#FFB800]" :
                                                            "bg-[#10CB0026] text-[#0DA000]"}`}>
                                                        {transaction?.status}
                                                    </span>
                                                    {transaction?.createdBy === "admin" && (
                                                        <p className="absolute bottom-[-2px] left-[20px] text-[10px] text-gray-600">Created by Admin</p>
                                                    )}
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
                                onChange={(e) => setCurrentPage(e)}
                                defaultCurrent={1}
                                total={totalPages * 10}
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
                width={selectedTransaction?.status === "Pending" ||
                    selectedTransaction?.status === "Decline" ||
                    (selectedTransaction?.status === "Approved" && !selectedTransaction?.utr) ? 600 : 900}
                style={{
                    fontFamily: "sans-serif"
                }}
                footer={null}
            >
                {selectedTransaction && (
                    <div className="flex justify-between gap-4">
                        {/* Left Column - Existing Details */}
                        <div className={`${(selectedTransaction.status === "Pending" ||
                            (selectedTransaction.status === "Approved" && !selectedTransaction.utr)) ? "w-full" : "w-[450px]"}`}>
                            <div className="flex flex-col gap-2 mt-3">
                                <p className="text-[12px] font-[500] text-gray-600 mt-[-18px]">Request Creation Time: <span className="font-[600]">{moment.utc(selectedTransaction?.createdAt).format('DD MMM YYYY, hh:mm A')}</span></p>
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

                                        {/* Show UTR only if not By Cash */}
                                        {selectedTransaction?.exchangeId?._id === "67c1e65de5d59894e5a19435" && (
                                            <div className="flex items-center mb-3">
                                                <p className="min-w-[150px] text-gray-600 text-[12px] font-[600]">
                                                    Enter UTR<span className="text-red-500">{" "}*</span>:
                                                </p>
                                                <Input
                                                    className="text-[12px]"
                                                    value={utr}
                                                    onChange={(e) => setUtr(e.target.value)}
                                                />
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-2">
                                            <p className="text-gray-600 text-[12px] font-[600]">Upload Proof:</p>
                                            <input
                                                type="file"
                                                onChange={handleImageChange}
                                                accept="image/*"
                                                className="mb-2"
                                            />
                                            {imagePreview && (
                                                <div className="mt-2">
                                                    <p className="text-gray-600 text-[12px] font-[600] mb-1">Preview:</p>
                                                    <img
                                                        src={imagePreview}
                                                        alt="Upload Preview"
                                                        className="max-w-[300px] h-auto rounded-lg border"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                                {selectedTransaction?.status === "Pending" && (
                                    <div className="flex gap-4 mt-2">
                                        <button
                                            className="flex-1 bg-[#03996933] flex items-center justify-center text-[#039969] p-2 rounded hover:bg-[#03996950] text-[13px]"
                                            onClick={() => handleTransactionAction("Approved", selectedTransaction?._id)}
                                            disabled={selectedTransaction?.status === "Approved" || selectedTransaction?.status === "Decline"}
                                        >
                                            <IoMdCheckmark className="mt-[3px] mr-[6px]" />
                                            Approve Withdrawal
                                        </button>
                                        <button
                                            className="w-24 bg-[#FF405F33] flex items-center justify-center text-[#FF3F5F] p-2 rounded hover:bg-[#FF405F50] text-[13px]"
                                            onClick={() => handleTransactionAction("Decline", selectedTransaction?._id)}
                                            disabled={selectedTransaction?.status === "Approved" || selectedTransaction?.status === "Decline"}
                                        >
                                            <GoCircleSlash className="mt-[3px] mr-[6px]" />
                                            Decline
                                        </button>
                                    </div>
                                )}
                                {/* Show status at bottom if approved without UTR or declined */}
                                {(selectedTransaction.status === "Decline" ||
                                    (selectedTransaction.status === "Approved" && !selectedTransaction.utr)) && (
                                        <>
                                            <div className="border-t mt-2 mb-1"></div>
                                            <div>
                                                <div className={`w-[100px] px-3 py-2 rounded-[20px] text-center text-[13px] font-[600] ${selectedTransaction.status === "Decline" ?
                                                    "bg-[#FF7A8F33] text-[#FF002A]" :
                                                    "bg-[#10CB0026] text-[#0DA000]"
                                                    }`}>
                                                    {selectedTransaction.status}
                                                </div>
                                            </div>
                                        </>
                                    )}
                            </div>
                        </div>

                        {/* Right Column - Only show for Approved with UTR */}
                        {selectedTransaction.status !== "Pending" &&
                            selectedTransaction.status !== "Decline" &&
                            selectedTransaction.utr && (
                                <div className="w-[350px] border-l pl-4">
                                    <div className="flex flex-col gap-4">
                                        {/* Proof Image */}
                                        {selectedTransaction.image && (
                                            <div>
                                                <p className="text-[14px] font-[600] mb-2">Payment Proof</p>
                                                <div className="max-h-[400px] overflow-auto">
                                                    <img
                                                        src={getImageUrl(selectedTransaction.image)}
                                                        alt="Payment Proof"
                                                        className="w-full object-contain cursor-pointer"
                                                        style={{ maxHeight: '400px' }}
                                                        onClick={() => window.open(getImageUrl(selectedTransaction.image), '_blank')}
                                                        onError={(e) => {
                                                            console.error('Image load error:', e);
                                                            e.target.src = 'fallback-image-url';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {/* UTR Details */}
                                        <div>
                                            <p className="text-[14px] font-[600] mb-2">UTR Number</p>
                                            <Input
                                                className="text-[12px] bg-gray-100"
                                                readOnly
                                                value={selectedTransaction.utr}
                                            />
                                        </div>
                                        {/* Current Status */}
                                        <div>
                                            <div className="px-3 py-2 w-[100px] rounded-[20px] text-center text-[13px] font-[600] bg-[#10CB0026] text-[#0DA000]">
                                                {selectedTransaction.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </Modal>
            {/* 
            <Modal
                title="Withdraw Request"
                open={withdrawModalOpen}
                onOk={handleWithdrawSubmit}
                onCancel={() => { setWithdrawModalOpen(false);
                    resetForm();
                }}
                okText="Submit"
                cancelText="Cancel"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Merchant
                        </label>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Select Merchant"
                            value={selectedMerchant}
                            onChange={(value) => setSelectedMerchant(value)}
                            options={merchants}
                            showSearch
                            filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase())}
                        />
                        <p className="text-gray-500 text-[13px] font-[500]">Avaiable for Withdraw: <span className="text-green-500">{merchantWallet?.pendingAmount?.toFixed(2) || 0} INR</span></p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </label>
                        <Input
                            prefix={<FaIndianRupeeSign />}
                            type="number"
                            placeholder="Enter amount"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Exchange
                        </label>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Select Exchange"
                            value={exchange}
                            onChange={handleExchangeChange}
                            options={exchanges}
                        />
                    </div>

                    {exchange && (
                        <div>
                            <p className="text-[12px] font-[500] flex items-center"><span className="text-gray-400 w-[150px] block">Exchange Rate:</span>{" "}1 {exchangeData?.label} = {exchangeData?.rate} INR</p>
                            <p className="text-[12px] font-[500] flex items-center"><span className="text-gray-400 w-[150px] block">Exchange Charges:</span>{" "}{exchangeData?.charges}%</p>
                            <p className="text-[13px] font-[500] flex items-center text-green-500">
                                <span className="text-gray-500 w-[150px] block">Withdrawal Amount:</span>
                                {" "}
                                {((parseFloat(withdrawAmount) - (parseFloat(exchangeData?.charges) * parseFloat(withdrawAmount)) / 100) / parseFloat(exchangeData?.rate)).toFixed(2)}
                                {" "}
                                {exchangeData?.label === "Bank/UPI" ? "INR" : exchangeData?.label === "By Cash" ? "INR" : exchangeData?.label}
                            </p>
                        </div>
                    )}

                    {exchange === "67c1e65de5d59894e5a19435" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Bank
                            </label>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Select Your Bank"
                                onChange={(value) => setSelectedBank(value)}
                                value={selectedBank}
                                options={banks}
                                loading={!banks.length}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Note
                        </label>
                        <TextArea
                            placeholder="Write anything about Transaction"
                            autoSize={{ minRows: 4, maxRows: 8 }}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>
            </Modal> */}

            <Modal
                title="Withdraw Request"
                open={withdrawModalOpen}
                onOk={handleWithdrawSubmit}
                onCancel={() => {
                    setWithdrawModalOpen(false);
                    resetForm();
                }}
                okText="Submit"
                cancelText="Cancel"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Merchant
                        </label>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Select Merchant"
                            value={selectedMerchant}
                            onChange={(value) => setSelectedMerchant(value)}
                            options={merchants}
                            showSearch
                            filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase())}
                        />
                        <p className="text-gray-500 text-[13px] font-[500]">Available for Withdraw: <span className="text-green-500">{merchantWallet?.pendingAmount?.toFixed(2) || 0} INR</span></p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </label>
                        <Input
                            prefix={<FaIndianRupeeSign />}
                            type="number"
                            placeholder="Enter amount"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Exchange
                        </label>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Select Exchange"
                            value={exchange}
                            onChange={handleExchangeChange}
                            options={exchanges}
                        />
                    </div>

                    {exchange && (
                        <div>
                            <p className="text-[12px] font-[500] flex items-center"><span className="text-gray-400 w-[150px] block">Exchange Rate:</span>{" "}1 {exchangeData?.label} = {exchangeData?.rate} INR</p>
                            <p className="text-[12px] font-[500] flex items-center"><span className="text-gray-400 w-[150px] block">Exchange Charges:</span>{" "}{exchangeData?.charges}%</p>
                            <p className="text-[13px] font-[500] flex items-center text-green-500">
                                <span className="text-gray-500 w-[150px] block">Withdrawal Amount:</span>
                                {" "}
                                {((parseFloat(withdrawAmount) - (parseFloat(exchangeData?.charges) * parseFloat(withdrawAmount)) / 100) / parseFloat(exchangeData?.rate)).toFixed(2)}
                                {" "}
                                {exchangeData?.label === "Bank/UPI" ? "INR" : exchangeData?.label === "By Cash" ? "INR" : exchangeData?.label}
                            </p>
                        </div>
                    )}

                    {exchange === "67c1e65de5d59894e5a19435" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Bank
                            </label>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Select Your Bank"
                                onChange={(value) => setSelectedBank(value)}
                                value={selectedBank}
                                options={banks}
                                loading={!banks.length}
                                showSearch
                                filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase())}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Note
                        </label>
                        <TextArea
                            placeholder="Write anything about Transaction"
                            autoSize={{ minRows: 4, maxRows: 8 }}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Withdraw;