import React, { useState, useEffect } from "react";
import {Card, Table, Input, DatePicker, Button, Tag, Space, Modal, Descriptions, List, Divider, Select, Timeline, Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { EyeOutlined, PrinterOutlined, ReloadOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import type { OrderBill,  Order, Status, OrderHistory } from "../../interfaces/adminInterface";
import { orderApi } from "../../services/adminService";
import { messageService } from "../../interfaces/appInterface";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ProductAdmin.scss";

dayjs.extend(advancedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const OrderAdmin: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [status, setStatus] = useState<Status[]>([]);
    const [histories, steHistories] = useState<OrderHistory[]>([]);
    const [orderBill, setOrderBill] = useState<OrderBill>();
    const [selectedStatus, setSelectedStatus] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([ null, null ]);
    const [search, setSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState<number | null>(null);
    const [currentStatus, setCurrentStatus] = useState<number>();
    const [note, setNote] = useState("");

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0});

    const fetchStatus = async () => {
        try {
            const res = await orderApi.getStatus();
            setStatus(res.data);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải trạng thái!");
        }
    }

    const fetchOrders = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            const fromDate = dateRange[0]?.format("YYYY-MM-DD");
            const toDate = dateRange[1]?.format("YYYY-MM-DD");
            const res = await orderApi.getAll(page, limit, search, fromDate, toDate, selectedStatus);
            const { orders, total } = res.data;
            setOrders(orders);
            setPagination({ current: page, pageSize: limit, total });
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải danh sách đơn hàng!");
        } finally {
            setLoading(false);
        }
    };

    const fetchBill = async (id: number) => {
        try {
            const res = await orderApi.getBill(id);
            const bill = res.data;
            setOrderBill(bill);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải thông tin hóa đơn!");
        }
    }

    const fetchHistories = async (id: number) => {
        try {
            const res = await orderApi.getHistories(id);
            const histories = res.data;
            steHistories(histories);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải lịch sử trạng thái đơn hàng!");
        }
    }

    useEffect(() => {
        fetchStatus();
        fetchOrders(pagination.current, pagination.pageSize);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchOrders(pagination.current, pagination.pageSize);
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, dateRange[0]?.format("YYYY-MM-DD"), dateRange[1]?.format("YYYY-MM-DD"), selectedStatus]);

    const resetFilter = () => {
        setSearch("");
        setDateRange([null, null]);
        setSelectedStatus(undefined);
    };

    const handleEdit = (record: Order) => {
        setEditingOrder(record);
        setNewStatus(record.orderStatus.id);
        setIsEditModalVisible(true);
        setCurrentStatus(record.orderStatus.id);
        fetchHistories(record.id);
    }

    const handleView = async (record: Order) => {
        setSelectedOrder(record);
        setIsModalVisible(true);
        setOrderBill(undefined);
        setLoadingModal(true);
        try {
            await fetchBill(record.id);
        } finally {
            setLoadingModal(false);
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true);
            if (editingOrder && newStatus && currentStatus != newStatus) {
                await orderApi.update(editingOrder.id, newStatus, note);
                await fetchOrders(pagination.current, pagination.pageSize);
                setIsEditModalVisible(false);
                messageService.success("Cập nhật trạng thái đơn hàng thành công!");
            }
        } catch (e) {
            console.log(e);
            messageService.error("Lỗi khi cập nhật trạng thái đơn hàng!");
        } finally {
            setSaving(false);
        }
    }

    const handleDownload = async() => {
        const modal = document.getElementById("bill");
        if (!modal) return;

        const canvas = await html2canvas(modal, { scale: 2 });
        const img = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(img, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 20);
        pdf.save(`HĐ-${selectedOrder?.id}.pdf`);
    }

    const getStatusColor = (statusName: string): string => {
        const normalized = statusName.trim().toLowerCase();
        if (normalized.includes("đã hủy")) return "red";
        if (normalized.includes("chờ") || normalized.includes("xác nhận")) return "orange";
        if (normalized.includes("đang giao")) return "blue";
        if (normalized.includes("đã giao")) return "green";
        if (normalized.includes("hoàn")) return "purple";
        return "default";
    };

    const getStatusOptions = (currentStatus: number) => {
        if (currentStatus == 2) {
            return [
                {value: 2, label: "Chờ xác nhận"},
                {value: 3, label: "Đang giao hàng"},
                {value: 1, label: "Đã hủy"}
            ];
        } else if (currentStatus == 3) {
            return [
                {value: 3, label: "Đang giao hàng"},
                {value: 4, label: "Đã giao hàng"}
            ];
        }
    };

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "id",
            key: "id",
            width: 100,
            align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Order, b: Order) => a.id - b.id
        },
        {
            title: "Khách hàng",
            dataIndex: "account",
            key: "account",
            align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Order, b: Order) => a.account.fullName.localeCompare(b.account.fullName),
            render: (_: any, record: Order) => record.account.fullName
        },
        {
            title: "Tổng tiền",
            dataIndex: "total",
            key: "total",
            align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Order, b: Order) => a.total - b.total,
            render: (v: number) => `${v.toLocaleString()}đ`
        },
        {
            title: "Ngày đặt hàng",
            dataIndex: "orderDate",
            key: "orderDate",
            align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Order, b: Order) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
            render: (d: string) => dayjs(d).format("DD/MM/YYYY")
        },
        {
            title: "Trạng thái",
            dataIndex: "orderStatus",
            key: "orderStatus",
            align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Order, b: Order) => a.orderStatus.name.localeCompare(b.orderStatus.name),
            render: (orderStatus: { id: number, name: string }) => {
                return <Tag color={getStatusColor(orderStatus?.name)} style={{ width: 100, textAlign: "center" }}>{orderStatus?.name}</Tag>;
            },
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
            align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Order, b: Order) => a.address.address.localeCompare(b.address.address),
            render: (_: any, record: Order) => record.address.address.replace(/=/g, ", ")
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center" as const,
            render: (_: any, record: Order) => (
                <Space>
                    <Button
                        className="btn-sec"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(record)}
                    >
                        Xem hóa đơn
                    </Button>
                    <Button
                        className="btn-sec"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Chỉnh sửa trạng thái
                    </Button>
                </Space>
            ),
        },
    ];

    const name = status.find((s) => s.id === currentStatus)?.name ?? "";

    return (
        <div className="p-6">
            <div className="header">
                <h2>Quản lý đơn hàng</h2>
            </div>

            <Space className="filter" style={{ marginBottom: 16 }}>
                <Input
                    className="input"
                    placeholder="Tìm theo mã đơn hàng hoặc tên khách hàng"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    prefix={<SearchOutlined />}
                    style={{ width: 400 }}
                />
                <Select
                    className="select"
                    placeholder="Lọc theo trạng thái"
                    allowClear
                    style={{ width: 200 }}
                    value={selectedStatus ?? undefined}
                    onChange={(value) => setSelectedStatus(value ?? null)}
                    options={status.map((s) => ({
                        value: s.id,
                        label: s.name,
                    }))}
                />
                <div className="my-picker">
                    <RangePicker 
                        className="me-5"
                        format="DD/MM/YYYY"
                        value={dateRange}
                        onChange={(values) => setDateRange(values as [Dayjs | null, Dayjs | null])}
                        placeholder={["Từ ngày", "Đến ngày"]}
                        style={{ width: 300 }}
                    />
                </div>
                <Button className="btn-sec" onClick={resetFilter} icon={<ReloadOutlined />}>
                    Đặt lại
                </Button>
            </Space>

            <Card>
                <Table
                    columns={columns}
                    dataSource={orders}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total
                    }}
                    onChange={(newPag) => {
                        fetchOrders(newPag.current, newPag.pageSize);
                    }}
                />
            </Card>

            <Modal
                className="my-modal"
                title={ <h3> Hóa đơn đơn hàng #{selectedOrder?.id} </h3> }
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button className="btn-sec" key="close" onClick={() => setIsModalVisible(false)}>
                        Đóng
                    </Button>,
                    <Button
                        className="btn-pri"
                        key="print"
                        type="primary"
                        icon={<PrinterOutlined />}
                        onClick={handleDownload}
                    >
                        In hóa đơn
                    </Button>,
                ]}
                width={800}
            >
                <Spin spinning={loadingModal} tip="Đang tải dữ liệu hóa đơn..">
                {selectedOrder && (
                <div id="bill">
                    <Descriptions bordered size="small" column={2}>
                        <Descriptions.Item label={<b>Khách hàng</b>} span={2}>
                            {orderBill?.address.name}
                        </Descriptions.Item>
                        <Descriptions.Item label={<b>Ngày đặt</b>}>
                            {dayjs(orderBill?.orderDate).format("DD/MM/YYYY")}
                        </Descriptions.Item>
                        <Descriptions.Item label={<b>Trạng thái</b>}>
                            {orderBill?.orderStatus.name}
                        </Descriptions.Item>
                        <Descriptions.Item label={<b>Địa chỉ</b>} span={2}>
                            {orderBill?.address.address.replace(/=/g, ", ")}
                        </Descriptions.Item>
                        <Descriptions.Item label={<b>Phương thức thanh toán</b>} span={2}>
                            {orderBill?.bills[0].paymentMethod == "1" ? "Chuyển khoản" : "Tiền mặt"}
                        </Descriptions.Item>
                        <Descriptions.Item label={<b>Thời gian thanh toán</b>} span={2}>
                            {orderBill?.bills[0].paymentTime
                                ? dayjs(orderBill?.bills[0].paymentTime).format("DD/MM/YYYY HH:mm")
                                : "Chưa thanh toán"}
                        </Descriptions.Item>
                        <Descriptions.Item label={<b>Thời gian xuất hóa đơn</b>} span={2}>
                            {dayjs(orderBill?.bills?.[0]?.invoiceTime).isValid()
                                ? dayjs(orderBill?.bills?.[0]?.invoiceTime).format("DD/MM/YYYY HH:mm")
                                : ""}
                        </Descriptions.Item>
                    </Descriptions>

                    <h4 style={{ marginTop: 20 }}>Sản phẩm trong đơn hàng</h4>
                    <List
                        bordered
                        dataSource={orderBill?.orderDetails}
                        renderItem={(item) => (
                            <List.Item>
                                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                                    <span>
                                        {item.productVariant.product.name} ({item.productVariant.color} - {item.productVariant.size}) × {item.quantity}
                                    </span>
                                    <b>{(item.productVariant.price * item.quantity).toLocaleString()}đ</b>
                                </Space>
                            </List.Item>
                        )}
                    />

                    { orderBill?.orderVouchers && orderBill.orderVouchers.length > 0 && (
                    <>
                        <h4 style={{ marginTop: 20 }}>Voucher áp dụng</h4>
                        <List
                            size="small"
                            bordered
                            dataSource={orderBill.orderVouchers}
                            renderItem={(v) => (
                                <List.Item>
                                    <Space
                                        style={{ width: "100%", justifyContent: "space-between" }}
                                    >
                                        <span>
                                            <Tag color="purple">{v.voucher.code}</Tag> Giảm {v.voucher.discountPercent}%
                                        </span>
                                        <span>-{v.voucher.discountPercent}%</span>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </>
                    )}

                    <Divider />
                    {(() => {
                        return (
                            <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label={<b>Tạm tính</b>}>
                                {orderBill?.total.toLocaleString()}đ
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Phí vận chuyển</b>}>
                                {orderBill?.bills[0].shippingFee.cost.toLocaleString()}đ
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Giảm giá voucher</b>}>
                                -{orderBill?.totalVoucher.toLocaleString()}đ
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Tổng thanh toán</b>}>
                                <b style={{ fontSize: 16, color: "green" }}>
                                    {orderBill?.bills[0].total.toLocaleString()}đ
                                </b>
                            </Descriptions.Item>
                            </Descriptions>
                        );
                    })()}
                </div>
                )}
                </Spin>
            </Modal>

            <Modal
                title={<h4>Chỉnh sửa trạng thái đơn hàng {editingOrder?.id}</h4>}
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                onOk={handleSave}
                okText="Lưu thay đổi"
                cancelText="Hủy"
                okButtonProps={{ className: "btn-pri" }}
                cancelButtonProps={{ className: "btn-sec" }}
                confirmLoading={saving}
            >
                <p className="mt-3 mb-0"><b>Khách hàng:</b> {editingOrder?.account.fullName}</p>
                <p className="mt-2 mb-2">
                    <b className="mr-2">Trạng thái hiện tại:</b> {""}
                    <Tag color={getStatusColor(name)} style={{ width: 100, textAlign: "center" }}>{name}</Tag>
                </p>

                {(currentStatus === 2 || currentStatus === 3) ? (
                    <>
                        <div className="filter">
                            <Select
                                className="select"
                                style={{ width: "100%" }}
                                value={newStatus ?? currentStatus}
                                onChange={value => setNewStatus(value)}
                                options={getStatusOptions(currentStatus ?? 0)}
                            />
                        </div>

                        <div className="mt-3">
                            <p className="mb-1"><b>Ghi chú (tuỳ chọn):</b></p>
                            <TextArea
                                className="my-textarea"
                                rows={3}
                                placeholder="Nhập ghi chú khi thay đổi trạng thái..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                maxLength={200}
                            />
                        </div>
                    </>
                ) : (
                    <p style={{ color: "#888", fontStyle: "italic", marginTop: 8 }}>
                        Trạng thái này không thể thay đổi.
                    </p>
                )}

                <p className="mt-3"><b>Lịch sử trạng thái:</b></p>
                <Timeline
                    mode="left"
                    style={{ marginTop: 8 }}
                    items={(histories ?? []).map((h) => {
                        const color = getStatusColor(h.orderStatus.name);
                        return {
                            color,
                            children: (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Tag color={color} style={{ width: 120, textAlign: "center" }}>
                                        {h.orderStatus.name}
                                    </Tag>
                                    <small style={{ color: "#888" }}>
                                        {dayjs(h.date).format("DD/MM/YYYY")} – {h.note || ""}
                                    </small>
                                </div>
                            ),
                        };
                    })}
                />
            </Modal>
        </div>
    );
}

export default OrderAdmin;