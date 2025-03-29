import axios from "axios";
import Cookies from "js-cookie";
import moment from 'moment-timezone';
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Input, Modal, notification, Pagination, Select } from "antd";

import BACKEND_URL, { fn_getMerchantApi } from "../../api/api";

import { RxCross2 } from "react-icons/rx";
import { FaExclamationCircle } from "react-icons/fa";
import { FaCheck, FaIndianRupeeSign } from "react-icons/fa6";

const WalletTransfer = ({ authorization, showSidebar }) => {

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [merchants, setMerchants] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const containerHeight = window.innerHeight - 120;
    const [currentPage, setCurrentPage] = useState(1);
    const [submitLoader, setSubmitLoader] = useState(false);

    //form fields
    const [amount, setAmount] = useState("");
    const [toMerchant, setToMerchant] = useState(null);
    const [selectedMerchant, setSelectedMerchant] = useState(null);

    useEffect(() => {
        window.scroll(0, 0);
        if (!authorization) {
            navigate("/login");
        };
        fetchMerchants();
        fetchWalletTransfer(currentPage);
    }, [authorization, navigate, currentPage]);

    const fn_modalPopup = () => {
        setOpen(!open);
        setAmount("");
        setToMerchant(null);
        setSelectedMerchant(null);
    };

    const fetchMerchants = async () => {
        try {
            const response = await fn_getMerchantApi();
            if (response.status) {
                const merchantOptions = response.data?.data?.map(merchant => ({
                    value: merchant._id,
                    label: merchant.merchantName,
                    wallet: merchant.wallet
                }));
                setMerchants(merchantOptions);
            }
        } catch (error) {
            console.error("Error fetching merchants:", error);
        }
    };

    const fetchWalletTransfer = async (page) => {
        try {
            setLoading(true);
            const token = Cookies.get("token");
            const response = await axios.get(`${BACKEND_URL}/wallet-transfer/getByAdmin?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.status === 200) {
                setLoading(false);
                setData(response?.data?.data);
                setTotalPages(response?.data?.totalPages);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const fn_submit = async (e) => {
        e.preventDefault();
        try {
            const fromWallet = merchants.find((m) => m.value == selectedMerchant)?.wallet?.toFixed(2);
            if (parseFloat(amount) === 0 || parseFloat(amount) < 0) {
                return notification.error({
                    message: "Invalid Amount",
                    description: "Please Enter Correct Amount",
                    placement: "topRight",
                });
            }
            if (fromWallet < parseFloat(amount)) {
                return notification.error({
                    message: "Insuffient Balance",
                    description: "Merchant have insuffient Balance",
                    placement: "topRight",
                });
            }
            const data = {
                amount: parseFloat(amount),
                fromMerchant: selectedMerchant,
                toMerchant,
                type: "admin",
                status: "pending"
            };
            setSubmitLoader(true);
            const token = Cookies.get("token");
            const response = await axios.post(`${BACKEND_URL}/wallet-transfer/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.status === 200) {
                fn_modalPopup();
                fetchMerchants();
                setCurrentPage(1);
                setSubmitLoader(false);
                fetchWalletTransfer(1);
                return notification.success({
                    message: "Wallet Trasfer Request Submitted",
                    description: "Wallet Transfer Request Sent Successfully",
                    placement: "topRight",
                });
            }
        } catch (error) {
            console.log(error);
            setSubmitLoader(false);
            return notification.error({
                message: "Error",
                description: error?.response?.data?.message || "Network Error",
                placement: "topRight",
            });
        }
    };

    const fn_update = async (id, status) => {
        try {
            const data = { id, status };
            const token = Cookies.get("token");
            const response = await axios.put(`${BACKEND_URL}/wallet-transfer`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.status === 200) {
                fetchMerchants();
                fetchWalletTransfer(currentPage);
                return notification.success({
                    message: "Wallet Updated",
                    description: response?.data?.message || "Wallet Updated",
                    placement: "topRight",
                });
            }
        } catch (error) {
            console.log(error);
            return notification.error({
                message: "Error",
                description: error?.response?.data?.message || "Network Error",
                placement: "topRight",
            });
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
                        <h1 className="text-[25px] font-[500]">Wallet Transfer</h1>
                        <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
                            Dashboard - Wallet Transfer
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex flex-col md:flex-row items-center justify-between pb-3">
                            <div>
                                <p className="text-black font-medium text-lg">
                                    Wallet Transfer Requests
                                </p>
                            </div>
                            {/* Add back the withdraw button */}
                            <Button type="primary" onClick={fn_modalPopup}>
                                Create Request
                            </Button>
                        </div>
                        <div className="w-full border-t-[1px] border-[#DDDDDD80] hidden sm:block mb-4"></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#ECF0FA]">
                                    <tr>
                                        <th className="p-4 text-[13px] font-[600]">Sr. No.</th>
                                        <th className="p-4 text-[13px] font-[600]">Sender</th>
                                        <th className="p-4 text-[13px] font-[600]">Receiver</th>
                                        <th className="p-4 text-[13px] font-[600]">Amount</th>
                                        <th className="p-4 text-[13px] font-[600]">Date</th>
                                        <th className="p-4 text-[13px] font-[600]">Status</th>
                                        <th className="p-4 text-[13px] font-[600]">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.length > 0 ? (
                                        data.map((item, index) => (
                                            <tr
                                                key={item._id}
                                                className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                            >
                                                <td className="p-4 text-[13px]">{(currentPage - 1) * 10 + index + 1}</td>
                                                <td className="p-4 text-[13px]">{item?.fromMerchant?.merchantName}</td>
                                                <td className="p-4 text-[13px]">{item?.toMerchant?.merchantName}</td>
                                                <td className="p-4 text-[13px]"><FaIndianRupeeSign className="inline-block mt-[-1px]" /> {item?.amount}</td>
                                                <td className="p-4 text-[13px]">{moment.utc(item?.createdAt).format('DD MMM YYYY, hh:mm A')}</td>
                                                <td className={`p-4`}>
                                                    <p className={`text-[11px] capitalize w-[80px] h-[30px] rounded-full flex justify-center items-center ${item?.status === "approved" ? "text-[#0DA000] bg-[#10CB0026]" : item?.status === "pending" ? "text-[#FFB800] bg-[#FFC70126]" : "text-[#FF002A] bg-[#FF7A8F33]"}`}>{item?.status}</p>
                                                </td>
                                                <td className="p-4 text-[13px] flex gap-[10px]">
                                                    <button
                                                        className={`bg-green-200 rounded-full w-[32px] h-[32px] flex justify-center items-center text-green-700 ${item?.status !== "pending" ? "cursor-not-allowed" : "cursor-pointer"}`}
                                                        disabled={item?.status !== "pending"}
                                                        onClick={() => fn_update(item?._id, "approved")}
                                                    >
                                                        <FaCheck className="text-[15px]" />
                                                    </button>
                                                    <button
                                                        className={`bg-gray-200 rounded-full w-[32px] h-[32px] flex justify-center items-center text-gray-700 ${item?.status !== "pending" ? "cursor-not-allowed" : "cursor-pointer"}`}
                                                        disabled={item?.status !== "pending"}
                                                        onClick={() => fn_update(item?._id, "decline")}
                                                    >
                                                        <RxCross2 className="text-[17px]" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-gray-500">
                                                <FaExclamationCircle className="inline-block mr-2" />
                                                {loading ? 'Loading Data...' : 'No Data found'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mb-[5px] mt-[10px] flex justify-end">
                            <Pagination
                                className="self-center md:self-auto"
                                current={currentPage}
                                onChange={(e) => setCurrentPage(e)}
                                defaultCurrent={1}
                                total={totalPages * 10}
                                showSizeChanger={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                centered
                width={600}
                open={open}
                onOk={fn_submit}
                onCancel={fn_modalPopup}
                okText="Submit"
                cancelText="Cancel"
                confirmLoading={submitLoader}
            >
                <p className="text-[16px] font-[600]">Create Wallet Transfer Request</p>
                <form className="mt-[15px] mb-[20px] flex flex-col gap-[10px]" onSubmit={fn_submit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            From
                        </label>
                        <Select
                            showSearch
                            options={merchants}
                            value={selectedMerchant}
                            style={{ width: '100%' }}
                            placeholder="Select Merchant"
                            onChange={(value) => setSelectedMerchant(value)}
                            filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase())}
                        />
                        {selectedMerchant && (
                            <p className="text-gray-500 text-[13px] font-[500]">Available for Transfer: <span className="text-green-500">{merchants.find((m) => m.value == selectedMerchant)?.wallet?.toFixed(2) || 0} INR</span></p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            To
                        </label>
                        <Select
                            showSearch
                            options={merchants}
                            value={toMerchant}
                            style={{ width: '100%' }}
                            placeholder="Select Merchant"
                            onChange={(value) => setToMerchant(value)}
                            filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase())}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </label>
                        <Input
                            type="number"
                            value={amount}
                            prefix={<FaIndianRupeeSign />}
                            placeholder="Enter amount"
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default WalletTransfer;