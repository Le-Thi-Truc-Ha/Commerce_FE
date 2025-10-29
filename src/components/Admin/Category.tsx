import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select, Modal, Form, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Category } from "../../interfaces/adminInterface";
import { categoryApi, voucherApi } from "../../services/adminService";
import { messageService } from "../../interfaces/appInterface";
import "./ProductAdmin.scss";


const CategoryAdmin: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesP, setCategoriesP] = useState<{ id: number, name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const [saving, setSaving] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [search, setSearch] = useState("");
    const [form] = Form.useForm();

    const [pagination, setPagination] = useState({ current: 1, pageSize: 8, total: 0});

    const fetchCategories = async (page: number = 1, limit: number = 8) => {
        try {
            setLoading(true);
            const res = await categoryApi.getAll(page, limit, search);
            const { categories, total } = res.data;

            setCategories(categories);
            setPagination({ current: page, pageSize: limit, total });
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải danh mục hàng!");
        } finally {
            setLoading(false);
        }
    }

    const fetchCategoriesP = async () => {
        try {
            setLoadingCategory(true);
            const res = await voucherApi.getCategories("");
            setCategoriesP(res.data);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải danh mục hàng!");
        } finally {
            setLoadingCategory(false);
        }
    }

    useEffect(() => {
        fetchCategories(pagination.current, pagination.pageSize);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchCategories(pagination.current, pagination.pageSize);
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    let searchTimeout: NodeJS.Timeout;
    const handleSearchCategory = (value: string) => {
        setLoadingCategory(true);
        if (!value.trim()) {
            setCategoriesP([]);
            return;
        }

        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            try {
                const res = await voucherApi.getCategories(value);
                setCategoriesP(res.data);
            } catch (e) {
                console.error(e);
                messageService.error("Lỗi khi tải danh mục!");
            } finally {
                setLoadingCategory(false);
            }
        }, 500);
    };

    const handleAdd = () => {
        setEditing(null);
        form.resetFields();
        setModalVisible(true);
        fetchCategoriesP();
    };

    const handleEdit = (category: Category) => {
        setModalVisible(true);
        setEditing(category);
        fetchCategoriesP().then(() => {
            form.setFieldsValue({
                name: category.name,
                parentId: category.parent?.id || null,
            });
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await categoryApi.delete(id);
            messageService.success("Xóa danh mục thành công!");
            fetchCategories(pagination.current, pagination.pageSize);
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi xóa danh mục!");
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();
            console.log(values);

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("parentId", values.parentId.toString());


            if (editing) {
                formData.append("id", editing.id.toString());
                await categoryApi.update(formData);
                messageService.success("Cập nhật danh mục hàng thành công!");
            } else {
                await categoryApi.create(formData);
                messageService.success("Thêm danh mục hàng thành công!");
            }
            fetchCategories(pagination.current, pagination.pageSize);
            setModalVisible(false);
        } catch (e){
            console.log(e);
            messageService.error("Lỗi khi lưu danh mục hàng!");
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        {   title: "ID", dataIndex: "id", key: "id", align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Category, b: Category) => a.id - b.id
        },
        {   title: "Tên danh mục", dataIndex: "name", key: "name", align: "center" as const,
            showSorterTooltip: false, 
            sorter: (a: Category, b: Category) => a.name.localeCompare(b.name)
        },
        {
            title: "Danh mục cha",
            dataIndex: "parentId",
            key: "parent",
            align: "center" as const,
            showSorterTooltip: false, 
            sorter: (a: Category, b: Category) => (a.parent?.name || "").localeCompare(b.parent?.name || ""),
            render : (_: any, record: Category) => record.parent?.name || "—"
        },
        {
            title: "Tổng sản phẩm",
            dataIndex: "totalProducts",
            key: "totalProducts",
            align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Category, b: Category) => a.totalProducts - b.totalProducts
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center" as const,
            render: (_: any, record: Category) => {
                const hasChildren = categories.some(c => c.parent?.id === record.id);
                if (hasChildren) {
                    return (
                        <>
                            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                            <Button type="link" danger icon={<DeleteOutlined />} onClick={() => messageService.error("Danh mục này có danh mục con, không thể xóa!")}>Xóa</Button>
                        </>
                    );
                }
                return (
                    <>
                        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                        <Popconfirm
                            title="Xác nhận xóa danh mục này?"
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
                );
    
            },
        },
    ];

    return (
        <div className="P-6">
            <div className="header">
                <h2>Quản lý danh mục hàng</h2>
                <Button 
                    className="btn-pri"
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={handleAdd}>
                        Thêm danh mục
                </Button>
            </div>
            <div className="filter mb-3">
                <Input
                    className="input"
                    placeholder="Tìm theo tên danh mục . . . . . ."
                    value={search}
                    prefix={<SearchOutlined />}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: 400 }}
                />
            </div>
            <Table
                columns={columns}
                dataSource={categories}
                rowKey="id"
                loading={loading}
                bordered
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total
                }}
                onChange={(newPag) => {
                    fetchCategories(newPag.current, newPag.pageSize);
                }}
            />
            <Modal
                className="my-modal"
                open={modalVisible}
                title={editing ? "Cập nhật danh mục hàng" : "Thêm danh mục hàng mới"}
                onCancel={() => setModalVisible(false)}
                onOk={handleSave}
                okText="Lưu"
                cancelText="Hủy"
                confirmLoading={saving}
                okButtonProps={{ className: "btn-pri" }}
                cancelButtonProps={{ className: "btn-sec" }}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item
                        label="Tên danh mục"
                        name="name"
                        rules={[{ required: true, message: "Nhập tên danh mục!" }]}
                    >
                        <Input className="input"/>
                    </Form.Item>
                    <Form.Item
                        label="Danh mục cha"
                        name="parentId"
                    >
                        <Select
                            className="select"
                            showSearch
                            placeholder="Chọn danh mục..."
                            filterOption={false}
                            onSearch={handleSearchCategory}
                            loading={loadingCategory}
                            options={categoriesP.map(c => ({ label: c.name, value: c.id }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryAdmin;
