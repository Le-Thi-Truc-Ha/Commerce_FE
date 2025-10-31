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



/** Quản lý khách hàng */
export interface Customer {
    id: number;
    fullName: string;
    email: string;
    gender?: string;
    dob?: string;
    status: number;
    phoneNumber?: string;
}

export interface Address {
    id: number;
    address: string;
    name: string;
    phoneNumber: string;
}

export interface Orders {
    id: number;
    orderDate: string;
    orderStatus: {
        id: number;
        name: string;
    };
    bills: { total: number };
}

export interface OrderCustomer {
    id: number;
    orders: Orders[];
}

export interface CustomerDetail {
    id: number;
    addresses: Address[];
}
/** Quản lý ưu đãi */
export interface ProductPromotion {
    product: {
        id: number;
        name: string;
        category: { id: number, name: string };
    }
}

export interface Promotion {
    id: number;
    percent: number;
    startDate: string;
    endDate: string;
    status: number
    productPromotions: ProductPromotion[];
}

/** Quản lý voucher */
export interface CategoryVoucher {
    category: {
        id: number;
        name: string;
    }
}

export interface Voucher {
    id: number;
    code: string;
    name: string;
    discountPercent: number;
    startDate: string;
    endDate: string;
    quantity: number;
    type: number;
}

export interface VoucherID {
    id: number;
    code: string;
    name: string;
    discountPercent: number;
    startDate: string;
    endDate: string;
    quantity: number;
    type: number;
    condition: number;
    description: string;
    voucherCategories: CategoryVoucher[];
}

export interface VoucherDetail {
    id: number;
    type: number;
    description: string;
    condition: number;
    voucherCategories: CategoryVoucher[];
}

/** Quản lý danh mục hàng */
export interface Category {
    id: number;
    name: string;
    parent?: {
        id: number;
        name: string;
    };
    totalProducts: number;
}

/** Quản lý phản hồi */
export interface Feedback {
    id: number;
    content: string;
    feedbackDate: string;
    star: number;
    status: number;
    account: { fullName: string };
    productVariant: {
        color: string;
        size: string;
        product: { name: string };
    };
}
