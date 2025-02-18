import React, { useState, useEffect } from "react";
import { TbArrowBack } from "react-icons/tb";
import { FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Input, notification } from "antd";
import { fn_getAllTicketsApi, fn_createTicketApi, fn_updateTicketStatusApi } from "../../api/api";

const SupportHelpCenter = ({ authorization, showSidebar }) => {
  const containerHeight = window.innerHeight - 120;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { TextArea } = Input;

  const chatMessages = [
    {
      sender: "Hafeez",
      message: "Hello, I have an issue with my payment.",
      timestamp: "10:30 AM"
    },
    {
      sender: "Admin",
      message: "Hi Hafeez, I'll help you with that. Can you describe the issue?",
      timestamp: "10:31 AM"
    },
    {
      sender: "Hafeez",
      message: "My transaction failed but amount was deducted",
      timestamp: "10:32 AM"
    },
    {
      sender: "Admin",
      message: "Let me check that for you. Please provide your transaction ID.",
      timestamp: "10:33 AM"
    },
    {
      sender: "Admin",
      message: "Hi Hafeez, I'll help you with that. Can you describe the issue?",
      timestamp: "10:31 AM"
    },
    {
      sender: "Hafeez",
      message: "My transaction failed but amount was deducted",
      timestamp: "10:32 AM"
    },
    {
      sender: "Admin",
      message: "Let me check that for you. Please provide your transaction ID.",
      timestamp: "10:33 AM"
    },
    {
      sender: "Hafeez",
      message: "My transaction failed but amount was deducted",
      timestamp: "10:32 AM"
    },
    {
      sender: "Admin",
      message: "Let me check that for you. Please provide your transaction ID.",
      timestamp: "10:33 AM"
    },
    {
      sender: "Admin",
      message: "Hi Hafeez, I'll help you with that. Can you describe the issue?",
      timestamp: "10:31 AM"
    },
    {
      sender: "Hafeez",
      message: "My transaction failed but amount was deducted",
      timestamp: "10:32 AM"
    },
  ];

  const getStatusClass = (status) => {
    const statusClasses = {
      "New Ticket":
        "bg-[#00000080] text-white px-2  rounded-full text-[11px] font-[500] ",
      "In Progress":
        "bg-[#0864E833] text-[#0864E8] px-2  rounded-full text-[11px] font-[500] ",
      Solved:
        "bg-green-100 text-green-800 px-[18px]  rounded-full text-[11px] font-[500] ",
    };
    return (
      statusClasses[status] ||
      "bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium"
    );
  };

  const handleSearch = () => {
    const filtered = filteredTransactions.filter((ticket) =>
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTransactions(filtered);
  };

  const handleChatOpen = (ticket) => {
    console.log("Selected Ticket:", ticket);
    setSelectedTicket(ticket);
    setChatOpen(true);
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      console.log("Fetching tickets...");
      const response = await fn_getAllTicketsApi();
      console.log("Get tickets response:", response);

      if (response.status && Array.isArray(response.data)) {
        const formattedTickets = response.data.map(ticket => ({
          id: ticket._id,
          title: ticket.title,
          status: ticket.status || "New Ticket",
          ticketOpen: ticket.ticketOpen,
          createdAt: new Date(ticket.createdAt).toLocaleString(),
          message: ticket.message,
          type: ticket.type,
        }));
        console.log("Formatted tickets:", formattedTickets);
        setFilteredTransactions(formattedTickets);
      } else {
        console.error("Invalid tickets response:", response);
        notification.error({
          message: "Error",
          description: "Failed to fetch tickets",
          placement: "topRight"
        });
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
    if (!authorization) {
      navigate("/login")
    }
  }, [searchQuery]);

  useEffect(() => {
    if (authorization) {
      fetchTickets();
      const interval = setInterval(fetchTickets, 5000);
      return () => clearInterval(interval);
    }
  }, [authorization]);

  useEffect(() => {
    if (chatOpen) {
      const messageContainer = document.getElementById('chat-messages');
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }
  }, [chatOpen]);

  const handleCreateTicket = async () => {
    // ... existing ticket creation logic ...
  };

  const handleMarkAsSolved = async (ticketId) => {
    try {
      const updateData = {
        status: "Solved",
        ticketOpen: false
      };

      console.log("Updating ticket:", { ticketId, updateData });
      const response = await fn_updateTicketStatusApi(ticketId, updateData);
      console.log("Update response:", response);

      if (response.status) {
        notification.success({
          message: "Success",
          description: "Ticket marked as solved",
          placement: "topRight",
        });
        fetchTickets(); // Refresh the tickets list
      } else {
        throw new Error(response.message || "Failed to update ticket");
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      notification.error({
        message: "Error",
        description: error.message || "Failed to update ticket",
        placement: "topRight",
      });
    }
  };

  const getTicketDisplayDate = (ticket) => {
    if (ticket.status === "Solved") {
      return "Closed";
    }
    return ticket.createdAt;
  };

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
        }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[25px] font-[500]">Support / Help Center</h1>
          <p
            className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]"
          >
            Dashboard - Data Table
          </p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-black text-[15px] font-[600]">Tickets</p>
            <Button type="primary" onClick={() => setOpen(true)}>
              Add New Ticket
            </Button>
          </div>
          <Modal
            centered
            width={600}
            title={<p className="text-[16px] font-[700]">Add New Ticket</p>}
            footer={
              <Button className="px-10" type="primary">
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
          <div className="bg-white rounded-lg mt-4">
            <div className="overflow-x-auto rounded-lg border border-gray-300">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                    <th className="p-4 whitespace-nowrap">Ticket ID</th>
                    <th className="p-4 whitespace-nowrap">Status</th>
                    <th className="p-4 whitespace-nowrap">Title</th>
                    <th className="p-4 whitespace-nowrap">Ticket Open</th>
                    {/* <th className="p-4 whitespace-nowrap">Ticket Close</th> */}
                    <th className="p-4 whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="text-gray-800 text-sm border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-4 text-[11px] font-[600] whitespace-nowrap">
                          {ticket.id}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span
                            className={`${getStatusClass(
                              ticket.status
                            )} inline-block`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="p-4 text-[11px] font-[600] whitespace-nowrap text-ellipsis overflow-hidden">
                          {ticket.title}
                        </td>
                        <td className="p-4 text-[11px] font-[600] whitespace-nowrap">
                          {getTicketDisplayDate(ticket)}
                        </td>
                        <td className="p-3 flex space-x-2 whitespace-nowrap">
                          <button
                            className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                            onClick={() => handleChatOpen(ticket)}
                          >
                            <TbArrowBack />
                          </button>
                          <button
                            className="bg-green-100 text-green-600 rounded-full px-2 py-2"
                            onClick={() => handleMarkAsSolved(ticket.id)}
                            disabled={ticket.status === "Solved"}
                          >
                            <FiCheck />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">
                        No tickets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        centered
        width={500}
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              {selectedTicket?.title?.[0]}
            </div>
            <div>
              <p className="text-[16px] font-[600]">{selectedTicket?.title}</p>
              <p className="text-[12px] text-gray-500">Ticket ID: {selectedTicket?.id}</p>
            </div>
          </div>
        }
        open={chatOpen}
        onCancel={() => setChatOpen(false)}
        footer={
          <div className="flex gap-2">
            <Input placeholder="Type your message" className="flex-1" />
            <Button type="primary">Send</Button>
          </div>
        }
      >
        <div
          className="h-[400px] overflow-y-auto pr-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db transparent',
          }}
          id="chat-messages"
        >
          <style>
            {`
              #chat-messages::-webkit-scrollbar {
                width: 6px;
              }
              #chat-messages::-webkit-scrollbar-track {
                background: transparent;
              }
              #chat-messages::-webkit-scrollbar-thumb {
                background-color: #d1d5db;
                border-radius: 20px;
              }
            `}
          </style>
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "Admin" ? "justify-start" : "justify-end"} mb-4`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${msg.sender === "Admin"
                  ? "bg-gray-100"
                  : "bg-blue-500 text-white"
                  }`}
              >
                <p className="text-[13px]">{msg.message}</p>
                <p className="text-[10px] mt-1 opacity-70">{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default SupportHelpCenter;