import React, { useState } from "react";
import { Button, Modal, Input, Select, Switch } from "antd";

import { FiTrash2 } from "react-icons/fi";

const Staff = ({ showSidebar }) => {

    const transactionTypeOptions = [
        { label: "Manual Transaction", value: "manual" },
        { label: "Direct Payment", value: "direct" },
    ];
    const [open, setOpen] = useState(false);
    const containerHeight = window.innerHeight - 120;
    const [staffList, setStaffList] = useState([
        {
            id: 1,
            userName: 'John Doe',
            email: 'john@example.com',
            block: false
        },
        {
            id: 2,
            userName: 'Jane Smith',
            email: 'jane@example.com',
            block: true
        }
    ]);

    const [staffForm, setStaffForm] = useState({
        username: "", email: "", password: "", ledgerType: [], ledgerBank: [], ledgerMerchant: []
    });

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    const handleStatusChange = (staffId, checked) => {
        setStaffList(prev =>
            prev.map(staff =>
                staff.id === staffId
                    ? { ...staff, block: !checked }
                    : staff
            )
        );
    };

    return (
        <>
            <div
                className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"}`}
                style={{ minHeight: `${containerHeight}px` }}
            >
                <div className="p-7">
                    <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
                        <h1 className="text-[25px] font-[500]">Staff Management</h1>
                        <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
                            Dashboard - Staff Table
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                        <div className="p-3 pt-0 flex flex-col md:flex-row items-center justify-between border-b space-y-4 md:space-y-0">
                            <h2 className="text-black font-medium text-lg">
                                Staff Information
                            </h2>
                            <Button
                                type="primary"
                                onClick={() => setOpen(true)}
                                className="w-full md:w-auto"
                            >
                                Add Staff
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border">
                                <thead className="bg-[#ECF0FA]">
                                    <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                                        <th className="p-3 text-[13px] font-[600]">Sr No.</th>
                                        <th className="p-3 text-[13px] font-[600]">Name</th>
                                        <th className="p-3 text-[13px] font-[600]">Email</th>
                                        <th className="pl-7 text-[13px] font-[600]">Status</th>
                                        <th className="p-3 text-[13px] font-[600] text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staffList.map((staff, index) => (
                                        <tr key={staff.id} className="border">
                                            <td className="p-3 text-[13px]">{index + 1}</td>
                                            <td className="p-3 text-[13px]">{staff.userName}</td>
                                            <td className="p-3 text-[13px]">{staff.email}</td>
                                            <td className="p-3">
                                                <button
                                                    className={`px-3 py-[5px] rounded-[20px] w-20 flex items-center justify-center text-[11px] font-[500] ${!staff.block
                                                        ? "bg-[#10CB0026] text-[#0DA000]"
                                                        : "bg-[#FF173D33] text-[#D50000]"
                                                        }`}
                                                >
                                                    {!staff.block ? "Active" : "Inactive"}
                                                </button>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Switch
                                                        size="small"
                                                        className="min-w-[28px]"
                                                        checked={!staff.block}
                                                        onChange={(checked) => handleStatusChange(staff.id, checked)}
                                                    />
                                                    <Button
                                                        className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 flex items-center justify-center min-w-[32px] h-[32px] border-none"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title={<p className="text-[20px] font-[600]">Add New Staff</p>}
                open={open}
                onCancel={() => setOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary">
                        Save
                    </Button>,
                ]}
                width={600}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium mb-1">
                                Username <span className="text-red-500">*</span>
                            </p>
                            <Input value={staffForm.username} onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })} placeholder="Enter username" />
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-1">
                                Email <span className="text-red-500">*</span>
                            </p>
                            <Input value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} placeholder="Enter email address" />
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">
                            Password <span className="text-red-500">*</span>
                        </p>
                        <Input.Password value={staffForm.password} onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })} placeholder="Enter password" />
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Selected Transaction Type{" "}<span className="text-red-500">*</span></p>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{
                                width: '100%',
                            }}
                            placeholder="Please select Transaction Type"
                            onChange={handleChange}
                            options={transactionTypeOptions}
                        />
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">
                            Staff Type <span className="text-red-500">*</span>
                        </p>
                        <Select
                            className="w-full"
                            placeholder="Select Staff Type"
                        >
                            <Select.Option value="major">Major Staff</Select.Option>
                            <Select.Option value="minor">Minor Staff</Select.Option>
                            <Select.Option value="staff">Merchant</Select.Option>
                        </Select>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Staff;
