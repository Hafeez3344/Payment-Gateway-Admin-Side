import axios from "axios";
import "jspdf-autotable";
import jsPDF from "jspdf";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button, DatePicker, notification, Select, Space, Table } from "antd";
import * as XLSX from "xlsx";

import { FaDownload } from "react-icons/fa6";

import BACKEND_URL, { fn_getAllBanksData, fn_getMerchantApi } from "../../api/api";

const columns = [
    {
        title: 'Sr No',
        dataIndex: 'reportId',
        key: 'reportId',
    },
    {
        title: 'Creation Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
    {
        title: 'Merchant',
        dataIndex: 'merchant',
        key: 'merchant',
    },
    {
        title: 'Bank',
        dataIndex: 'bank',
        key: 'bank',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Date Range',
        dataIndex: 'dateRange',
        key: 'dateRange',
    }
];

const Reports = ({ authorization, showSidebar }) => {

    const navigate = useNavigate();
    const { RangePicker } = DatePicker;

    const containerHeight = window.innerHeight - 120;
    const [banksOption, setBanksOption] = useState([]);
    const [merchantOptions, setMerchantOption] = useState([]);
    const statusOptions = [
        { label: "All", value: "" },
        { label: "Approved", value: "Approved" },
        { label: "Pending", value: "Pending" },
        { label: "Decline", value: "Decline" },
    ];

    const [toDate, setToDate] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [tableData, setTableData] = useState([]);
    const [selectedBank, setSelectedBank] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [dateRange, setDateRange] = useState([null, null]);
    const [disableButton, setDisableButton] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState("");
    const [selectedMerchantName, setSelectedMerchantName] = useState("All");
    const [selectedBankName, setSelectedBankName] = useState("All");

    useEffect(() => {
        window.scroll(0, 0);
        if (!authorization) {
            navigate("/login");
        };
    }, [authorization]);

    useEffect(() => {
        fn_getAllBanks();
        fn_getReportsLog();
        fn_getAllMerchants();
    }, []);

    useEffect(() => {
        if (dateRange[0] && dateRange[1]) {
            setFromDate(new Date(dateRange[0]?.$d));
            setToDate(new Date(dateRange[1]?.$d));
        }
    }, [dateRange]);

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
        const merchant = merchantOptions?.find((m) => m?.value === value);
        setSelectedMerchantName(merchant?.label);
    };

    const fn_changeBank = (value) => {
        setSelectedBank(value);
        const bank = banksOption?.find((m) => m?.value === value);
        if (bank) {
            const bankLabel = bank.label;
            setSelectedBankName(bankLabel); // This will already include the UPI ID from the options
        } else {
            setSelectedBankName("All");
        }
    };

    const fn_changeStatus = (value) => {
        setSelectedStatus(value);
    };

    const fn_submit = async () => {
        try {
            if (fromDate === "" || toDate === "") {
                return notification.error({
                    message: "Error",
                    description: "Please Select Date",
                    placement: "topRight",
                });
            }
            const token = Cookies.get("token");
            const adminId = Cookies.get("adminId");
            setDisableButton(true);

            const queryParams = new URLSearchParams();
            queryParams.append('startDate', fromDate);
            queryParams.append('endDate', toDate);
            queryParams.append('filterByAdminId', adminId);
            
            if (selectedMerchant) queryParams.append('merchantId', selectedMerchant);
            if (selectedStatus) queryParams.append('status', selectedStatus);
            if (selectedBank) queryParams.append('bankId', selectedBank);

            const response = await axios.get(`${BACKEND_URL}/ledger/transactionSummary?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response?.status) {
                if (response?.data?.status === "ok") {
                    fn_getReportsLog();
                    downloadPDF(response?.data);
                    downloadExcel(response?.data);
                }
            }
        } catch (error) {
            console.log("error while download report ", error);
            notification.error({
                message: "Error",
                description: "Failed to generate report",
                placement: "topRight",
            });
            setDisableButton(false);
        }
    };

    const downloadPDF = (data) => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a4"
        });

        const tableColumn = ["Date", "Merchant", "Bank", "Trn Status", "No. of Transactions", "Received (INR)", "Charges (INR)", "Net Amount (INR)"];

        const totalTransactions = data?.data?.reduce((acc, item) => acc + (parseInt(item.NoOfTransaction) || 0), 0);

        const tableRows = data?.data?.map((item) => {
            return [
                item.Date || "All",
                selectedMerchant ? selectedMerchantName : "All",
                selectedBank ? selectedBankName : "All", 
                (!item.Status || item.Status === "") ? "All" : item.Status,
                item.NoOfTransaction || "0",
                item.PayIn || "0",
                item.Charges || "0",
                item.Amount || "0"
            ];
        }) || [];

        tableRows.push([
            { content: "Total", styles: { fontStyle: 'bold' } },
            { content: "", styles: { fontStyle: 'bold' } },
            { content: "", styles: { fontStyle: 'bold' } },
            { content: "", styles: { fontStyle: 'bold' } },
            { content: totalTransactions.toString(), styles: { fontStyle: 'bold' } },
            { content: data.totalPayIn.toFixed(2), styles: { fontStyle: 'bold' } },
            { content: data.totalCharges.toFixed(2), styles: { fontStyle: 'bold' } },
            { content: data.totalAmount.toFixed(2), styles: { fontStyle: 'bold' } }
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            styles: { fontSize: 10 },
            theme: "",
            margin: { top: 30 },
            willDrawCell: function(data) {
                if (data.row.index === tableRows.length - 1) {
                    data.cell.styles.fillColor = [200, 220, 255];
                }
            }
        });

        doc.save("report.pdf");
        setDisableButton(false);
    };

    const downloadExcel = (data) => {
        const tableColumn = ["Date", "Merchant", "Bank", "Trn Status", "No. of Transactions", "Received In (INR)", "Charges (INR)", "Net Amount (INR)"];
        
        const totalTransactions = data?.data?.reduce((acc, item) => acc + (parseInt(item.NoOfTransaction) || 0), 0);

        const tableRows = data?.data?.map((item) => {
            return {
                Date: item.Date || "All",
                Merchant: selectedMerchant ? selectedMerchantName : "All",
                Bank: selectedBank ? selectedBankName : "All", 
                Status: (!item.Status || item.Status === "") ? "All" : item.Status,
                "No. of Transactions": item.NoOfTransaction || "0",
                "Received In (INR)": item.PayIn || "0",
                "Charges (INR)": item.Charges || "0",
                "Net Amount (INR)": item.Amount || "0"
            };
        }) || [];

        tableRows.push({
            Date: "Total",
            Merchant: "",
            Bank: "",
            Status: "",
            "No. of Transactions": totalTransactions,
            "Received In (INR)": data.totalPayIn.toFixed(2),
            "Charges (INR)": data.totalCharges.toFixed(2),
            "Net Amount (INR)": data.totalAmount.toFixed(2)
        });

        const worksheet = XLSX.utils.json_to_sheet(tableRows);

        const range = XLSX.utils.decode_range(worksheet["!ref"]);
        const totalRowIndex = range.e.r;
        
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellRef = XLSX.utils.encode_cell({ r: totalRowIndex, c: col });
            if (!worksheet[cellRef]) worksheet[cellRef] = {};
            worksheet[cellRef].s = {
                font: { bold: true },
                fill: { fgColor: { rgb: "C8E0FF" } } 
            };
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        XLSX.writeFile(workbook, "report.xlsx");
        setDisableButton(false);
    };

    const fn_getReportsLog = async () => {
        try {
            const token = Cookies.get("token");
            const adminId = Cookies.get("adminId");
            const response = await axios.get(`${BACKEND_URL}/ledgerLog/getAll?filterByAdminId=${adminId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.status) {
                if (response?.data?.status === "ok") {
                    setTableData(response?.data?.data?.map((item, index) => {
                        const bankName = item?.bankId?.bankName 
                            ? (item?.bankId?.bankName === "UPI" 
                                ? `${item?.bankId?.bankName} - ${item?.bankId?.iban}` 
                                : item?.bankId?.bankName)
                            : "All";

                        return {
                            key: `${index + 1}`,
                            reportId: `${index + 1}`,
                            createdAt: new Date(item?.createdAt)?.toLocaleDateString(),
                            merchant: item?.merchantId?.merchantName || "All",
                            bank: bankName,
                            status: item?.status && item?.status !== "" ? item?.status : "All",
                            dateRange: item?.startDate && item?.endDate ? `${new Date(item?.startDate).toDateString()} - ${new Date(item?.endDate).toDateString()}` : "All"
                        }
                    }))
                }
            }
        } catch (error) {
            console.log("error in fetching reports log ", error);
        }
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
                <div className="grid grid-cols-4 gap-[20px]">
                    <div className="flex flex-col gap-[2px]">
                        <p className="text-[13px] font-[500]">Select Merchant</p>
                        <Select
                            style={{ width: '100%', height: "38px" }}
                            placeholder="Please Select Merchant"
                            onChange={fn_changeMerchant}
                            options={[{ value: "", label: "All" }, ...merchantOptions]}
                        />
                    </div>
                    <div className="flex flex-col gap-[2px]">
                        <p className="text-[13px] font-[500]">Select Bank</p>
                        <Select
                            style={{ width: '100%', height: "38px" }}
                            placeholder="Please Select Bank"
                            onChange={fn_changeBank}
                            options={[{ value: "", label: "All" }, ...banksOption]}
                        />
                    </div>
                    <div className="flex flex-col gap-[2px]">
                        <p className="text-[13px] font-[500]">Select Status</p>
                        <Select
                            style={{ width: '100%', height: "38px" }}
                            placeholder="Please Select Status"
                            onChange={fn_changeStatus}
                            options={statusOptions}
                        />
                    </div>
                    <div className="flex flex-col gap-[2px]">
                        <p className="text-[13px] font-[500]">Select Date Range</p>
                        <Space direction="vertical" size={10}>
                            <RangePicker
                                value={dateRange}
                                onChange={(dates) => setDateRange(dates)}
                                style={{ width: "100%", height: "38px" }}
                            />
                        </Space>
                    </div>
                </div>
                <div className="flex justify-end mt-[20px]">
                    <Button type="primary" className="h-[38px] w-[200px]" onClick={fn_submit} disabled={disableButton}><FaDownload /> Download Report</Button>
                </div>
                <div className="w-full bg-[white] mt-[30px]">
                    <Table dataSource={tableData} columns={columns} />
                </div>
            </div>
        </div>
    );
};

export default Reports;
