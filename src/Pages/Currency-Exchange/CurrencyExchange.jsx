import React, { useState } from "react";
import { Button, Modal, Input, Form, notification, Select } from "antd";
import { FaExclamationCircle } from "react-icons/fa";

const staticCurrencies = [
    {
        name: 'USD (US Dollar)',
        rate: '82.50',
        exchange: '82.00'
    },
    {
        name: 'EUR (Euro)',
        rate: '89.75',
        exchange: '89.25'
    },
    {
        name: 'GBP (British Pound)',
        rate: '104.30',
        exchange: '103.80'
    },
    {
        name: 'AUD (Australian Dollar)',
        rate: '54.25',
        exchange: '53.75'
    },
    {
        name: 'CAD (Canadian Dollar)',
        rate: '61.40',
        exchange: '60.90'
    }
];

const currencyOptions = [
    { value: 'USD (US Dollar)', label: 'USD (US Dollar)' },
    { value: 'EUR (Euro)', label: 'EUR (Euro)' },
    { value: 'GBP (British Pound)', label: 'GBP (British Pound)' },
    { value: 'JPY (Japanese Yen)', label: 'JPY (Japanese Yen)' },
    { value: 'AUD (Australian Dollar)', label: 'AUD (Australian Dollar)' },

];

const CurrencyExchange = ({ authorization, showSidebar }) => {
    const containerHeight = window.innerHeight - 120;
    const [currencies, setCurrencies] = useState(staticCurrencies);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleAddCurrency = () => {
        setIsModalOpen(true);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            const newCurrency = {
                name: values.currency,
                rate: values.rate,
                exchange: values.exchange
            };
            setCurrencies([...currencies, newCurrency]);
            notification.success({
                message: 'Success',
                description: 'Currency added successfully',
            });
            setIsModalOpen(false);
            form.resetFields();
        });
    };

    return (
        <>
            <div
                className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
                    }`}
                style={{ minHeight: `${containerHeight}px` }}
            >
                <div className="p-7">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
                        <h1 className="text-[25px] font-[500]">Currency Exchange</h1>
                        <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
                            Dashboard - Currency Exchange
                        </p>
                    </div>

                    {/* Add Currency button outside table */}
                    <div className="flex justify-end mb-4">
                        <Button type="primary" onClick={handleAddCurrency}>
                            Add Currency
                        </Button>
                    </div>

                    <div className="flex flex-col gap-7 md:flex-row bg-gray-100">
                        <div className="w-full bg-white rounded-lg shadow-md border">
                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#ECF0FA]">
                                        <tr>
                                            <th className="p-4 text-[13px] font-[600]">Currency</th>
                                            <th className="p-4 text-[13px] font-[600]">Currency Rate (INR)</th>
                                            <th className="p-4 text-[13px] font-[600]">Exchange (INR)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currencies?.length > 0 ? (
                                            currencies.map((currency, index) => (
                                                <tr
                                                    key={index}
                                                    className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                                >
                                                    <td className="p-4 text-[13px]">{currency.name}</td>
                                                    <td className="p-4 text-[13px]">{currency.rate}</td>
                                                    <td className="p-4 text-[13px]">{currency.exchange}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4 text-gray-500">
                                                    <FaExclamationCircle className="inline-block mr-2" />
                                                    No currencies found
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

            <Modal
                title="Add New Currency"
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Add Currency"
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item
                        label="Currency"
                        name="currency"
                        rules={[{ required: true, message: 'Please select a currency' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a currency"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={currencyOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Currency Rate (INR)"
                        name="rate"
                        rules={[{ required: true, message: 'Please enter currency rate' }]}
                    >
                        <Input placeholder="Enter currency rate" />
                    </Form.Item>

                    <Form.Item
                        label="Exchange (INR)"
                        name="exchange"
                        rules={[{ required: true, message: 'Please enter exchange rate' }]}
                    >
                        <Input placeholder="Enter exchange rate" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CurrencyExchange;
