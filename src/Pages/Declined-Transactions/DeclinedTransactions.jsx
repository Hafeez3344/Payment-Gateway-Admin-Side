import React, { useState, useEffect } from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CanaraBank from "../../assets/CanaraBank.svg";
import BankOfBarodaLogo from "../../assets/BankOfBarodaLogo.svg";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";

const DeclinedTransactions = ({ authorization, showSidebar }) => {
  const containerHeight = window.innerHeight - 120;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [merchant, setMerchant] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const transactions = [
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      iban: "DE6820050000",
      date: "2024-01-01",
      time: "11:30 AM",
      amount: "₹ 5000",
      merchantName: "Shubh Exchange",
      status: "Declined",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      iban: "BM7355353124",
      date: "2024-01-16",
      time: "10:55 AM",
      amount: "₹ 2400",
      merchantName: "Book Fair",
      status: "Declined",
    },
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      iban: "DE6820050000",
      date: "2024-01-01",
      time: "11:30 AM",
      amount: "₹ 5000",
      merchantName: "Shubh Exchange",
      status: "Declined",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      iban: "BM7355353124",
      date: "2024-01-16",
      time: "10:55 AM",
      amount: "₹ 2400",
      merchantName: "Book Fair",
      status: "Declined",
    },
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      iban: "DE6820050000",
      date: "2024-01-01",
      time: "11:30 AM",
      amount: "₹ 5000",
      merchantName: "Shubh Exchange",
      status: "Declined",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      iban: "BM7355353124",
      date: "2024-01-16",
      time: "10:55 AM",
      amount: "₹ 2400",
      merchantName: "Book Fair",
      status: "Declined",
    },
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      iban: "DE6820050000",
      date: "2024-01-01",
      time: "11:30 AM",
      amount: "₹ 5000",
      merchantName: "Shubh Exchange",
      status: "Declined",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      iban: "BM7355353124",
      date: "2024-01-16",
      time: "10:55 AM",
      amount: "₹ 2400",
      merchantName: "Book Fair",
      status: "Declined",
    },
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      iban: "DE6820050000",
      date: "2024-01-01",
      time: "11:30 AM",
      amount: "₹ 5000",
      merchantName: "Shubh Exchange",
      status: "Declined",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      iban: "BM7355353124",
      date: "2024-01-16",
      time: "10:55 AM",
      amount: "₹ 2400",
      merchantName: "Book Fair",
      status: "Declined",
    },
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      iban: "DE6820050000",
      date: "2024-01-01",
      time: "11:30 AM",
      amount: "₹ 5000",
      merchantName: "Shubh Exchange",
      status: "Declined",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      iban: "BM7355353124",
      date: "2024-01-16",
      time: "10:55 AM",
      amount: "₹ 2400",
      merchantName: "Book Fair",
      status: "Declined",
    },
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      iban: "DE6820050000",
      date: "2024-01-01",
      time: "11:30 AM",
      amount: "₹ 5000",
      merchantName: "Shubh Exchange",
      status: "Declined",
    },
  ];

  const bankImages = {
    "Canara Bank": CanaraBank,
    "Bank of Baroda": BankOfBarodaLogo,
  };

  const getStatusClass = (status) => {
    if (status === "Approved")
      return "bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium";
    if (status === "Declined")
      return "bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium";
    return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium";
  };

  const handleSearch = () => {
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const isDateInRange =
        (!startDate || transactionDate >= startDate) &&
        (!endDate || transactionDate <= endDate);

      const isMerchantMatch =
        !merchant || transaction.merchantName === merchant;

      const isSearchMatch =
        !searchQuery ||
        transaction.merchantName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return isDateInRange && isMerchantMatch && isSearchMatch;
    });
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [startDate, endDate, merchant, searchQuery]);

  useEffect(() => {
    window.scroll(0, 0);
    if (!authorization){
      navigate("/login")
    }
  }, []);

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${
        showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
      }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[25px] font-[500]">Declined Transactions</h1>
          <p
            onClick={() => navigate("/MerchantManagement")}
            className="text-[#7987A1] text-[13px] md:text-[15px] font-[400] cursor-pointer"
          >
            Dashboard - Data Table
          </p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="flex flex-col md:flex-row items-center justify-between pb-3">
            <div>
              <p className="text-black font-medium text-lg">
                List of Declined Transactions
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
              <div className="flex border items-center rounded-md">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="border-none px-2 text-[13px] w-24 text-gray-700 focus:outline-none"
                  placeholderText="Start Date"
                  dateFormat="yyyy-MM-dd"
                />
                <span className="py-1 text-[13px] font-[600]">To</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="border-none px-2 text-[13px] w-24 text-gray-700 focus:outline-none"
                  placeholderText="End Date"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div className="flex flex-col w-full md:w-40">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border w-full border-gray-300 rounded py-1 text-[12px] pl-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col w-full md:w-40">
                <select
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="border border-gray-300 rounded py-1 text-[12px] text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option className="text-[10px] text-gray-400" value="">
                    Merchant
                  </option>
                  <option
                    className="text-[10px] text-gray-400"
                    value="Shubh Exchange"
                  >
                    Shubh Exchange
                  </option>
                  <option
                    className="text-[10px] text-gray-400"
                    value="Book Fair"
                  >
                    Book Fair
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="w-full border-t-[1px] border-[#DDDDDD80] hidden sm:block mb-4"></div>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                  <th className="p-4">TRN-ID</th>
                  <th className="p-4">BANK NAME</th>
                  <th className="p-4">IBAN</th>
                  <th className="p-4">DATE</th>
                  <th className="p-4">AMOUNT</th>
                  <th className="p-4">MERCHANT NAME</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 cursor-pointer">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="text-gray-800 text-sm border-b"
                    >
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {transaction.id}
                      </td>
                      <td className="p-4 flex items-center">
                        <img
                          src={bankImages[transaction.bankName]}
                          alt={`${transaction.bankName} Logo`}
                          className="w-6 h-6 rounded-full mr-2" // Adjusted to add margin-right
                        />
                        <span className="text-[12px] font-[700] text-black whitespace-nowrap">
                          {transaction.bankName}
                        </span>
                      </td>

                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {transaction.iban}
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {transaction.date}
                      </td>
                      <td className="p-4 text-[11px] font-[700] text-[#000000B2]">
                        {transaction.amount}
                      </td>
                      <td className="p-4 text-[11px] font-[700] text-[#0864E8]">
                        {transaction.merchantName}
                      </td>
                      <td className="p-4 text-[11px] font-[500]">
                        <span className={getStatusClass(transaction.status)}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="p-4 flex space-x-2">
                        <button
                          className="bg-blue-100 text-blue-600 rounded-full px-2 py-2 mx-2"
                          title="View"
                        >
                          <FiEye />
                        </button>
                        <button
                          className="bg-green-100 text-green-600 rounded-full px-2 py-2 mx-2"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="bg-red-100 text-red-600 rounded-full px-2 py-2 mx-2"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col md:flex-row items-center p-4 justify-between space-y-4 md:space-y-0">
            <p className="text-[13px] font-[500] text-gray-500 text-center md:text-left">
              Showing 1 to 10 of 17 entries
            </p>
            <Pagination
              className="self-center md:self-auto"
              onChange={() => navigate("")}
              defaultCurrent={1}
              total={50}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclinedTransactions;
