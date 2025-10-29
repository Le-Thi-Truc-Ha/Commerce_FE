import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Button, Table, Modal, Form, Input, Popconfirm, Rate } from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ProductDetail as ProductDetailType, ProductVariant, Media } from "../../interfaces/adminInterface";
import { productApi, variantApi } from "../../services/adminService";
import "./ProductAdmin.scss";
import { messageService } from "../../interfaces/appInterface";


const ProductDetail: React.FC = () => {
    const { id } = useParams();

    const [product, setProduct] = useState<ProductDetailType>({
        name: "",
        description: "",
        saleFigure: 0,
        rateStar: 0,
        category: { name: "" },
        medias: [],
    });
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loadingVariants, setLoadingVariants] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
    const [form] = Form.useForm();

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            const res = await productApi.getDetail(Number(id));
            setProduct(res.data);
        } catch (e) {
            console.log(e);
            messageService.error("Lỗi khi tải chi tiết sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    const fetchVariants = async (page = 1, limit = 5) => {
        try {
            setLoadingVariants(true);
            const res = await variantApi.getAllVariant(Number(id), page, limit);
            const { variants, total } = res.data;
            setVariants(variants);
            setPagination({ current: page, pageSize: limit, total });
        } catch (e) {
            console.log(e);
            messageService.error("Lỗi khi tải danh sách biến thể!");
        } finally {
            setLoadingVariants(false);
        }
    };

    useEffect(() => {
        fetchProductDetail();
        fetchVariants(1, pagination.pageSize);
    }, []);

    const renderMedia = (media: Media, index: number) => {
        if (media.type === 1) {
            return <img key={index} src={media.url} alt="" width={100} />
        } else {
            return <video key={index} src={media.url} width={120} controls />;
        }
    }

    const openModal = async (variant?: ProductVariant) => {
        setIsModalOpen(true);
        if (variant) {
            try {
                setLoading(true);
                const res = await variantApi.getById(variant.id);
                const variantData = res.data;
                setEditingVariant(variantData);
                form.setFieldsValue({
                    size: variantData.size,
                    color: variantData.color,
                    price: variantData.price,
                    quantity: variantData.quantity
                });
            } catch (e) {
                console.log(e);
                messageService.error("Không thể tải dữ liệu biến thể!");
            } finally {
                setLoading(false);
            }
        } else {
            setEditingVariant(null);
            form.resetFields();
        }
        
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();
            
            const formData = new FormData();
            formData.append("size", values.size);
            formData.append("color", values.color);
            formData.append("price", String(values.price));
            formData.append("quantity", String(values.quantity));

            if (editingVariant) {
                formData.append("id", String(editingVariant.id));
                await variantApi.update(formData);
                messageService.success("Cập nhật biến thể thành công!");
            } else {
                formData.append("productId", String(id));
                await variantApi.create(formData);
                messageService.success("Thêm biến thể thành công!");
            }
            setIsModalOpen(false);
            fetchVariants(1, pagination.pageSize);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi lưu biến thể!");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await variantApi.delete(id);
            messageService.success("Xóa biến thể thành công!");
            fetchVariants(1, pagination.pageSize);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi xóa biến thể!");
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id", key:"id", align: "center" as const, 
            showSorterTooltip: false,
            sorter: (a: ProductVariant, b: ProductVariant) => a.id - b.id },
        { title: "Màu sắc", dataIndex: "color", key: "color", align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: ProductVariant, b: ProductVariant) => a.color.localeCompare(b.color)
        },
        { title: "Kích thước", dataIndex: "size", key: "size", align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: ProductVariant, b: ProductVariant) => a.size.localeCompare(b.size) },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: ProductVariant, b: ProductVariant) => a.price - b.price,
            render: (value: number) => `${value.toLocaleString()}đ`,
        },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity", align: "center" as const, 
            showSorterTooltip: false,
            sorter: (a: ProductVariant, b: ProductVariant) => a.quantity - b.quantity
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center" as const,
            render: (_: unknown, record: ProductVariant) => (
                <>
                    <Button
                        icon={<EditOutlined/>}
                        type="link"
                        onClick={()=> openModal(record)}
                    >
                        Chỉnh sửa
                    </Button>
                    <Popconfirm
                        title="Xóa biến thể này?"
                        onConfirm={() => handleDelete(record.id)}
                        okButtonProps={{ className: "btn-pri" }}
                        cancelButtonProps={{ className: "btn-sec" }}
                    >
                        <Button icon={<DeleteOutlined />} type="link" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </>
            ),
        }
    ];

    return (
        <div className="product-detail-admin p-6">
            <div className="header">
                <h2>Chi tiết sản phẩm</h2>
            </div>
            <Card>
                {loading ? (
                    <p>Đang tải chi tiết sản phẩm...</p>
                ) : (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Tên sản phẩm">{product.name}</Descriptions.Item>
                        <Descriptions.Item label="Mô tả">{product.description}</Descriptions.Item>
                        <Descriptions.Item label="Doanh số">{product.saleFigure}</Descriptions.Item>
                        <Descriptions.Item label="Đánh giá">
                            <Rate allowHalf disabled value={product.rateStar || 0} />
                            <span style={{ marginLeft: 8 }}>{product.rateStar?.toFixed(1)}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Danh mục">{product.category.name}</Descriptions.Item>
                    </Descriptions>
                )}
                
                {product.medias.length > 0 && (
                    <div className="media-preview mt-4 mb-4">
                        <h4>Hình ảnh/Video:</h4>
                        <div style={{ display: "flex", gap: "12px" }}>
                            {product.medias.map((url, i) => renderMedia(url, i))}
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <div className="header mb-2 mt-3">
                        <h4>Biến thể sản phẩm</h4>
                        <Button
                            icon={<PlusOutlined />}
                            onClick={() => openModal()}
                            className="m-0 btn-add"
                        >
                            Thêm biến thể
                        </Button>
                    </div>
                    <Table
                        dataSource={variants}
                        columns={columns}
                        loading={loadingVariants}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total
                        }}
                        onChange={(newPag) => {
                            fetchVariants(newPag.current, newPag.pageSize);
                        }}
                        rowKey="id"
                        bordered
                    />
                </div>

                <Button
                    className="mt-4 btn-pri"
                    type="default"
                    onClick={() => window.history.back()}
                >
                    Quay lại
                </Button>
            </Card>

            <Modal
                className="my-modal"
                title={editingVariant ? "Cập nhật biến thể" : "Thêm biến thể mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSave}
                okText="Lưu biến thể"
                cancelText="Hủy"
                confirmLoading={saving}
                okButtonProps={{ className: "btn-pri" }}
                cancelButtonProps={{ className: "btn-sec" }}
            >
                <Form layout="vertical" form={form} >
                    <Form.Item
                        name="color"
                        label="Màu sắc"
                        rules={[{ required: true, message: "Nhập màu!" }]}
                    >
                        <Input className="input" placeholder="Màu sắc" />
                    </Form.Item>
                    <Form.Item
                        name="size"
                        label="Kích thước"
                        rules={[{ required: true, message: "Nhập kích thước!" }]}
                    >
                        <Input className="input" placeholder="Size (S, M, L...)" />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Giá"
                        rules={[{ required: true, message: "Nhập giá biến thể!" }]}
                    >
                        <Input className="input" type="number" min={1000} placeholder="Giá"/>
                    </Form.Item>
                    <Form.Item
                        name="quantity"
                        label="Số lượng"
                        rules={[{ required: true, message: "Nhập số lượng tồn!" }]}
                    >
                        <Input className="input" type="number" min={1} placeholder="Số lượng" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductDetail;
