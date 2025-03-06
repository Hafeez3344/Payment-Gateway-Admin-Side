import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Button, Modal, Input, Select, Switch, notification } from "antd";

import { FiTrash2 } from "react-icons/fi";
import { FaExclamationCircle } from "react-icons/fa";

import BACKEND_URL, { fn_getAllBanksData, fn_getMerchantApi } from "../../api/api";
import { CiEdit } from "react-icons/ci";
import { RiEditLine } from "react-icons/ri";

const Staff = ({ showSidebar }) => {

    const token = Cookies.get("token");
    const [open, setOpen] = useState(false);
    const [allStaffs, setAllStaffs] = useState([]);
    const containerHeight = window.innerHeight - 120;
    const [banksOption, setBanksOption] = useState([]);
    const [merchantOptions, setMerchantOption] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [loader, setLoader] = useState(false);
    const transactionTypeOptions = [{ label: "Manual Transaction", value: "manual" }, { label: "Direct Payment", value: "direct" }];

    const [staffForm, setStaffForm] = useState({
        userName: "", email: "", password: "", ledgerType: [], ledgerBank: [], ledgerMerchant: []
    });

    const [editForm, setEditForm] = useState({
        userName: "", email: "", password: "", ledgerType: [], ledgerBank: [], ledgerMerchant: [], id: ""
    });

    useEffect(() => {
        fn_getAllBanks();
        fn_getAllStaffs();
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
                return { value: item?._id, label: `${item?.bankName} - ${item?.bankName === "UPI" ? item?.iban : item?.accountHolderName}${item?.bankName !== "UPI" && ` - ${item?.iban}`}` }
            }));
        }
    };

    const fn_changeLedgerType = (value) => {
        const selectedValues = Array.isArray(value) ? value : [value];
        console.log(selectedValues)
        if (!editModal) {
            setStaffForm(() => ({ ...staffForm, ledgerType: selectedValues }));
        } else {
            setEditForm(() => ({ ...editForm, ledgerType: selectedValues }));
        }
    };

    const fn_getAllStaffs = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/adminStaff/getAll`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.status === 200) {
                setAllStaffs(response?.data?.data);
            }
        } catch (error) {
            console.log("error while fetching staff ", error);
        }
    }

    const fn_changeMerchant = (value) => {
        const selectedValues = Array.isArray(value) ? value : [value];
        if (!editModal) {
            setStaffForm(() => ({ ...staffForm, ledgerMerchant: selectedValues }));
        } else {
            setEditForm(() => ({ ...editForm, ledgerMerchant: selectedValues }));
        }
    };

    const fn_changeBank = (value) => {
        const selectedValues = Array.isArray(value) ? value : [value];
        if (!editModal) {
            setStaffForm(() => ({ ...staffForm, ledgerBank: selectedValues }));
        } else {
            setEditForm(() => ({ ...editForm, ledgerBank: selectedValues }));
        }
    };

    const handleStatusChange = async (staffId, checked) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/adminstaff/update/${staffId}`, { block: !checked }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.status) {
                if (response?.data?.status === "ok") {
                    fn_getAllStaffs();
                    notification.success({
                        message: "Staff Updated",
                        description: "Staff Updated Successfully",
                        placement: "topRight",
                    });
                }
            }
        } catch (error) {
            console.log("error in updating staff ", error);
            notification.error({
                message: "Error",
                description: error?.response?.data?.message || "Network Error",
                placement: "topRight",
            });
        }
    };

    const fn_deleteStaff = async (id) => {
        try {
            const response = await axios.delete(`${BACKEND_URL}/adminstaff/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.status) {
                if (response?.data?.status === "ok") {
                    fn_getAllStaffs();
                    notification.success({
                        message: "Staff Deleted",
                        description: "Staff Deleted Successfully",
                        placement: "topRight",
                    });
                }
            }
        } catch (error) {
            console.log("error in updating staff ", error);
            notification.error({
                message: "Error",
                description: error?.response?.data?.message || "Network Error",
                placement: "topRight",
            });
        }
    }

    const fn_submit = async () => {
        console.log(staffForm);
        setLoader(true);
        if (staffForm?.userName === "" || staffForm?.email === "" || staffForm?.password === "" || staffForm?.ledgerType?.length === 0 || staffForm?.ledgerMerchant?.length === 0 || staffForm?.ledgerBank?.length === 0) {
            return notification.error({
                message: "Error",
                description: "Fill Complete Form",
                placement: "topRight",
            });
        }
        try {
            const response = await axios.post(`${BACKEND_URL}/adminStaff/create`, staffForm, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.status === 200) {
                setOpen(false);
                setLoader(false);
                fn_getAllStaffs();
                notification.success({
                    message: "Staff Created",
                    description: "Staff Created Successfully",
                    placement: "topRight",
                });
            }
        } catch (error) {
            console.log("staff creation error ", error);
            setLoader(false);
            return notification.error({
                message: "Staff Creation Error",
                description: error?.response?.data?.message || "Network",
                placement: "topRight",
            })
        }
    };

    const fn_editStaff = async (staff) => {
        console.log(staff);
        setEditModal(true);
        setEditForm((prev) => ({
            ...prev,
            userName: staff?.userName,
            email: staff?.email,
            password: staff?.password,
            ledgerType: staff?.ledgerType,
            ledgerBank: staff?.ledgerBank,
            ledgerMerchant: staff?.ledgerMerchant,
            id: staff?._id
        }))
    };

    console.log("editForm ", editForm);

    const fn_update = async () => {
        if (editForm?.userName === "" || editForm?.email === "" || editForm?.password === "" || editForm?.ledgerType?.length === 0 || editForm?.ledgerMerchant?.length === 0 || editForm?.ledgerBank?.length === 0) {
            return notification.error({
                message: "Error",
                description: "Fill Complete Form",
                placement: "topRight",
            });
        }
        setLoader(true);
        try {
            const response = await axios.put(`${BACKEND_URL}/adminStaff/update/${editForm?.id}`, editForm, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.status === 200) {
                setOpen(false);
                setEditModal(false);
                setLoader(false);
                fn_getAllStaffs();
                notification.success({
                    message: "Staff Updated",
                    description: "Staff Updated Successfully",
                    placement: "topRight",
                });
            }
        } catch (error) {
            console.log("staff creation error ", error);
            setLoader(false);
            setEditModal(false);
            return notification.error({
                message: "Staff Creation Error",
                description: error?.response?.data?.message || "Network",
                placement: "topRight",
            })
        }
    }

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
                                    {allStaffs?.length > 0 ? allStaffs.map((staff, index) => (
                                        <tr key={staff.id} className="border">
                                            <td className="p-3 text-[13px]">{index + 1}</td>
                                            <td className="p-3 text-[13px]">{staff.userName}</td>
                                            <td className="p-3 text-[13px]">{staff.email}</td>
                                            <td className="p-3">
                                                <button className={`px-3 py-[5px] rounded-[20px] w-20 flex items-center justify-center text-[11px] font-[500] ${!staff.block ? "bg-[#10CB0026] text-[#0DA000]" : "bg-[#FF173D33] text-[#D50000]"}`}>
                                                    {!staff.block ? "Active" : "Inactive"}
                                                </button>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Switch
                                                        size="small"
                                                        className="min-w-[28px]"
                                                        checked={!staff.block}
                                                        onChange={(checked) => handleStatusChange(staff._id, checked)}
                                                    />
                                                    <Button
                                                        className="bg-blue-100 hover:bg-red-200 text-blue-600 rounded-full p-2 flex items-center justify-center min-w-[32px] h-[32px] border-none"
                                                        title="Edit"
                                                        onClick={() => fn_editStaff(staff)}
                                                    >
                                                        <RiEditLine size={16} />
                                                    </Button>
                                                    <Button
                                                        className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 flex items-center justify-center min-w-[32px] h-[32px] border-none"
                                                        title="Delete"
                                                        onClick={() => fn_deleteStaff(staff?._id)}
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr className="h-[50px]">
                                            <td
                                                colSpan="5"
                                                className="text-center text-[13px] font-[500] italic text-gray-600"
                                            >
                                                <FaExclamationCircle className="inline-block text-[18px] mt-[-2px] me-[10px]" />
                                                No Data Found
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
                title={<p className="text-[20px] font-[600]">Add New Staff</p>}
                open={open}
                onCancel={() => setOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={fn_submit} disabled={loader}>
                        {loader ? "Loading..." : "Save"}
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
                            <Input value={staffForm.userName} onChange={(e) => setStaffForm({ ...staffForm, userName: e.target.value })} placeholder="Enter username" />
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
                        <p className="text-sm font-medium mb-1">Select Transaction Type{" "}<span className="text-red-500">*</span></p>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{
                                width: '100%',
                            }}
                            placeholder="Please select Transaction Type"
                            onChange={fn_changeLedgerType}
                            options={transactionTypeOptions}
                        />
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Select Merchant{" "}<span className="text-red-500">*</span></p>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select Merchant"
                            onChange={fn_changeMerchant}
                            options={merchantOptions}
                        />
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Select Banks{" "}<span className="text-red-500">*</span></p>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please Select Banks"
                            onChange={fn_changeBank}
                            options={banksOption}
                        />
                    </div>
                </div>
            </Modal>

            {/* edit form */}
            <Modal
                title={<p className="text-[20px] font-[600]">Edit Staff</p>}
                open={editModal}
                onCancel={() => setEditModal(false)}
                footer={[
                    <Button key="cancel" onClick={() => setEditModal(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={fn_update} disabled={loader}>
                        {loader ? "Loading..." : "Update"}
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
                            <Input value={editForm.userName} onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })} placeholder="Enter username" />
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-1">
                                Email <span className="text-red-500">*</span>
                            </p>
                            <Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="Enter email address" />
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">
                            Password <span className="text-red-500">*</span>
                        </p>
                        <Input.Password value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} placeholder="Enter password" />
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Select Transaction Type{" "}<span className="text-red-500">*</span></p>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{
                                width: '100%',
                            }}
                            placeholder="Please select Transaction Type"
                            onChange={fn_changeLedgerType}
                            value={editForm.ledgerType}
                            options={transactionTypeOptions}
                        />
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Select Merchant{" "}<span className="text-red-500">*</span></p>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select Merchant"
                            onChange={fn_changeMerchant}
                            value={editForm.ledgerMerchant}
                            options={merchantOptions}
                        />
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Select Banks{" "}<span className="text-red-500">*</span></p>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please Select Banks"
                            onChange={fn_changeBank}
                            value={editForm.ledgerBank}
                            options={banksOption}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Staff;
