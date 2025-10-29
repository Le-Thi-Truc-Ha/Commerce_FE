import React, { useState, useEffect } from "react";
import { Table, Input, InputNumber, DatePicker, Modal, Button, Tag, Space, Typography, Popconfirm, Select, Form } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, } from "@ant-design/icons";
import type { ProductPromotion, Promotion } from "../../interfaces/adminInterface";
import { promotionApi, voucherApi } from "../../services/adminService";
import { messageService } from "../../interfaces/appInterface";
import dayjs, { Dayjs } from "dayjs";
import "./ProductAdmin.scss";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const PromotionAdmin: React.FC = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [promotion, setPromotion] = useState<Promotion>();
    const [products, setProducts] = useState<ProductPromotion[]>([]);
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<ProductPromotion[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingPro, setLoadingPro] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selected, setSelected] = useState<Promotion>();
    const [search, setSearch] = useState("");
    const [searchProduct, setSearchProduct] = useState("");
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
    const [form] = Form.useForm();

    
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0});
    const [paginationPro, setPaginationPro] = useState({ current: 1, pageSize: 5, total: 0});

    const fetchPromotions = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            const fromDate = dateRange?.[0]?.format("YYYY-MM-DD") ?? undefined;
            const toDate = dateRange?.[1]?.format("YYYY-MM-DD") ?? undefined;

            const res = await promotionApi.getAll(page, limit, search, fromDate, toDate);
            const { promotions, total } = res.data;

            setPromotions(promotions);
            setPagination({ current: page, pageSize: limit, total });
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải danh sách chương trình ưu đãi!");
        } finally {
            setLoading(false);
        }
    };

    const fetchPromotion = async (id: number) => {
        try {
            setLoadingPro(true);
            const res = await promotionApi.getById(id);
            setPromotion(res.data);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải thông tin ưu đãi!");
        } finally {
            setLoadingPro(false);
        }
    };

    const fetchProducts = async (promotionId: number, page = 1, limit = 10) => {
        try {
            setLoadingPro(true);
            const res = await promotionApi.getProducts(promotionId, page, limit, searchProduct);
            const { products, total } = res.data;

            setProducts(products);
            setPaginationPro({ current: page, pageSize: limit, total });
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải danh sách sản phẩm của ưu đãi!");
        } finally {
            setLoadingPro(false);
        }
    };

    const fetchProductsByCategory = async (categoryId: number) => {
        try {
            setLoadingOptions(true);
            const res = await promotionApi.getProductsByCategory(categoryId, searchProduct);
            setProducts(res.data || []);
        } catch (err) {
            console.error(err);
            messageService.error("Lỗi khi tải sản phẩm theo danh mục!");
        } finally {
            setLoadingOptions(false);
        }
    };


    useEffect(() => {
        fetchPromotions(pagination.current, pagination.pageSize);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchPromotions(pagination.current, pagination.pageSize);
        }, 500);

        return () => clearTimeout(timeout);
    }, [search,
        dateRange?.[0] ? dateRange[0].format("YYYY-MM-DD") : null,
        dateRange?.[1] ? dateRange[1].format("YYYY-MM-DD") : null
    ]);

    useEffect(() => {
        if (!selected) return;
        const timeout = setTimeout(() => {
            fetchProducts(selected.id, paginationPro.current, paginationPro.pageSize);
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchProduct]);

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
            } catch (error) {
                console.error(error);
                messageService.error("Lỗi khi tải danh mục!");
            } finally {
                setLoadingCategory(false);
            }
        }, 500);
    };

    let productSearchTimeout: NodeJS.Timeout;
    const handleSearchProduct = (value: string) => {
        if (!value.trim()) {
            setProducts([]);
            return;
        }

        clearTimeout(productSearchTimeout);
        productSearchTimeout = setTimeout(async () => {
            const categoryId = form.getFieldValue("categoryId");
            fetchProductsByCategory(categoryId);
        }, 500);
    };

    useEffect(() => {
        if (editingPromotion && promotion) {
            form.setFieldsValue({
                percent: promotion.percent,
                dateRange: [
                    promotion.startDate ? dayjs(promotion.startDate) : null,
                    promotion.endDate ? dayjs(promotion.endDate) : null,
                ]
            });
            setSelectedProducts(promotion.productPromotions || []);
        }
    }, [editingPromotion, promotion, form]);

    const resetModalState = () => {
        form.resetFields();
        setProducts([]);
        setSelectedProducts([]);
        setPromotion(undefined);
        setPaginationPro({
            current: 1,
            pageSize: 5,
            total: 0,
        });
        setSearchProduct("");
    };


    const handleAdd = () => {
        resetModalState();
        setEditingPromotion(null);
        setIsModalOpen(true);
    };

    const handleEdit = async (record: Promotion) => {
        resetModalState();
        setIsModalOpen(true);
        setEditingPromotion(record);
        const res = await voucherApi.getCategories("");
        setCategories(res.data);
        fetchPromotion(record.id);
    };

    const handleDelete = async(id: number) => {
        try {
            await promotionApi.delete(id);
            messageService.success("Xóa ưu đãi thành công!");
            fetchPromotions(1, pagination.pageSize);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi xóa ưu đãi!");
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();

            const formData = new FormData();
            formData.append("percent", values.percent.toString());
            formData.append("startDate", values.dateRange[0].format("YYYY-MM-DD"));
            formData.append("endDate", values.dateRange[1].format("YYYY-MM-DD"));

            if (selectedProducts.length) {
                selectedProducts.forEach((p) => {
                    formData.append("productIds", p.product.id.toString());
                });
            }

            if (editingPromotion) {
                formData.append("id", editingPromotion.id.toString());
                await promotionApi.update(formData);
                messageService.success("Cập nhật chương trình ưu đãi thành công!");
            } else {
                await promotionApi.create(formData);
                messageService.success("Thêm chương trình ưu đãi thành công!");
            }
            fetchPromotions(1, pagination.pageSize);
            setIsModalOpen(false);
        } catch (e){
            console.log(e);
            messageService.error("Lỗi khi lưu chương trình ưu đãi!");
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", align: "center" as const, 
            showSorterTooltip: false,
            sorter: (a: Promotion, b: Promotion) => a.id - b.id
        },
        {
            title: "Phần trăm giảm",
            dataIndex: "percent",
            key: "percent",
            align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Promotion, b: Promotion) => a.percent - b.percent,
            render: (v: number) => (
                <Tag 
                    color="green" 
                    style={{ 
                        width: 70, 
                        height: 30, 
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {v}%
                </Tag>
            ),
        },
        {
            title: "Thời gian áp dụng",
            key: "time",
            align: "center" as const,
            render: (_: any, r: Promotion) => `${dayjs(r.startDate).format("DD/MM/YYYY")} - ${dayjs(r.endDate).format("DD/MM/YYYY")}`,
        },
        {
            title: "Sản phẩm áp dụng",
            key: "products",
            align: "center" as const,
            render: (_: any, record: Promotion) => (
                <Button
                    type="link"
                    onClick={() => {
                        fetchProducts(record.id, 1, paginationPro.pageSize);
                        setSelected(record);
                        setOpenViewModal(true);
                    }}
                >
                    Xem chi tiết
                </Button>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center" as const,
            render: (_: any, record: Promotion) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        type="link"
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xác nhận xóa ưu đãi này?"
                        onConfirm={() => handleDelete(record.id)}
                        okButtonProps={{ className: "btn-pri" }}
                        cancelButtonProps={{ className: "btn-sec" }}
                    >
                        <Button icon={<DeleteOutlined />} type="link" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="header">
                <h2>Quản lý chương trình ưu đãi</h2>
                <Button
                    icon={<PlusOutlined />}
                    className="btn-add"
                    onClick={() => handleAdd()}
                >
                    Thêm ưu đãi
                </Button>
            </div>

            <Space className="filter" style={{ marginBottom: 16 }}>
                <Input
                    className="input"
                    placeholder="Tìm theo tên sản phẩm..."
                    value={search}
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 300 }}
                />
                <div className="my-picker">
                    <RangePicker
                        format="DD/MM/YYYY"
                        value={dateRange}
                        onChange={(values) => setDateRange(values as [Dayjs | null, Dayjs | null])}
                        placeholder={["Từ ngày", "Đến ngày"]}
                        style={{ width: 300 }}
                    />
                </div>
            </Space>

            <Table 
                columns={columns} 
                dataSource={promotions} 
                rowKey="id" 
                loading={loading}
                bordered
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total
                }}
                onChange={(newPag) => {
                    fetchPromotions(newPag.current, newPag.pageSize);
                }}
            />

            <Modal
                className="my-modal"
                open={openViewModal}
                title={<Title level={4}>Danh sách sản phẩm áp dụng ưu đãi</Title>}
                onCancel={() => setOpenViewModal(false)}
                footer={null}
                width={800}
            >
                {selected && (
                    <div>
                        <div className="flex gap-3 mb-4 mt-4 filter">
                            <Input
                                placeholder="Tìm theo tên sản phẩm hoặc tên danh mục . . . . . "
                                className="me-3 input"
                                prefix={<SearchOutlined />}
                                value={searchProduct}
                                onChange={(e) => setSearchProduct(e.target.value)}
                                style={{ width: 400 }}
                                allowClear
                            />
                        </div>
            
                        <Table
                            dataSource={products}
                            columns={[
                                { title: "ID", key: "id", width: 80, align: "center" as const, 
                                    showSorterTooltip: false,
                                    sorter: (a: ProductPromotion, b: ProductPromotion) => a.product.id - b.product.id,
                                    render: (pp: ProductPromotion) => pp.product.id
                                },
                                { title: "Tên sản phẩm", key: "name", align: "center" as const, 
                                    showSorterTooltip: false, 
                                    sorter: (a: ProductPromotion, b: ProductPromotion) => a.product.name.localeCompare(b.product.name),
                                    render: (pp: ProductPromotion) => pp.product.name
                                },
                                {
                                    title: "Danh mục",
                                    key: "categoryName",
                                    align: "center" as const,
                                    showSorterTooltip: false,
                                    sorter: (a: ProductPromotion, b: ProductPromotion) => a.product.category.name.localeCompare(b.product.category.name),
                                    render: (pp: ProductPromotion) => pp.product.category.name
                                }
                            ]}
                            rowKey={(record) => record.product.id}
                            loading={loadingPro}
                            bordered
                            pagination={{
                                current: paginationPro.current,
                                pageSize: paginationPro.pageSize,
                                total: paginationPro.total
                            }}
                            onChange={(newPag) => {
                                fetchProducts(selected.id, newPag.current, newPag.pageSize);
                            }}
                        />
                    </div>
                )}
            </Modal>

            <Modal
                className="my-modal"
                title={editingPromotion ? "Cập nhật ưu đãi" : "Thêm ưu đãi mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSave}
                okText="Lưu"
                cancelText="Hủy"
                width={1200}
                confirmLoading={saving}
                okButtonProps={{ className: "btn-pri" }}
                cancelButtonProps={{ className: "btn-sec" }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Phần trăm giảm giá"
                        name="percent"
                        rules={[{ required: true, message: "Phần trăm giảm giá của ưu đãi" }]}
                    >
                        <InputNumber  min={1} max={100} addonAfter="%" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        className="my-picker"
                        label="Thời gian áp dụng"
                        name="dateRange"
                        rules={[{ required: true }]}
                    >
                        <RangePicker placeholder={["Từ ngày", "Đến ngày"]} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Danh mục"
                        name="categoryId"
                    >
                        <Select
                            className="select"
                            showSearch
                            placeholder="Chọn danh mục..."
                            filterOption={false}
                            onSearch={handleSearchCategory}
                            loading={loadingCategory}
                            options={categories.map(c => ({ label: c.name, value: c.id }))}
                            onChange={async (value: number) => {
                                form.setFieldValue("categoryId", value);
                                setSearchProduct("");
                                fetchProductsByCategory(value);
                            }}
                        />
                    </Form.Item>
                        <Form.Item label="Chọn sản phẩm áp dụng">
                            <Select
                                className="select"
                                showSearch
                                placeholder="Chọn sản phẩm..."
                                filterOption={false}
                                loading={loadingOptions}
                                onSearch={handleSearchProduct}
                                options={products.map(p => ({
                                    label: p.product.name,
                                    value: p.product.id
                                }))}
                                onChange={(value: number) => {
                                    const selectedProduct = products.find(p => p.product.id === value);

                                    if (selectedProduct) {
                                        const newSelected = {
                                            id: selectedProduct.product.id,
                                            name: selectedProduct.product.name,
                                            category: selectedProduct.product.category,
                                            product: selectedProduct.product,
                                        };

                                        setSelectedProducts(prev => {
                                        const exists = prev.find(p => p.product.id === newSelected.id);
                                        let updated;

                                        if (exists) {
                                            const filtered = prev.filter(p => p.product.id !== newSelected.id);
                                            updated = [newSelected, ...filtered];
                                        } else {
                                            updated = [newSelected, ...prev];
                                        }

                                        setPaginationPro(prevPag => ({
                                            ...prevPag,
                                            total: updated.length,
                                            current: 1,
                                        }));

                                        return updated;
                                        });
                                    }
                                }}
                            />
                        </Form.Item>
                    <Table
                        dataSource={selectedProducts}
                        columns={[
                            { title: "ID", dataIndex: "id", key: "id", width: 80, align: "center",
                                showSorterTooltip: false,
                                sorter: (a, b) => a.product.id - b.product.id
                            },
                            { title: "Tên sản phẩm", key: "name", align: "center",
                                showSorterTooltip: false,
                                sorter: (a, b) => a.product.name.localeCompare(b.product.name),
                                render: (p: ProductPromotion) => p.product.name
                            },
                            { title: "Danh mục", key: "category", align: "center",
                                showSorterTooltip: false,
                                render: (p: ProductPromotion) => p.product.category.name,
                                sorter: (a, b) => a.product.category.name.localeCompare(b.product.category.name)
                            },
                            {
                                title: "Thao tác",
                                align: "center",
                                render: (_, record) => (
                                    <Button
                                        type="link"
                                        danger
                                        onClick={() => setSelectedProducts(prev => prev.filter(p => p.product.id !== record.product.id))}
                                    >
                                        Xóa
                                    </Button>
                                )
                            }
                        ]}
                        rowKey={(record) => record.product.id}
                        bordered
                        loading={loadingPro}
                        pagination={{
                            current: paginationPro.current,
                            pageSize: paginationPro.pageSize,
                            total: paginationPro.total
                        }}
                        onChange={(newPag) => {
                            fetchProducts(Number(editingPromotion?.id), newPag.current, newPag.pageSize);
                        }}
                    />
                </Form>
            </Modal>
        </div>
    );
};

export default PromotionAdmin;
