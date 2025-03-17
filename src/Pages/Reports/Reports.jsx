import axios from "axios";
import "jspdf-autotable";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import { FaDownload } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  notification,
  Select,
  Space,
  Table,
  Modal,
  Pagination,
} from "antd";
import BACKEND_URL, {
  fn_getAllBanksData,
  fn_getMerchantApi,
} from "../../api/api";

const selectStyles = {
  ".merchant-select .ant-select-selection-placeholder": {
    textAlign: "center",
    left: "40%",
    transform: "translateX(-50%)",
  },
};

const columns = [
  {
    title: "Sr No",
    dataIndex: "reportId",
    key: "reportId",
  },
  {
    title: "Creation Date",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Merchant",
    dataIndex: "merchant",
    key: "merchant",
  },
  {
    title: "Bank",
    dataIndex: "bank",
    key: "bank",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Date Range",
    dataIndex: "dateRange",
    key: "dateRange",
  },
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
  const [selectedMerchant, setSelectedMerchant] = useState([]);
  const [selectedBankName, setSelectedBankName] = useState("All");
  const [selectedMerchantName, setSelectedMerchantName] = useState(["All"]);
  const [selectedMerchantuserName, setSelecteduserMerchantName] = useState([
    "All",
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scroll(0, 0);
    if (!authorization) {
      navigate("/login");
    }
  }, [authorization]);

  useEffect(() => {
    fn_getAllBanks();
    fn_getReportsLog(currentPage);
    fn_getAllMerchants();
  }, [currentPage, dateRange, selectedStatus, selectedBank, selectedMerchant]);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      const startDate = new Date(dateRange[0].$d);
      const endDate = new Date(dateRange[1].$d);

      // Set start date to beginning of day
      startDate.setHours(0, 0, 0, 0);

      // Set end date to end of day
      endDate.setHours(23, 59, 59, 999);

      setFromDate(startDate);
      setToDate(endDate);
    }
  }, [dateRange]);

  const fn_getAllMerchants = async () => {
    const response = await fn_getMerchantApi();
    if (response?.status) {
      setMerchantOption(
        response?.data?.data?.map((item) => {
          return { value: item?._id, label: item?.merchantName };
        })
      );
    }
  };

  const fn_getAllBanks = async () => {
    const response = await fn_getAllBanksData("");
    if (response?.status) {
      setBanksOption(
        response?.data?.data?.map((item) => {
          return {
            value: item?._id,
            label: `${item?.bankName} - ${
              item?.bankName === "UPI" ? item?.iban : item?.accountHolderName
            }${item?.bankName !== "UPI" ? ` - ${item?.iban}` : ""}`,
          };
        })
      );
    }
  };

  const fn_changeMerchant = (values) => {
    const filteredValues = values.filter((value) => value !== "");
    setSelectedMerchant(filteredValues);

    const merchantNames =
      filteredValues.length > 0
        ? merchantOptions
            .filter((m) => filteredValues.includes(m.value))
            .map((m) => m.value)
        : ["All"];
    setSelectedMerchantName(merchantNames);

    const merchantuserNames =
      filteredValues.length > 0
        ? merchantOptions
            .filter((m) => filteredValues.includes(m.value))
            .map((m) => m.label)
        : ["All"];
    setSelecteduserMerchantName(merchantuserNames);
  };

  const fn_changeBank = (value) => {
    setSelectedBank(value);
    const bank = banksOption?.find((m) => m?.value === value);
    if (bank) {
      const bankLabel = bank.label;
      setSelectedBankName(bankLabel);
    } else {
      setSelectedBankName("All");
    }
  };

  const fn_changeStatus = (value) => {
    setSelectedStatus(value);
  };

  const fn_submit = async () => {
    try {
      if (!dateRange || !dateRange[0] || !dateRange[1]) {
        return notification.error({
          message: "Error",
          description: "Please Select Date Range",
          placement: "topRight",
        });
      }

      const token = Cookies.get("token");
      const adminId = Cookies.get("adminId");
      setDisableButton(true);

      // Convert dates to start of day and end of day
      const startDate = new Date(dateRange[0].$d);
      const endDate = new Date(dateRange[1].$d);

      // Set start date to beginning of day
      startDate.setHours(0, 0, 0, 0);

      // Set end date to end of day
      endDate.setHours(23, 59, 59, 999);

      // Adjust for timezone difference
      const startISOString = new Date(
        startDate.getTime() - startDate.getTimezoneOffset() * 60000
      ).toISOString();
      const endISOString = new Date(
        endDate.getTime() - endDate.getTimezoneOffset() * 60000
      ).toISOString();

      const queryParams = new URLSearchParams();
      queryParams.append("startDate", startISOString);
      queryParams.append("endDate", endISOString);
      queryParams.append("filterByAdminId", adminId);

      if (selectedMerchant.length > 0) {
        queryParams.append("merchantId", JSON.stringify(selectedMerchant));
      }
      if (selectedStatus) queryParams.append("status", selectedStatus);
      if (selectedBank) queryParams.append("bankId", selectedBank);

      const response = await axios.get(
        `${BACKEND_URL}/ledger/transactionSummaryTest?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.status) {
        if (response?.data?.status === "ok") {
          setReportData(response?.data);
          setIsModalVisible(true);
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

  const handleDownload = async (format) => {
    try {
      if (format === "pdf") {
        downloadPDF(reportData);
      } else if (format === "excel") {
        downloadExcel(reportData);
      }
      await fn_getReportsLog(currentPage);
      setIsModalVisible(false);
      setDisableButton(false);
    } catch (error) {
      console.log("error in downloading report", error);
      notification.error({
        message: "Error",
        description: "Failed to download report",
        placement: "topRight",
      });
      setDisableButton(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setDisableButton(false);
  };

  const downloadPDF = (data) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const tableColumn = [
      "Date",
      "Merchant",
      "Bank",
      "Trn Status",
      "No. of Transactions",
      "PayIn (INR)",
      "Payout (INR)",
      "Charges (INR)",
      "Net Amount (INR)",
    ];

    const tableRows =
      data?.data?.map((item) => {
        const isPayIn = item.Type === "payIn";
        return [
          item.Date || "All",
          selectedMerchantuserName.length > 0
            ? selectedMerchantuserName.join(", ")
            : "All",
          selectedBank ? selectedBankName : "All",
          !item.Status || item.Status === "" ? "All" : item.Status,
          item.NoOfTransaction?.toString() || "-",
          isPayIn ? (Number(item.PayIn || 0) > 0 ? Number(item.PayIn).toFixed(2) : "-") : "-",
          !isPayIn ? (Number(item.Amount || 0) > 0 ? Number(item.Amount).toFixed(2) : "-") : "-",
          isPayIn ? (Number(item.Charges || 0) > 0 ? Number(item.Charges).toFixed(2) : "-") : "-",
          isPayIn ? (Number(item.Amount || 0) > 0 ? Number(item.Amount).toFixed(2) : "-") : 
                   (Number(item.Amount || 0) > 0 ? Number(item.Amount).toFixed(2) : "-"),
        ];
      }) || [];

    // Add PayIn Summary rows
    tableRows.push([
      { content: "Total PayIn", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: data.payIn?.totalTransaction?.toString() || "-", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: Number(data.payIn?.totalPayIn || 0).toFixed(2), styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
    ]);

    tableRows.push([
      { content: "PayIn Charges", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: Number(data.payIn?.totalCharges || 0).toFixed(2), styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
    ]);

    tableRows.push([
      { content: "PayIn Net Amount", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
      { content: Number(data.payIn?.totalAmount || 0).toFixed(2), styles: { fontStyle: "bold", fillColor: [220, 230, 241] } },
    ]);

    // Add Payout Summary rows
    tableRows.push([
      { content: "Total Payout", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: data.payout?.totalTransaction?.toString() || "-", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: Number(data.payout?.totalAmount || 0).toFixed(2), styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
    ]);

    tableRows.push([
      { content: "Payout Charges", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: Number(data.payout?.totalCharges || 0).toFixed(2), styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
    ]);

    tableRows.push([
      { content: "Payout Net Amount", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: "-", styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
      { content: Number(data.payout?.totalAmount || 0).toFixed(2), styles: { fontStyle: "bold", fillColor: [200, 220, 255] } },
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10 },
      theme: "",
      margin: { top: 30 },
    });

    doc.save("report.pdf");
    setDisableButton(false);
  };

  const downloadExcel = (data) => {
    const tableColumn = [
      "Date",
      "Merchant",
      "Bank",
      "Trn Status",
      "No. of Transactions",
      "PayIn (INR)",
      "Payout (INR)",
      "Charges (INR)",
      "Net Amount (INR)",
    ];

    const tableRows =
      data?.data?.map((item) => {
        const isPayIn = item.Type === "payIn";
        return {
          Date: item.Date || "All",
          Merchant:
            selectedMerchantuserName.length > 0
              ? selectedMerchantuserName.join(", ")
              : "All",
          Bank: selectedBank ? selectedBankName : "All",
          Status: !item.Status || item.Status === "" ? "All" : item.Status,
          "No. of Transactions": item.NoOfTransaction?.toString() || "-",
          "PayIn (INR)": isPayIn ? (Number(item.PayIn || 0) > 0 ? Number(item.PayIn).toFixed(2) : "-") : "-",
          "Payout (INR)": !isPayIn ? (Number(item.Amount || 0) > 0 ? Number(item.Amount).toFixed(2) : "-") : "-",
          "Charges (INR)": isPayIn ? (Number(item.Charges || 0) > 0 ? Number(item.Charges).toFixed(2) : "-") : "-",
          "Net Amount (INR)": isPayIn ? (Number(item.Amount || 0) > 0 ? Number(item.Amount).toFixed(2) : "-") : 
                             (Number(item.Amount || 0) > 0 ? Number(item.Amount).toFixed(2) : "-"),
        };
      }) || [];

    // Add PayIn Summary rows
    tableRows.push({
      Date: "Total PayIn",
      Merchant: "",
      Bank: "",
      Status: "",
      "No. of Transactions": data.payIn?.totalTransaction?.toString() || "-",
      "PayIn (INR)": Number(data.payIn?.totalPayIn || 0).toFixed(2),
      "Payout (INR)": "-",
      "Charges (INR)": "-",
      "Net Amount (INR)": "-",
    });

    tableRows.push({
      Date: "PayIn Charges",
      Merchant: "",
      Bank: "",
      Status: "",
      "No. of Transactions": "-",
      "PayIn (INR)": "-",
      "Payout (INR)": "-",
      "Charges (INR)": Number(data.payIn?.totalCharges || 0).toFixed(2),
      "Net Amount (INR)": "-",
    });

    tableRows.push({
      Date: "PayIn Net Amount",
      Merchant: "",
      Bank: "",
      Status: "",
      "No. of Transactions": "-",
      "PayIn (INR)": "-",
      "Payout (INR)": "-",
      "Charges (INR)": "-",
      "Net Amount (INR)": Number(data.payIn?.totalAmount || 0).toFixed(2),
    });

    // Add Payout Summary rows
    tableRows.push({
      Date: "Total Payout",
      Merchant: "",
      Bank: "",
      Status: "",
      "No. of Transactions": data.payout?.totalTransaction?.toString() || "-",
      "PayIn (INR)": "-",
      "Payout (INR)": Number(data.payout?.totalAmount || 0).toFixed(2),
      "Charges (INR)": "-",
      "Net Amount (INR)": "-",
    });

    tableRows.push({
      Date: "Payout Charges",
      Merchant: "",
      Bank: "",
      Status: "",
      "No. of Transactions": "-",
      "PayIn (INR)": "-",
      "Payout (INR)": "-",
      "Charges (INR)": Number(data.payout?.totalCharges || 0).toFixed(2),
      "Net Amount (INR)": "-",
    });

    tableRows.push({
      Date: "Payout Net Amount",
      Merchant: "",
      Bank: "",
      Status: "",
      "No. of Transactions": "-",
      "PayIn (INR)": "-",
      "Payout (INR)": "-",
      "Charges (INR)": "-",
      "Net Amount (INR)": Number(data.payout?.totalAmount || 0).toFixed(2),
    });

    const worksheet = XLSX.utils.json_to_sheet(tableRows);
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    // Style PayIn Summary rows
    for (let row = range.e.r - 5; row <= range.e.r - 3; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellRef]) worksheet[cellRef] = {};
        worksheet[cellRef].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "DCE6F1" } },
        };
      }
    }

    // Style Payout Summary rows
    for (let row = range.e.r - 2; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellRef]) worksheet[cellRef] = {};
        worksheet[cellRef].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "C8E0FF" } },
        };
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "report.xlsx");
    setDisableButton(false);
  };

  const fn_getReportsLog = async (page) => {
    try {
      const token = Cookies.get("token");
      const adminId = Cookies.get("adminId");

      let url = `${BACKEND_URL}/ledgerLog/getAll?filterByAdminId=${adminId}&page=${page}`;

      // Add date range parameters if they exist
      if (dateRange && dateRange[0] && dateRange[1]) {
        const startDate = new Date(dateRange[0].$d);
        const endDate = new Date(dateRange[1].$d);

        // Set start date to beginning of day
        startDate.setHours(0, 0, 0, 0);

        // Set end date to end of day
        endDate.setHours(23, 59, 59, 999);

        // Adjust for timezone difference
        const startISOString = new Date(
          startDate.getTime() - startDate.getTimezoneOffset() * 60000
        ).toISOString();
        const endISOString = new Date(
          endDate.getTime() - endDate.getTimezoneOffset() * 60000
        ).toISOString();

        url += `&startDate=${startISOString}&endDate=${endISOString}`;
      }

      // Add other filters
      if (selectedMerchant.length > 0) {
        url += `&merchantId=${JSON.stringify(selectedMerchant)}`;
      }
      if (selectedStatus) {
        url += `&status=${selectedStatus}`;
      }
      if (selectedBank) {
        url += `&bankId=${selectedBank}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.status) {
        if (response?.data?.status === "ok") {
          // Helper function to get month name
          function getMonthName(monthIndex) {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return months[monthIndex];
          }
          
          setTableData(
            response?.data?.data?.map((item, index) => {
              const bankName = item?.bankId?.bankName
                ? item?.bankId?.bankName === "UPI"
                  ? `${item?.bankId?.bankName} - ${item?.bankId?.iban}`
                  : item?.bankId?.bankName
                : "All";
                
              return {
                key: `${index + 1}`,
                reportId: `${index + 1}`,
                createdAt: `${new Date(item?.createdAt).toISOString()}`,
                merchant:
                  item?.merchantId?.map((m) => m?.merchantName).join(", ") ||
                  "All",
                bank: bankName,
                status:
                  item?.status && item?.status !== "" ? item?.status : "All",
                dateRange: item?.startDate && item?.endDate
                  ? `${new Date(item?.startDate).getUTCDate()} ${getMonthName(new Date(item?.startDate).getUTCMonth())} ${new Date(item?.startDate).getUTCFullYear()} - ${new Date(item?.endDate).getUTCDate()} ${getMonthName(new Date(item?.endDate).getUTCMonth())} ${new Date(item?.endDate).getUTCFullYear()}`
                  : "All",
              };
            })
          );
          setTotalPages(response?.data?.totalPages);
        }
      }
    } catch (error) {
      console.log("error in fetching reports log ", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch reports",
        placement: "topRight",
      });
    }
  };

  return (
    <div
      style={{ minHeight: `${containerHeight}px` }}
      className={`bg-gray-100 transition-all duration-500 ${
        showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
      }`}
    >
      <style>
        {`
          .merchant-select .ant-select-selection-placeholder {
            text-align: center !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            top: 18% !important;
            width: 100% !important;
            padding-right: 30px !important;
          }
          .merchant-select .ant-select-selector {
            display: flex;
            align-items: flex-start !important;
            padding-top: 2px !important;
          }
        `}
      </style>
      <div className="p-7">
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[20px] md:text-[25px] font-[500]">Reports</h1>
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
              mode="multiple"
              style={{ width: "100%", height: "38px" }}
              placeholder="Please Select Merchant"
              onChange={fn_changeMerchant}
              options={[{ value: "", label: "All" }, ...merchantOptions]}
              maxTagCount="responsive"
              className="merchant-select"
            />
          </div>
          <div className="flex flex-col gap-[2px]">
            <p className="text-[13px] font-[500]">Select Bank</p>
            <Select
              style={{ width: "100%", height: "38px" }}
              placeholder="Please Select Bank"
              onChange={fn_changeBank}
              options={[{ value: "", label: "All" }, ...banksOption]}
            />
          </div>
          <div className="flex flex-col gap-[2px]">
            <p className="text-[13px] font-[500]">Select Status</p>
            <Select
              style={{ width: "100%", height: "38px" }}
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
                format="DD/MM/YYYY"
                placeholder={["Start Date", "End Date"]}
                allowClear={true}
              />
            </Space>
          </div>
        </div>
        <div className="flex justify-end mt-[20px]">
          <Button
            type="primary"
            className="h-[38px] w-[200px]"
            onClick={fn_submit}
            disabled={disableButton}
          >
            <FaDownload /> Download Report
          </Button>
        </div>
        <div className="w-full bg-[white] mt-[30px]">
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={{
              current: currentPage,
              total: totalPages * 10,
              onChange: (page) => setCurrentPage(page),
            }}
          />
        </div>
      </div>
      <Modal
        title="Select Download Format"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
      >
        <div className="flex justify-center gap-4 p-4">
          <Button type="primary" onClick={() => handleDownload("pdf")}>
            Download PDF
          </Button>
          <Button type="primary" onClick={() => handleDownload("excel")}>
            Download Excel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Reports;