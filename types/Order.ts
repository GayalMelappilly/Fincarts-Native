export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  fish_listings: {
    id: string;
    name: string;
    images: string[];
    price: number;
  };
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
}

export interface ShippingDetails {
  id: string;
  carrier: string;
  receipt: string;
  tracking_number: string;
  shipping_method: string;
  estimated_delivery: string;
  actual_delivery: string;
}

export interface PaymentDetails {
  id: string;
  payment_method: string;
  status: string;
  payment_date: string;
}

export interface Order {
  id: string;
  order_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  users: User;
  order_items: OrderItem[];
  shipping_details: ShippingDetails;
  payment_details: PaymentDetails;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
    summary: {
      totalRevenue: number;
      totalOrders: number;
      statusBreakdown: Record<string, number>;
    };
  };
}