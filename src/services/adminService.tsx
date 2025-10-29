import axios from "../configs/axios";

export const dashboardApi = {
    async getRecentOrders() {
        return axios.get("/admin/recent-orders");
    },
    async getSalesData() {
        return axios.get("/admin/sales-data");
    },
    async getCategoriesSale() {
        return axios.get("/admin/categories-sale");
    },
};
