import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Modal, Form, Input, Select, Upload, Popconfirm } from "antd";
import { UploadOutlined, PlusOutlined, EditOutlined, DeleteOutlined, VideoCameraOutlined, SearchOutlined } from "@ant-design/icons";
import { productApi } from "../../services/adminService";
import type { Product, CategoryProduct } from "../../interfaces/adminInterface";
import "./ProductAdmin.scss"
import { messageService } from "../../interfaces/appInterface";

const { Option } = Select;

const categoryFetures: Record<string, { label: string; key: string, placeholder: string }[]> = {
    "Áo": [
        { label: "Dáng cổ", key: "neckline", placeholder: "Cổ tròn, Cổ V, Cổ sơ mi, ..." },
        { label: "Dáng tay", key: "sleeve", placeholder: "Dài, Ngắn, Phồng, ..." }
    ],
    "Quần": [
        { label: "Chiều dài quần", key: "pantLength", placeholder: "Ngắn, Lửng, dài, ..." },
        { label: "Dáng quần", key: "pantShape", placeholder: "Suông, Ôm, Culottes, Ống loe, ..." }
    ],
    "Đầm": [
        { label: "Chiều dài đầm", key: "dressLength", placeholder: "mini, midi, maxi, ..." },
        { label: "Dáng đầm", key: "dressShape", placeholder: "Suông, Ôm, ..." }
    ],
    "Váy": [
        { label: "Chiều dài váy", key: "skirtLength", placeholder: "mini, midi, maxi, ..." },
        { label: "Dáng váy", key: "skirtShape", placeholder: "Xòe, Bút chì, Chữ A, ..." }
    ]
};

const ProductAdmin: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<CategoryProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [images, setImages] = useState<any[]>([]);
    const [designImage, setDesignImage] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [featureFields, setFeatureFields] = useState<any[]>([]);
    const [form] = Form.useForm();

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
    const [priceFilter, setPriceFilter] = useState<string | undefined>();

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0});

    const fetchCategories = async () => {
        try {
            const res = await productApi.getCategories();
            setCategories(res.data);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải danh mục!");
        }
    };

    const fetchProducts = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            const res = await productApi.getAll(page, limit, search, categoryFilter, priceFilter);
            const { products, total } = res.data;
            setProducts(products);
            setPagination({ current: page, pageSize: limit, total });
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải danh sách sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts(1, pagination.pageSize);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchProducts(1, pagination.pageSize);
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, categoryFilter, priceFilter]);

    const resetFilter = () => {
        setSearch("");
        setCategoryFilter(undefined);
        setPriceFilter(undefined);
    };

    const getFeatures = (category: any) => {
        if (categoryFetures[category.name]) {
            return categoryFetures[category.name];
        }
        
        if (category.parent && categoryFetures[category.parent.name]) {
            return categoryFetures[category.parent.name];
        }
        return []
    }

    useEffect(() => {
        if (selectedCategory) {
            const cat = categories.find((c) => c.id === selectedCategory); 
            setFeatureFields(getFeatures(cat));
        } else {
            setFeatureFields([]); 
        }
    }, [selectedCategory, categories]);

    const handleRemoveImage = (file: any) => {
        setImages((prev) => prev.filter((f) => f.uid !== file.uid));
    };

    const handleRemoveVideo = (file: any) => {
        setVideos((prev) => prev.filter((f) => f.uid !== file.uid));
    };

    const openModal = async (product?: Product) => {
        setIsModalOpen(true);
        if (product) {
            try {
                setLoading(true);
                const res = await productApi.getById(product.id);
                const productData = res.data;
                setEditingProduct(productData);
                form.setFieldsValue({
                    name: productData.name,
                    description: productData.description,
                    categoryId: categories.find(c => c.name === productData.category?.name)?.id,
                    images: productData.medias
                        ?.filter((m: any) => m.type === 1)
                        .map((m: any) => ({
                            uid: m.url,
                            name: m.url.split("/").pop(),
                            url: m.url,
                        })),
                    videos: productData.medias
                        ?.filter((m: any) => m.type === 2)
                        .map((m: any) => ({
                            uid: m.url,
                            name: m.url.split("/").pop(),
                            url: m.url,
                    }))
                });
            } catch (e) {
                console.log(e);
                messageService.error("Không thể tải dữ liệu sản phẩm!");
            } finally {
                setLoading(false);
            }
        } else {
            setEditingProduct(null);
            form.resetFields();
        }
    };

    const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();

            const formData = new FormData();
            const remainingImages: string[] = [];
            const remainingVideos: string[] = [];

            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("price", String(values.price));
            formData.append("categoryId", String(values.categoryId));

            if (values.variants && values.variants.length > 0) {
                formData.append("variants", JSON.stringify(values.variants));
            }

            if (values.fit) formData.append("fit", values.fit);
            if (values.material) formData.append("material", values.material);
            if (values.occasion) formData.append("occasion", values.occasion);
            if (values.season) formData.append("season", values.season);
            if (values.style) formData.append("style", values.style);
            if (values.age) formData.append("age", values.age);
            
            const featureData: Record<string, string> = {};
            featureFields.forEach((f) => {
                if (values[f.key]) {
                    featureData[f.key] = values[f.key];
                }
            });
            formData.append("features", JSON.stringify(featureData));

            if (values.images) {
                values.images.forEach((f: any) => {
                    if (f.originFileObj) {
                        formData.append("files", f.originFileObj);
                    } else if (f.url) {
                        remainingImages.push(f.url);
                    }
                });
            }
            if (values.videos) {
                values.videos.forEach((f: any) => {
                    if (f.originFileObj) {
                        formData.append("files", f.originFileObj);
                    } else if (f.url) {
                        remainingVideos.push(f.url);
                    }
                });
            }

            if (values.designImage && values.designImage.length > 0) {
                const file = values.designImage[0];
                if (file.originFileObj) {
                    formData.append("designImage", file.originFileObj);
                } else if (file.url) {
                    formData.append("existingDesignImage", file.url);
                }
            }

            formData.append("remainingImages", JSON.stringify(remainingImages));
            formData.append("remainingVideos", JSON.stringify(remainingVideos));
            
            if (editingProduct) {
                formData.append("id", String(editingProduct.id));
                await productApi.update(formData);
                messageService.success("Cập nhật sản phẩm thành công!");
            } else {
                await productApi.create(formData);
                messageService.success("Thêm sản phẩm thành công!");
            }
            setIsModalOpen(false);
            fetchProducts(1, pagination.pageSize);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi lưu sản phẩm!");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await productApi.delete(id);
            messageService.success("Xóa sản phẩm thành công!");
            fetchProducts(1, pagination.pageSize);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi xóa sản phẩm!");
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", width: 80, align: "center" as const, 
            showSorterTooltip: false,
            sorter: (a: Product, b: Product) => a.id - b.id
        },
        { title: "Tên sản phẩm", dataIndex: "name", key: "name", align: "center" as const, 
            showSorterTooltip: false, 
            sorter: (a: Product, b: Product) => a.name.localeCompare(b.name)
        },
        {
            title: "Danh mục",
            dataIndex: "categoryName",
            key: "categoryName",
            align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Product, b: Product) => a.categoryName.localeCompare(b.categoryName)
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            align: "center" as const,
            showSorterTooltip: false, 
            sorter: (a: Product, b: Product) => a.price - b.price,
            render: (v: number) => `${v.toLocaleString()}đ`,
        },
        {
            title: "Số lượng còn",
            dataIndex: "quantity",
            key: "quantity",
            align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Product, b: Product) => (a.quantity ?? 0) - (b.quantity ?? 0), 
            render: (q: number) => (q ?? 0),
        },
        {
            title: "Chi tiết",
            key: "details",
            align: "center" as const,
            render: (_: unknown, record: Product) => (
                <Button
                    type="link"
                    onClick={() => navigate(`/admin/product/${record.id}`)}
                >
                    Xem chi tiết
                </Button>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center" as const,
            render: (_: unknown, record: Product) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        type="link"
                        onClick={() => openModal(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa sản phẩm này?"
                        onConfirm={() => handleDelete((record as any).id)}
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
        <div className="p-6">
            <div className="header">
                <h2>Quản lý sản phẩm</h2>
                <Button
                    icon={<PlusOutlined />}
                    onClick={() => openModal()}
                    className="m-0 btn-add"
                >
                    Thêm sản phẩm
                </Button>
            </div>

            <div className="flex gap-3 mb-5 filter">
                <Input
                    placeholder="Tìm theo tên sản phẩm . . . . . . "
                    className="me-3 input"
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e: any) => setSearch(e.target.value)}
                    style={{ width: 300 }}
                />
                <Select
                    placeholder="Danh mục"
                    className="me-3 select"
                    allowClear
                    style={{ width: 300 }}
                    value={categoryFilter}
                    onChange={(val: any) => setCategoryFilter(val)}
                >
                {   
                    categories.map((cat) => (
                        <Option key={cat.id} value={cat.name}>
                            {cat.name}
                        </Option>
                    ))
                }
                </Select>
                <Select
                    placeholder="Giá"
                    className="me-5 select"
                    allowClear
                    style={{ width: 200 }}
                    value={priceFilter}
                    onChange={(val: any) => setPriceFilter(val)}
                >
                    <Option value="low">Dưới 100.000 đ</Option>
                    <Option value="mid">100.000 - 500.000 đ</Option>
                    <Option value="high">Trên 500.000 đ</Option>
                </Select>
                <Button onClick={resetFilter} className="btn-reset">Đặt lại</Button>
            </div>

            <Table
                dataSource={products}
                columns={columns}
                rowKey="id"
                loading={loading}
                bordered
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total
                }}
                onChange={(newPag: any) => {
                    fetchProducts(newPag.current, newPag.pageSize);
                }}
            />

            <Modal
                className="my-modal"
                title={editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
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
                <Form layout="vertical" form={form}>
                    <div className={`grid ${editingProduct ? "grid-cols-2" : "grid-cols-3"} gap-6`}>
                        <div className="col-span-1">
                            <Form.Item
                                label="Tên sản phẩm"
                                name="name"
                                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
                            >
                                <Input className="input" />
                            </Form.Item>
                            <Form.Item
                                label="Mô tả"
                                name="description"
                                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                            >
                                <Input.TextArea rows={3} className="input" />
                            </Form.Item>
                            <Form.Item
                                label="Danh mục"
                                name="categoryId"
                                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                            >
                                <Select 
                                    placeholder="Chọn danh mục" 
                                    className="select"
                                    onChange={(val: any) => setSelectedCategory(val)}
                                >
                                {
                                    categories.map((cat) => (
                                    <Option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </Option>
                                ))}
                                </Select>
                            </Form.Item>
                            {featureFields.map((f) => (
                                <Form.Item
                                    key={f.key}
                                    label={f.label}
                                    name={f.key}
                                    rules={[{ required: true, message: `Vui lòng nhập ${f.label.toLowerCase()}!` }]}
                                >
                                    <Input placeholder={f.placeholder} className="input" />
                                </Form.Item>
                            ))}
                            <Form.Item
                                label="Ảnh sản phẩm"
                                name="images"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload 
                                    listType="picture-card" 
                                    multiple 
                                    beforeUpload={() => false}
                                    showUploadList={{
                                        showPreviewIcon: false,
                                        showRemoveIcon: true
                                    }}
                                    fileList={images}
                                    onChange={(fileList: any) => setImages(fileList)}
                                    onRemove={handleRemoveImage}
                                >
                                <div>
                                    <UploadOutlined /> Tải lên ảnh
                                </div>
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                label="Video sản phẩm"
                                name="videos"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    className="upload"
                                    accept="video/*"
                                    listType="text"
                                    multiple
                                    beforeUpload={() => false}
                                    fileList={videos}
                                    onChange={( fileList: any ) => setVideos(fileList)}
                                    onRemove={handleRemoveVideo}
                                >
                                    <Button icon={<VideoCameraOutlined />}>Tải lên Video</Button>
                                </Upload>
                            </Form.Item>
                        </div>
                        
                        {!editingProduct && (
                            <>
                            <label className="font-semibold mb-2 block"> Đặc trưng</label>
                            <div className="col-span-1">
                                <Form.Item
                                    label="Liền thân"
                                    name="fit"
                                    rules={[{ required: true, message: "Vui lòng chọn liền thân!" }]}
                                >
                                    <Select 
                                        className="select"
                                        placeholder="Chọn liền thân"
                                        style={{ width: 200 }}
                                    >
                                        <Option value="Có">Có</Option>
                                        <Option value="Không">Không</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Chất liệu"
                                    name="material"
                                    rules={[{ required: true, message: "Vui lòng nhập chất liệu!" }]}
                                >
                                    <Input className="input" placeholder="Cotton, Jean, Lụa, Da, Nỉ, Len, ..."/>
                                </Form.Item>
                                <Form.Item
                                    label="Mục đích"
                                    name="occasion"
                                    rules={[{ required: true, message: "Vui lòng nhập mục đích!" }]}
                                >
                                    <Input className="input" placeholder="Công sở, Dạo phố, Dự tiệc, Thể thao, Hàng ngày, ..."/>
                                </Form.Item>
                                <Form.Item
                                    label="Mùa"
                                    name="season"
                                    rules={[{ required: true, message: "Vui lòng nhập mùa" }]}
                                >
                                    <Input className="input" placeholder="Xuân, Hè, Thu, Đông"/>
                                </Form.Item>
                                <Form.Item
                                    label="Xu hướng"
                                    name="style"
                                    rules={[{ required: true, message: "Vui lòng nhập xu hướng!" }]}
                                >
                                    <Input className="input" placeholder="Vintage, Basic, Streetwear, Elegant, Sporty, ..."/>
                                </Form.Item>
                                <Form.Item
                                    label="Độ tuổi"
                                    name="age"
                                    rules={[{ required: true, message: "Vui lòng nhập độ tuổi!" }]}
                                >
                                    <Input className="input" placeholder="Trẻ, Trung niên, Già, ..."/>
                                </Form.Item>
                                <Form.Item
                                    label="Ảnh thiết kế gốc"
                                    name="designImage"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                    rules={[{ required: true, message: "Vui lòng tải lên ảnh thiết kế gốc!" }]}
                                >
                                    <Upload 
                                        listType="picture-card" 
                                        beforeUpload={() => false}
                                        maxCount={1}
                                        showUploadList={{
                                            showPreviewIcon: false,
                                            showRemoveIcon: true
                                        }}
                                        fileList={designImage}
                                        onChange={(fileList: any) => {setDesignImage(fileList)}}
                                        onRemove={() => setDesignImage([])}
                                    >
                                        <div>
                                            <UploadOutlined /> Tải lên ảnh
                                        </div>
                                    </Upload>
                                </Form.Item>
                            </div>
                            <div className="col-span-1 overflow-y-auto max-h-[70vh] pr-2">
                                <label className="font-semibold mb-2 block">Biến thể sản phẩm</label>
                                <Form.List name="variants">
                                    {(fields: any,  add: any, remove: any) => (
                                        <>
                                            {fields.map(( key: number, name: string, ...restField: any ) => (
                                                <div
                                                    key={key}
                                                    className="mb-3 p-3 border rounded-lg bg-gray-50 flex flex-col gap-2"
                                                >
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "color"]}
                                                        rules={[{ required: true, message: "Nhập màu!" }]}
                                                    >
                                                        <Input className="input" placeholder="Màu sắc" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "size"]}
                                                        rules={[{ required: true, message: "Nhập kích thước!" }]}
                                                    >
                                                        <Input className="input" placeholder="Size (S, M, L...)" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "price"]}
                                                        rules={[{ required: true, message: "Nhập giá biến thể!" }]}
                                                    >
                                                        <Input className="input" type="number" min={1000} placeholder="Giá"/>
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "quantity"]}
                                                        rules={[{ required: true, message: "Nhập số lượng tồn!" }]}
                                                    >
                                                        <Input className="input" type="number" min={1} placeholder="Số lượng" />
                                                    </Form.Item>
                                                    <Button
                                                        danger
                                                        type="link"
                                                        className="self-end"
                                                        onClick={() => remove(name)}
                                                    >
                                                        Xóa biến thể
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                block
                                                icon={<PlusOutlined />}
                                            >
                                                Thêm biến thể
                                            </Button>
                                        </>
                                    )}
                                </Form.List>
                            </div>
                            </>
                        )}
                    </div>                    
                </Form>
            </Modal>
        </div>
    );
};

export default ProductAdmin;
