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
