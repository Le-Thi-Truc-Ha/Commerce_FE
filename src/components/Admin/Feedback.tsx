import { useState, useEffect } from "react";
import { Table, Input, Select, Rate, DatePicker, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { Feedback } from "../../interfaces/adminInterface";
import { feedbackApi } from "../../services/adminService";
import { messageService } from "../../interfaces/appInterface";
import dayjs, { type Dayjs } from "dayjs";
import "./ProductAdmin.scss";

const { RangePicker } = DatePicker;

const FeedbackAdmin: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [starFilter, setStarFilter] = useState();
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0});

    const fetchFeedbacks = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            const fromDate = dateRange?.[0]?.format("YYYY-MM-DD") ?? undefined;
            const toDate = dateRange?.[1]?.format("YYYY-MM-DD") ?? undefined;

            const res = await feedbackApi.getAll(page, limit, search, starFilter, fromDate, toDate);
            const { feedbacks, total } = res.data;

            setFeedbacks(feedbacks);
            setPagination({ current: page, pageSize: limit, total });
        } catch (e) {
            console.error(e);
            messageService.error("Lỗi khi tải danh sách phản hồi!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks(pagination.current, pagination.pageSize);
    }, []);

    useEffect(() => {
            const timeout = setTimeout(() => {
                fetchFeedbacks(pagination.current, pagination.pageSize);
            }, 500);
    
            return () => clearTimeout(timeout);
        }, [search, starFilter,
            dateRange?.[0] ? dateRange[0].format("YYYY-MM-DD") : null,
            dateRange?.[1] ? dateRange[1].format("YYYY-MM-DD") : null
        ]);

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", align: "center" as const, 
            showSorterTooltip: false,
            sorter: (a: Feedback, b: Feedback) => a.id - b.id
        },
        {
            title: "Khách hàng",
            key: "account",
            align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Feedback, b: Feedback) => a.account.fullName.localeCompare(b.account.fullName),
            render: (f: Feedback) => (f.account.fullName),
        },
        {
            title: "Sản phẩm",
            key: "product",
            align: "center" as const,
            showSorterTooltip: false,
            sorter: (a: Feedback, b: Feedback) => a.productVariant.product.name.localeCompare(b.productVariant.product.name),
            render: (f: Feedback) => `${f.productVariant.product.name} (${f.productVariant.color} - ${f.productVariant.size})`,
        },
        {
            title: "Đánh giá",
            dataIndex: "star",
            key: "star",
            align: "center" as const, 
            showSorterTooltip: false,
            sorter: (a: Feedback, b: Feedback) => a.star - b.star,
            render: (star: number) => <Rate disabled defaultValue={star} />,
        },
        {
            title: "Nội dung phản hồi",
            dataIndex: "content",
            key: "content",
            align: "center" as const,
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: "Ngày phản hồi",
            dataIndex: "feedbackDate",
            key: "date",
            align: "center" as const,
            render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center" as const,
            render: (status: number) =>
                status === 1 ? (
                    <Tag color="green">Hoạt động</Tag>
                ) : (
                    <Tag color="red">Đã xóa</Tag>
                ),
        },
    ];

    return (
        <div className="p-6">
            <div className="header">
                <h2>Quản lý phản hồi của khách hàng</h2>
            </div>
            <div className="filter">
                <Input
                    className="me-3 input"
                    placeholder="Tìm theo khách hàng hoặc sản phẩm"
                    prefix={<SearchOutlined/>}
                    style={{ width: 400 }}
                    onChange={e => setSearch(e.target.value)}
                />
                <Select
                    className="me-3 select"
                    placeholder="Số sao"
                    style={{ width: 200 }}
                    allowClear
                    onChange={val => setStarFilter(val)}
                    options={[
                        { value: "5", label: "5 sao" },
                        { value: "4", label: "4 sao" },
                        { value: "3", label: "3 sao" },
                        { value: "2", label: "2 sao" },
                        { value: "1", label: "1 sao" },
                    ]}
                />
                <RangePicker
                    className="me-3"
                    value={dateRange}
                    onChange={(values) => setDateRange(values as [Dayjs | null, Dayjs | null])}
                    placeholder={["Từ ngày", "Đến ngày"]}
                    style={{ width: 300 }}
                />
            </div>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={feedbacks}
                loading={loading}
                bordered
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total
                }}
                onChange={(newPag) => {
                    fetchFeedbacks(newPag.current, newPag.pageSize);
                }}
            />
        </div>
    );
}

export default FeedbackAdmin;