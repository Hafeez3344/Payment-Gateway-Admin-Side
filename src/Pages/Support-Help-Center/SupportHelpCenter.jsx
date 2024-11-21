import React, { useState, useEffect } from "react";
import { FiEye, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Input } from "antd";

const SupportHelpCenter = ({ showSidebar }) => {
  const containerHeight = window.innerHeight - 120;
  const [merchant, setMerchant] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const { TextArea } = Input;
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const transactions = [
    {
      id: "9780924782474",
      title: "Payment Issue",
      time: "11:30 AM",
      amount: "₹ 5000",
      merchantName: "Shubh Exchange",
      status: "Verified",
      ticketOpen: "01 Jan 2024, 11:30 AM",
      ticketClose: "02 Jan 2024, 03:45 PM",
    },
    {
      id: "9879827354233",
      title: "Refund Request",
      time: "10:55 AM",
      amount: "₹ 2400",
      merchantName: "Book Fair",
      status: "Declined",
      ticketOpen: "02 Jan 2024, 10:00 AM",
      ticketClose: "02 Jan 2024, 02:15 PM",
    },
    {
      id: "9780924782474",
      title: "Payment Issue",
      time: "11:30 AM",
      amount: "₹ 5000",
      merchantName: "Shubh Exchange",
      status: "Verified",
      ticketOpen: "01 Jan 2024, 11:30 AM",
      ticketClose: "02 Jan 2024, 03:45 PM",
    },
    {
      id: "9879827354233",
      title: "Refund Request",
      time: "10:55 AM",
      amount: "₹ 2400",
      merchantName: "Book Fair",
      status: "Declined",
      ticketOpen: "02 Jan 2024, 10:00 AM",
      ticketClose: "02 Jan 2024, 02:15 PM",
    },
  ];

  const getStatusClass = (status) => {
    if (status === "Verified")
      return "bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium";
    if (status === "Declined")
      return "bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium";
    return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium";
  };

  const handleSearch = () => {
    const filtered = transactions.filter((transaction) => {
      const isMerchantMatch =
        !merchant || transaction.merchantName === merchant;

      const isSearchMatch =
        !searchQuery ||
        transaction.merchantName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return isMerchantMatch && isSearchMatch;
    });
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [merchant, searchQuery]);

  useEffect(() => {
    window.scroll(0, 0);
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
    <h1 className="text-[25px] font-[500]">Support / Help Center</h1>
    <p
      onClick={() => navigate("/SystemConfigurationIntegration")}
      className="text-[#7987A1] text-[13px] md:text-[15px] font-[400] cursor-pointer"
    >
      Dashboard - Data Table
    </p>
  </div>
  <div className="bg-white rounded-lg p-4">
    <div className="flex flex-col md:flex-row items-center justify-between pb-3">
      <div>
        <p className="text-black font-medium text-lg">Tickets</p>
      </div>
      <Button type="primary" onClick={() => setOpen(true)}>
        Add New Ticket
      </Button>
      <Modal
        centered
        width={600}
        title={<p className="text-[16px] font-[700]">Add New Ticket</p>}
        footer={
          <Button className="flex start px-10" type="primary">
            Save
          </Button>
        }
        open={open}
        onCancel={() => setOpen(false)}
      >
        <p className="text-[12px] font-[500] pb-1">Subject</p>
        <Input className="text-[12px]" placeholder="Choose a subject" />
        <p className="text-[12px] font-[500] pt-4 pb-1">Description</p>
        <TextArea
          className="text-[12px]"
          rows={6}
          placeholder="Please describe your issue"
          maxLength={50}
        />
      </Modal>
    </div>
    <div className="overflow-x-auto"> {/* Added overflow-x-auto for horizontal scrolling */}
      <div className="bg-white rounded-lg">
        <div className="overflow-hidden rounded-lg border border-gray-300">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Status</th>
                <th className="p-4">Title</th>
                <th className="p-4">Ticket Open</th>
                <th className="p-4">Ticket Close</th>
                <th className="p-4 cursor-pointer">Action</th>
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
                    <td className="p-4">
                      <span className={getStatusClass(transaction.status)}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="p-4 text-[11px] font-[700] text-[#000000B2]">
                      {transaction.title}
                    </td>
                    <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                      {transaction.ticketOpen}
                    </td>
                    <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                      {transaction.ticketClose}
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default SupportHelpCenter;
