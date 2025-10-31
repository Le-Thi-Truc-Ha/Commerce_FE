import React, { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Tag, Spin } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import type { Customer, CustomerDetail, OrderCustomer } from "../../interfaces/adminInterface";
import { customerApi } from "../../services/adminService";
import { messageService } from "../../interfaces/appInterface";
import dayjs from "dayjs";
import "./ProductAdmin.scss";


const CustomerAdmin: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerDetail, setCustomerDetail] = useState<CustomerDetail>();
    const [orders, setOrders] = useState<OrderCustomer[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0});
    const [paginationOrders, setPaginationOrders] = useState({ current: 1, pageSize: 10, total: 0});

    const fetchCustomers = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            const res = await customerApi.getAll(page, limit);
            const { result, total } = res.data;
            setCustomers(result);
            setPagination({ current: page, pageSize: limit, total });
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải danh sách khách hàng!");
        } finally {
            setLoading(false);
        }
    };

    const fetchDetail = async (id: number) => {
        try {
            const res = await customerApi.getDetail(id);
            const customer = res.data;
            setCustomerDetail(customer);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải thông tin khách hàng!");
        }
    };

    const fetchOrders = async (id: number, page = 1, limit = 10) => {
        try {
            const res = await customerApi.getOrders(id, page, limit);
            const { orders, total } = res.data;
            setOrders(orders.orders);
            setPaginationOrders({ current: page, pageSize: limit, total });
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải danh sách đơn hàng của khách hàng!");
        }
    }

    useEffect(() => {
        fetchCustomers(pagination.current, pagination.pageSize);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchCustomers(pagination.current, pagination.pageSize);
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    const openModal = async (record: Customer) => {
        setIsModalOpen(true);
        setCustomerDetail(undefined);
        setOrders([]);
        setLoadingModal(true);
        try {
            await Promise.all([
                fetchDetail(record.id),
                fetchOrders(record.id, pagination.current, pagination.pageSize)
            ]);
        } finally {
            setLoadingModal(false);
        }
    };

    const getStatusColor = (statusName: string): string => {
        const normalized = statusName.trim().toLowerCase();
        if (normalized.includes("đã hủy")) return "red";
        if (normalized.includes("chờ") || normalized.includes("xác nhận")) return "orange";
        if (normalized.includes("đang giao")) return "blue";
        if (normalized.includes("đã giao")) return "green";
        if (normalized.includes("hoàn")) return "purple";
        return "default";
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", width: 80, align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Customer, b: Customer) => a.id - b.id
        },
        { title: "Tên khách hàng", dataIndex: "fullName", key: "fullName", align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Customer, b: Customer) => a.fullName.localeCompare(b.fullName)
        },
        { title: "Email", dataIndex: "email", key: "email", align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Customer, b: Customer) => a.email.localeCompare(b.email)
        },
        { title: "Giới tính", key: "gender", align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Customer, b: Customer) => (a.gender ?? "").localeCompare(b.gender ?? ""),
            render: (_: any, record: Customer) => (record.gender ?? "")
        },
        { title: "Ngày sinh", dataIndex: "dob", key: "dob", align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: any, b: any) => {
                const da = a.dob ? new Date(a.dob).getTime() : 0;
                const db = b.dob ? new Date(b.dob).getTime() : 0;
                return da - db;
            },
            render: (d?: string | null) => (d ? dayjs(d).format("DD/MM/YYYY") : ""),
        },
        { title: "Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber", align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Customer, b: Customer) => (a.phoneNumber ?? "").localeCompare(b.phoneNumber ?? ""),
            render: (_: any, record: Customer) => (record.phoneNumber ?? "")
        },
        {
            title: "Trạng thái",
            key: "status",
            align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Customer, b: Customer) => a.status - b.status,
            render: (_: any, record: any) => (
                <Tag style={{ width: 120, textAlign: "center" }} color={record.status === 1 ? "green" : "red"}>
                    {record.status === 1 ? "Hoạt động" : "Không hoạt động"}
                </Tag>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center" as const,
            render: (_: any, record: any) => (
                <Button
                icon={<EyeOutlined />}
                type="link"
                onClick={() => openModal(record)}
                >
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    const columnsAddress = [
        {
            title: "Tên người nhận",
            dataIndex: "name",
            align: "center" as const,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            align: "center" as const,
        },
        {
            title: "Địa chỉ chi tiết",
            dataIndex: "address",
            align: "center" as const,
            render: (addr: string) => addr.replace(/=/g, ", ")
        },
        {
            title: "Mặc định",
            dataIndex: "isDefault",
            align: "center" as const,
            render: (v: boolean) => v 
                ? (
                    <Tag color="blue">Mặc định</Tag>
                ) : (
                    <Tag>Phụ</Tag>
                ),
        }
    ];

    const columnsOrder = [
        { title: "Mã đơn", dataIndex: "id", align: "center" as const },
        {   title: "Ngày đặt", dataIndex: "orderDate", align: "center" as const,
            render: (d: string) => dayjs(d).format("DD/MM/YYYY HH:mm"),
        },
        {   title: "Trạng thái",
            dataIndex: ["orderStatus", "name"],
            align: "center" as const,
            render: (status: string) => (
                <Tag
                    style={{ width: 120, textAlign: "center"}}
                    color={getStatusColor(status)}
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: "Tổng tiền",
            align: "center" as const,
            render: (_: any, record: any) => `${record?.bills?.[0]?.total?.toLocaleString?.("vi-VN") ?? "0"}đ`,
        }
    ];

    return (
        <div className="p-6">
            <div className="header">
                <h2>Quản lý khách hàng</h2>
            </div>

            <div className="filter-bar mb-4 flex gap-2 filter">
                <Input
                    className="input"
                    placeholder="Tìm theo tên, email hoặc SĐT..."
                    value={search}
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 400 }}
                />
            </div>

            <Table
                dataSource={customers}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total
                }}
                onChange={(newPag) => {
                    fetchCustomers(newPag.current, newPag.pageSize);
                }}
            />

            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={1000}
            >
                <Spin spinning={loadingModal} tip="Đang tải dữ liệu khách hàng...">
                    {customerDetail ? (
                    <div className="customer-detail">
                        <h3 className="mt-4">Địa chỉ</h3>
                        <Table
                        size="small"
                        dataSource={customerDetail.addresses.map((addr, index) => ({
                            ...addr,
                            isDefault: index === 0,
                        }))}
                        pagination={false}
                        rowKey="id"
                        columns={columnsAddress}
                        />

                        <h3 className="mt-5">Đơn hàng</h3>
                        <Table
                        size="small"
                        dataSource={orders}
                        columns={columnsOrder}
                        rowKey="id"
                        pagination={{
                            current: paginationOrders.current,
                            pageSize: paginationOrders.pageSize,
                            total: paginationOrders.total,
                        }}
                        onChange={(newPag) => {
                            fetchOrders(customerDetail.id, newPag.current, newPag.pageSize);
                        }}
                        />
                    </div>
                    ) : (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <Spin tip="Đang tải dữ liệu..." />
                    </div>
                    )}
                </Spin>
            </Modal>
        </div>
    );
};

export default CustomerAdmin;
