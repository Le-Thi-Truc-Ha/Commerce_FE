import { type JSX, useState, useEffect } from "react";
import { Layout, Card, Statistic, Table, Tag, message } from "antd";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart as RePieChart, Pie, Cell, Legend } from "recharts";
import type { OrderDash, SalesDataDash, CategoryDash } from "../../interfaces/adminInterface";
import { dashboardApi } from "../../services/adminService";

const { Content } = Layout;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE", "#FF6699", "#33CC99"];


const Dashboard = (): JSX.Element => {
    const [orders, setOrders] = useState<OrderDash[]>([]);
    const [salesData, setSalesData] = useState<SalesDataDash[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryDash[]>([]);

    const fetchRecentOrders = async () => {
        try {
            const res = await dashboardApi.getRecentOrders();
            setOrders(res.data);
        } catch (e) {
            console.error(e);
            message.error("Lỗi khi tải danh sách đơn hàng gần đây!");
        } 
    };

    const fetchSales = async () => {
        try {
            const res = await dashboardApi.getSalesData();
            setSalesData(res.data);
        } catch (e) {
            console.error(e);
            message.error("Lỗi khi tải doanh thu bán hàng!");
        }
    };

    const fetchCategoriesSale = async () => {
        try {
            const res = await dashboardApi.getCategoriesSale();
            setCategoryData(res.data);
        } catch (e) {
            console.error(e);
            message.error("Lỗi khi tải danh sách doanh thu theo danh mục!");
        }
    };

    useEffect(() => {
        fetchSales();
        fetchCategoriesSale();
        fetchRecentOrders();
    }, []);

    const totalRevenue = salesData ? salesData.reduce((s, r) => s + r.revenue, 0) : 0;
    const totalOrders = salesData ? salesData.reduce((s, r) =>  s + r.orders, 0) : 0;

    const getStatusColor = (statusName: string): string => {
        const normalized = statusName.trim().toLowerCase();
        if (normalized.includes("đã hủy")) return "red";
        if (normalized.includes("chờ") || normalized.includes("xác nhận")) return "orange";
        if (normalized.includes("đang giao")) return "blue";
        if (normalized.includes("đã giao") || normalized.includes("đã nhận")) return "green";
        if (normalized.includes("hoàn")) return "purple";
        return "default";
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", align: "center" as const,
            sorter: (a: OrderDash, b: OrderDash) => a.id - b.id,
            showSorterTooltip: false,
        },
        { title: "Tên khách hàng", dataIndex: "accountName", key: "accountName", align: "center" as const,showSorterTooltip: false,
            sorter: (a: OrderDash, b: OrderDash) => a.accountName.localeCompare(b.accountName),
        },
        { title: "Tổng tiền", dataIndex: "total", key: "total", align: "center" as const, showSorterTooltip: false,
            sorter: (a: OrderDash, b: OrderDash) => a.total - b.total,
            render: (t: number) => (t || 0).toLocaleString("vi-VN") + " đ"
        },
        { title: "Ngày đặt", dataIndex: "orderDate", key: "orderDate", align: "center" as const, showSorterTooltip: false,
            sorter: (a: OrderDash, b: OrderDash) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
            render: (d: string) => new Date(d).toLocaleDateString("vi-VN")},
        { title: "Trạng thái", dataIndex: "currentStatus", key: "currentStatus", align: "center" as const, showSorterTooltip: false,
            sorter: (a: OrderDash, b: OrderDash) => a.currentStatus - b.currentStatus,
            render: (s: string) => <Tag color={getStatusColor(s)} style={{ width: 100, textAlign: "center"}}>{s}</Tag>
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Layout className="site-layout">

                <Content style={{ margin: 16 }}>
                    <div className="container-fluid">
                        <div className="row g-3 mb-3">
                            <div className="col-md-3"><Card><Statistic title="Doanh thu" value={totalRevenue?.toLocaleString("vi-VN") + " đ"} /></Card></div>
                            <div className="col-md-3"><Card><Statistic title="Số đơn hàng" value={totalOrders} /></Card></div>
                            <div className="col-md-3"><Card><Statistic title="Vouchers" value={12} /></Card></div>
                            <div className="col-md-3"><Card><Statistic title="Tồn kho thấp" value={5} /></Card></div>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-md-8">
                                <Card title="Doanh thu / Đơn hàng">
                                    <div style={{ width: "100%", height: 300 }}>
                                        <ResponsiveContainer>
                                            <LineChart data={salesData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis 
                                                    width={90}
                                                    tickFormatter={(value: any) => value.toLocaleString("vi-VN")}  
                                                />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="Doanh thu" />
                                                <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} name="Đơn hàng" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            </div>

                            <div className="col-md-4">
                                <Card title="Doanh thu theo danh mục / Năm">
                                    <div style={{ width: "100%", height: 300 }}>
                                        <ResponsiveContainer>
                                            <RePieChart>
                                                <Pie
                                                    data={categoryData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    outerRadius={90}
                                                    label={({ name, value }) => `${name}: ${value} triệu đ`}
                                                >
                                                    {categoryData?.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    formatter={(value: number) => `${value} triệu đ`}
                                                    labelFormatter={(name: string) => `Danh mục: ${name}`}
                                                />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    align="center"
                                                    iconType="circle"
                                                    iconSize={10}
                                                />
                                            </RePieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-12">
                                <Card title="Đơn hàng gần đây">
                                    <Table
                                        rowKey="id" 
                                        columns={columns} 
                                        dataSource={orders}
                                        pagination={false}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;