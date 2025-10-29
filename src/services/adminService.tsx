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

export const productApi = {
    async getAll(page: number, limit: number, search?: string, category?: string, price?: string) {
        return await axios.get("/admin/products", { params: { page, limit, search, category, price }});
    },
    async getById(id: number) {
        return axios.get("/admin/product-id", { params: { id }});
    },
    async getDetail(id: number) {
        return axios.get("/admin/product-detail", { params: { id }});
    },
    async getCategories() {
        return axios.get("/admin/product-categories");
    },
    async create(formData: FormData) {
        return axios.post("/admin/create-product", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    async update(formData: FormData) {
        return axios.put("/admin/update-product", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    async delete(id: number) {
        return axios.delete("/admin/delete-product", { params: { id }});
    },
};
