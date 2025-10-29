/** Dashboard */
export interface OrderDash { 
    id: number; 
    accountName: string;
    total: number; 
    orderDate: string; 
    currentStatus: number
};

export interface SalesDataDash {
    month: string;
    revenue: number;
    orders: number;
}

export interface CategoryDash {
    name: string;
    value: number;
    [key: string]: string | number;
}

/** Quản lý sản phẩm */
export interface CategoryProduct {
    id: number;
    name: number;
    parent: { id: number; name: string};
}

export interface Product {
    id: number;
    name: string;
    categoryName: string;
    price: number;
    quantity: number;
}

export interface Media {
    url: string;
    type: number;
}

export interface ProductDetail {
    name: string;
    description: string;
    saleFigure: number;
    rateStar: number;
    category: { name: string };
    medias: Media[];
}

export interface ProductVariant {
    id: number;
    size: string;
    color: string;
    price: number;
    quantity: number;
}
