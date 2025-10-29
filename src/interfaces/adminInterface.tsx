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

/** Quản lý đơn hàng */
export interface Status {
    id: number;
    name: string;
}

export interface Order {
    id: number;
    account: { fullName: string };
    total: number;
    orderDate: string;
    orderStatus: { id: number, name: string };
    address: { address: string };
}

export interface Order {
    id: number;
    account: { fullName: string };
    total: number;
    orderDate: string;
    orderStatus: { id: number, name: string };
    address: { address: string } ;
}

export interface OrderBill {
    id: number;
    total: number;
    orderDate: string;
    orderStatus: { id: number, name: string };
    address: { address: string, name: string } ;
    orderVouchers: {
        voucher: {
            code: string;
            type: number;
            discountPercent: number;
        }
    }[];
    totalVoucher: number;
    orderDetails: OrderDetail[];
    orderHistories: OrderHistory[];
    bills: Bill[];
}

export interface OrderDetail {
    id: number;
    productVariant: {
        price: number;
        color: string;
        size: string;
        product: {
            name: string;
        };
    };
    productName: string;
    quantity: number;
    
}

export interface OrderHistory {
    date: string;
    orderStatus: { id: number, name: string };
    note?: string;
}

export interface Bill {
    id: number;
    paymentMethod: string;
    shippingFee: { cost: number };
    total: number;
    invoiceTime: string;
    paymentTime?: string;
}
