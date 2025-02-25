import { Select } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fn_getAllBanksData, fn_getMerchantApi } from "../../api/api";

const Reports = ({ authorization, showSidebar }) => {

    const navigate = useNavigate();
    const containerHeight = window.innerHeight - 120;
    const [banksOption, setBanksOption] = useState([]);
    const [merchantOptions, setMerchantOption] = useState([]);
    const [selectedMerchant, setSelectedMerchant] = useState("");

    useEffect(() => {
        window.scroll(0, 0);
        if (!authorization) {
            navigate("/login");
        };
    }, [authorization]);

    useEffect(() => {
        fn_getAllBanks();
        fn_getAllMerchants();
    }, []);

    const fn_getAllMerchants = async () => {
        const response = await fn_getMerchantApi();
        if (response?.status) {
            setMerchantOption(response?.data?.data?.map((item) => {
                return { value: item?._id, label: item?.merchantName }
            }));
        }
    };

    const fn_getAllBanks = async () => {
        const response = await fn_getAllBanksData("");
        if (response?.status) {
            setBanksOption(response?.data?.data?.map((item) => {
                return { value: item?._id, label: `${item?.bankName} - ${item?.bankName === "UPI" ? item?.iban : item?.accountHolderName}${item?.bankName !== "UPI" ? ` - ${item?.iban}` : ''}` }
            }));
        }
    };

    const fn_changeMerchant = (value) => {
        setSelectedMerchant(value);
    };

    return (
        <div
            style={{ minHeight: `${containerHeight}px` }}
            className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"}`}
        >
            <div className="p-7">
                <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
                    <h1 className="text-[20px] md:text-[25px] font-[500]">
                        Reports
                    </h1>
                    <p
                        onClick={() => navigate("/SystemConfigurationIntegration")}
                        className="text-[#7987A1] text-[13px] md:text-[15px] font-[400] cursor-pointer"
                    >
                        Dashboard - Reports
                    </p>
                </div>
                <div className="flex flex-col gap-[5px]">
                    <p className="text-[15px] font-[500]">Select Merchant to View Reports</p>
                    <Select
                        style={{ width: '100%', height: "38px" }}
                        placeholder="Please Select Merchant"
                        onChange={fn_changeMerchant}
                        options={merchantOptions}
                    />
                </div>
                {selectedMerchant && selectedMerchant !== "" && (
                    <div className="mt-[20px] flex flex-col gap-[15px]">
                        {banksOption?.map((bank) => (
                            <div className="flex flex-col gap-[4px]">
                                <p className="font-[500] text-[15px]">{bank?.label}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Boxes number={1000} amount={2000} title={"SYSTEM APPROVED TRANSACTIONS"} bgColor={"linear-gradient(to right, rgba(0, 150, 102, 1), rgba(59, 221, 169, 1))"} />
                                    <Boxes number={1000} amount={2000} title={"PENDING TRANSACTIONS"} bgColor={"linear-gradient(to right, rgba(245, 118, 0, 1), rgba(255, 196, 44, 1))"} />
                                    <Boxes number={1000} amount={2000} title={"FAILED TRANSACTIONS"} bgColor={"linear-gradient(to right, rgba(255, 61, 92, 1), rgba(255, 122, 143, 1))"} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;

const Boxes = ({ number, amount, title, bgColor }) => (
    <div
        className="bg-white px-[14px] py-[10px] rounded-[5px] shadow text-white"
        style={{ backgroundImage: bgColor }}
    >
        <h2 className="text-[13px] uppercase font-[500]">{title}</h2>
        <p className="mt-[13px] text-[20px] font-[700]">₹ {number}</p>
        <p className="pt-[3px] text-[13px] font-[500] mb-[7px]">
            Amount: <span className="font-[700]">₹ {amount}</span>
        </p>
    </div>
);
