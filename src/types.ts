export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  variants: Variant[];
  keyword: string;
  category: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

export interface Variant {
  id: string;
  name: string;
  stock: number;
  sku: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  lastOrderAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'invoiced' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  source: 'live' | 'website' | 'manual';
  createdAt: string;
  paidAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
}

export interface LiveComment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  isOrder: boolean;
  productId?: string;
}

export interface LiveSession {
  id: string;
  title: string;
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok';
  status: 'scheduled' | 'live' | 'ended';
  startedAt?: string;
  endedAt?: string;
  viewerCount: number;
  totalSales: number;
  totalOrders: number;
  productQueue: string[];
  activeProductId?: string;
}

export type Page = 'dashboard' | 'products' | 'live' | 'orders' | 'customers' | 'settings';
