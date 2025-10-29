import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select, DatePicker, Modal, Form, InputNumber, Popconfirm, Tag, } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import type { Voucher, VoucherDetail, VoucherID } from "../../interfaces/adminInterface";
import { voucherApi } from "../../services/adminService";
import { messageService } from "../../interfaces/appInterface";
import "./ProductAdmin.scss";

const { RangePicker } = DatePicker;
const { Option } = Select;

const types = [
    { id: 1, name: "Toàn hóa đơn" },
    { id: 2, name: "Phí vận chuyển" },
    { id: 3, name: "Danh mục" }
];

const VoucherAdmin: React.FC = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [voucher, setVoucher] = useState<VoucherID>();
    const [detailVoucher, setDetailVoucher] = useState<VoucherDetail | null>(null);
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const [saving, setSaving] = useState(false);
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [search, setSearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [editing, setEditing] = useState<Voucher | null>(null);
    const [typeFilter, setTypeFilter] = useState(0);
    const [form] = Form.useForm();

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0});
    const [paginationCat, setPaginationCat] = useState({ current: 1, pageSize: 5, total: 0});

    const fetchVouchers = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            const fromDate = dateRange?.[0]?.format("YYYY-MM-DD") ?? undefined;
            const toDate = dateRange?.[1]?.format("YYYY-MM-DD") ?? undefined;

            const res = await voucherApi.getAll(page, limit, search, fromDate, toDate, typeFilter);
            const { vouchers, total } = res.data;

            setVouchers(vouchers);
            setPagination({ current: page, pageSize: limit, total });
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải danh sách mã khuyến mãi!");
        } finally {
            setLoading(false);
        }
    };

    const fetchVoucher = async (id: number) => {
        try {
            const res = await voucherApi.getById(id);
            setVoucher(res.data);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải thông tin mã khuyến mãi!");
        }
    };

    const fetchDetail = async (id: number, page = 1, limit = 5) => {
        try {
            const res = await voucherApi.getDetail(id, page, limit);
            const { voucher, total } = res.data;
            setDetailVoucher(voucher);
            setPaginationCat({ current: page, pageSize: limit, total });
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải thông tin mã khuyến mãi!");
        }
    };

    useEffect(() => {
        fetchVouchers(1, pagination.pageSize);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchVouchers(pagination.current, pagination.pageSize);
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, typeFilter,
        dateRange?.[0] ? dateRange[0].format("YYYY-MM-DD") : null,
        dateRange?.[1] ? dateRange[1].format("YYYY-MM-DD") : null
    ]);

    let searchTimeout: NodeJS.Timeout;
    const handleSearchCategory = (value: string) => {
        setLoadingCategory(true);
        if (!value.trim()) {
            setCategories([]);
            return;
        }

        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            try {
                const res = await voucherApi.getCategories(value);
                setCategories(res.data);
            } catch (e) {
                console.error(e);
                messageService.error("Lỗi khi tải danh mục!");
            } finally {
                setLoadingCategory(false);
            }
        }, 500);
    };

    useEffect(() => {
        if (editing && voucher) {
            form.setFieldsValue({
                code: voucher.code,
                name: voucher.name,
                discountPercent: voucher.discountPercent,
                dateRange: [
                    voucher.startDate ? dayjs(voucher.startDate) : null,
                    voucher.endDate ? dayjs(voucher.endDate) : null,
                ],
                quantity: voucher.quantity,
                type: voucher.type,
                condition: voucher.condition,
                description: voucher.description,
                categoryIds: voucher.voucherCategories.map(vc => Number(vc.category?.id)).filter(Boolean),
            });
        }
    }, [editing, voucher, form]);

    const handleAdd = () => {
        setEditing(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = async (record: Voucher) => {
        setModalVisible(true);
        setEditing(record);
        const res = await voucherApi.getCategories("");
        setCategories(res.data);
        fetchVoucher(record.id);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();

            const formData = new FormData();
            formData.append("code", values.code);
            formData.append("name", values.name);
            formData.append("discountPercent", values.discountPercent);
            formData.append("startDate", values.dateRange[0].format("YYYY-MM-DD"));
            formData.append("endDate", values.dateRange[1].format("YYYY-MM-DD"));
            formData.append("quantity", values.quantity);
            formData.append("condition", values.condition || 0);
            formData.append("type", values.type);
            formData.append("description", values.description || "");

            if (values.categoryIds?.length) {
                values.categoryIds.forEach((id: number) => {
                    formData.append("categoryIds", id.toString());
                });
            }

            if (editing) {
                formData.append("id", editing.id.toString());
                await voucherApi.update(formData);
                messageService.success("Cập nhật mã giảm giá thành công!");
            } else {
                await voucherApi.create(formData);
                messageService.success("Thêm mã giảm giá thành công!");
            }
            fetchVouchers(1, pagination.pageSize);
            setModalVisible(false);
        } catch (e){
            console.log(e);
            messageService.error("Lỗi khi lưu khuyến mãi!");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await voucherApi.delete(id);
            messageService.success("Xóa mã khuyến mãi thành công!");
            fetchVouchers(1, pagination.pageSize);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi xóa mã khuyến mãi!");
        }
    };

    const columns = [
        {   title: "Mã", dataIndex: "code", align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Voucher, b: Voucher) => a.code.localeCompare(b.code),
            render: (c: string) => (
                <Tag style={{ width: 100, textAlign: "center" }} color="green">{c}</Tag>
            )
        },
        { title: "Tên", dataIndex: "name", align: "center" as const, 
            showSorterTooltip: false,
            sorter: (a: Voucher, b: Voucher) => a.name.localeCompare(b.name)
        },
        { title: "Giảm (%)", dataIndex: "discountPercent", align: "center" as const },
        {
            title: "Loại",
            dataIndex: "type",
            align: "center" as const,
            showSorterTooltip: false, 
            sorter: (a: Voucher, b: Voucher) => a.type - b.type,
            render: (t: number) => t === 1 ? "Toàn hóa đơn" : t === 2 ? "Phí vận chuyển" : "Theo danh mục",
        },
        {
            title: "Thời gian áp dụng",
            align: "center" as const,
            render: (_: any, r: Voucher) => `${dayjs(r.startDate).format("DD/MM/YYYY")} - ${dayjs(r.endDate).format("DD/MM/YYYY")}`,
        },
        { title: "Số lượng", dataIndex: "quantity", align: "center" as const, 
            showSorterTooltip: false, 
            sorter: (a: Voucher, b: Voucher) => a.quantity - b.quantity
        },
        {
            title: "Thông tin chi tiết",
            key: "detail",
            align: "center" as const,
            render: (_: any, record: Voucher) => (
                <Button
                    type="link"
                    onClick={() => {
                        fetchDetail(record.id);
                        setDetailModalVisible(true);
                    }}
                >
                    Xem chi tiết
                </Button>
            ),
        },
        {
            title: "Thao tác",
            align: "center" as const,
            render: (_: any, record: any) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        type="link"
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xác nhận xóa khuyến mãi này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ className: "btn-pri" }}
                        cancelButtonProps={{ className: "btn-sec" }}
                    >
                        <Button icon={<DeleteOutlined />} type="link" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div className="P-6">
            <div className="header">
                <h2>Quản lý mã giảm giá</h2>
                <Button
                    icon={<PlusOutlined />}
                    className="btn-add"
                    onClick={() => handleAdd()}
                >
                    Thêm mã giảm giá
                </Button>
            </div>
            <div className="filter">
                <Input
                    className="input me-3"
                    placeholder="Tìm theo mã hoặc tên"
                    value={search}
                    style={{ width: 300}}
                    prefix={ <SearchOutlined/> }
                    onChange={(e) => setSearch(e.target.value)}
                />
                <RangePicker
                    className="me-3"
                    format="DD/MM/YYYY"
                    value={dateRange}
                    onChange={(values) => setDateRange(values as [Dayjs | null, Dayjs | null])}
                    placeholder={["Từ ngày", "Đến ngày"]}
                    style={{ width: 300 }}
                />
                <Select
                    className="select"
                    placeholder="Loại voucher"
                    value={typeFilter}
                    style={{ width: 300}}
                    onChange={(v) => setTypeFilter(v)}
                    prefix={<FilterOutlined/>}
                    options={[
                        { value: 0, label: "Tất cả" },
                        { value: 1, label: "Toàn hóa đơn" },
                        { value: 2, label: "Phí vận chuyển" },
                        { value: 3, label: "Danh mục" },
                    ]}
                >
                </Select>
            </div>

            <Table
                columns={columns}
                dataSource={vouchers}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total
                }}
                onChange={(newPag) => {
                    fetchVouchers(newPag.current, newPag.pageSize);
                }}
            />

            <Modal 
                open={detailModalVisible}
                title={<h4>Thông tin chi tiết mã giảm giá</h4>}
                footer={
                    <Button className="btn-sec" key="close" onClick={() => setDetailModalVisible(false)}>
                        Đóng
                    </Button>
                }
                onCancel={() => setDetailModalVisible(false)}
            > 
                {detailVoucher && (
                    <>
                        {detailVoucher.type === 1 && (
                            <div>
                                <p><b>Điều kiện:</b> {detailVoucher.condition.toLocaleString()} đ</p>
                                <p><b>Mô tả:</b> {detailVoucher.description}</p>
                            </div>
                        )}

                        {detailVoucher.type === 2 && (
                            <div>
                                <p><b>Mô tả:</b> {detailVoucher.description}</p>
                            </div>
                        )}

                        {detailVoucher.type === 3 && (
                            <div>
                                <p><b>Mô tả:</b> {detailVoucher.description}</p>
                                <p><b>Danh mục áp dụng:</b></p>
                                <Table
                                    dataSource={detailVoucher.voucherCategories}
                                    columns={[
                                        { title: "ID", key: "id", align: "center" as const, render: (vc) => vc.category.id },
                                        { title: "Tên danh mục", key: "name", align: "center" as const, render: (vc) => vc.category.name }
                                    ]}
                                    rowKey="id"
                                    bordered
                                    pagination={{
                                        current: paginationCat.current,
                                        pageSize: paginationCat.pageSize,
                                        total: paginationCat.total
                                    }}
                                    onChange={(newPag) => {
                                        fetchDetail(detailVoucher.id, newPag.current, newPag.pageSize);
                                    }}
                                />
                            </div>
                        )}
                    </>
                )}
            </Modal>

            <Modal
                className="my-modal"
                open={modalVisible}
                title={editing ? "Cập nhật mã giảm giá" : "Thêm mới mã giảm giá"}
                width={800}
                confirmLoading={saving}
                onCancel={() => setModalVisible(false)}
                onOk={handleSave}
                okText="Lưu"
                cancelText="Hủy"
                okButtonProps={{ className: "btn-pri" }}
                cancelButtonProps={{ className: "btn-sec" }}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item
                        label="Mã voucher"
                        name="code"
                        rules={[{ required: true, message: "Nhập mã voucher!" }]}
                    >
                        <Input className="input"/>
                    </Form.Item>
                    <Form.Item
                        label="Tên"
                        name="name"
                        rules={[{ required: true, message: "Nhập tên voucher!" }]}
                    >
                        <Input className="input"/>
                    </Form.Item>
                    <Form.Item
                        label="Phần trăm giảm"
                        name="discountPercent"
                        rules={[{ required: true }]}
                    >
                        <InputNumber className="percent" min={1} max={100} addonAfter="%" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        className="my-picker"
                        label="Thời gian áp dụng"
                        name="dateRange"
                        rules={[{ required: true }]}
                    >
                        <RangePicker placeholder={["Từ ngày", "Đến ngày"]} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item label="Số lượng" name="quantity">
                        <InputNumber className="input" min={1} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item label="Loại voucher" name="type" rules={[{ required: true }]}>
                        <Select className="select">
                            {types.map((t) => (
                                <Option value={t.id}>{t.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={(prev, cur) => prev.type !== cur.type}>
                        {({ getFieldValue }) => {
                            const showCondition = getFieldValue("type") === 1;
                            return showCondition ? (
                            <Form.Item
                                label="Điều kiện áp dụng (đơn tối thiểu)"
                                name="condition"
                                rules={[{ required: true, message: "Nhập số tiền tối thiểu của đơn!" }]}
                            >
                                <InputNumber className="input" min={0} style={{ width: "100%" }} />
                            </Form.Item>
                            ) : null;
                        }}
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={(prev, cur) => prev.type !== cur.type}>
                        {({ getFieldValue }) =>
                            getFieldValue("type") === 3 && (
                                <Form.Item
                                    label="Danh mục áp dụng"
                                    name="categoryIds"
                                    rules={[{ required: true, message: "Chọn ít nhất 1 danh mục!" }]}
                                >
                                    <Select
                                        className="select"
                                        mode="multiple"
                                        showSearch
                                        placeholder="Nhập từ khóa để tìm danh mục..."
                                        filterOption={false}
                                        onSearch={handleSearchCategory}
                                        loading={loadingCategory}
                                        options={categories.map((c) => ({
                                            label: c.name,
                                            value: Number(c.id),
                                        }))}
                                        notFoundContent="Không tìm thấy danh mục nào"
                                    />
                                </Form.Item>
                            )
                        }
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea className="input" rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default VoucherAdmin;
