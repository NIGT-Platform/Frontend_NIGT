import { axiosInstance } from '../lib/axios';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQty: number;
  sku?: string;
  isActive: boolean;
  categoryId: string;
  category?: ProductCategory;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface OrderItem {
  id: string;
  productName: string;
  productPrice: number;
  quantity: number;
  product: Product;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  id: string;
  referenceNumber: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  buyer?: { firstName: string; lastName: string; email: string; phoneNumber?: string };
}

// ─────────────────────────────────────────────
// Admin — Categories
// ─────────────────────────────────────────────

export const adminGetCategories = async (): Promise<ProductCategory[]> => {
  const res = await axiosInstance.get('/admin/shop/categories');
  return res.data.categories;
};

export const adminCreateCategory = async (name: string, slug: string): Promise<ProductCategory> => {
  const res = await axiosInstance.post('/admin/shop/categories', { name, slug });
  return res.data.category;
};

export const adminUpdateCategory = async (id: string, name: string, slug: string): Promise<ProductCategory> => {
  const res = await axiosInstance.put(`/admin/shop/categories/${id}`, { name, slug });
  return res.data.category;
};

export const adminDeleteCategory = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/admin/shop/categories/${id}`);
};

// ─────────────────────────────────────────────
// Admin — Products
// ─────────────────────────────────────────────

export const adminGetProducts = async (params?: { categoryId?: string; search?: string; isActive?: boolean }): Promise<Product[]> => {
  const res = await axiosInstance.get('/admin/shop/products', { params });
  return res.data.products;
};

export const adminCreateProduct = async (data: {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stockQty: number;
  sku?: string;
  isActive?: boolean;
}): Promise<Product> => {
  const res = await axiosInstance.post('/admin/shop/products', data);
  return res.data.product;
};

export const adminUpdateProduct = async (
  id: string,
  data: Partial<{
    categoryId: string;
    name: string;
    description: string;
    price: number;
    stockQty: number;
    sku: string;
    isActive: boolean;
  }>
): Promise<Product> => {
  const res = await axiosInstance.put(`/admin/shop/products/${id}`, data);
  return res.data.product;
};

export const adminDeleteProduct = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/admin/shop/products/${id}`);
};

export const adminGetProduct = async (id: string): Promise<Product> => {
  const res = await axiosInstance.get(`/admin/shop/products?search=`);
  // fallback: get from shop endpoint
  const res2 = await axiosInstance.get(`/shop/products/${id}`);
  return res2.data.product;
};

// ─────────────────────────────────────────────
// Admin — Product Images
// ─────────────────────────────────────────────

export const adminAddProductImage = async (productId: string, formData: FormData): Promise<ProductImage> => {
  const res = await axiosInstance.post(`/admin/shop/products/${productId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.image;
};

export const adminDeleteProductImage = async (imageId: string): Promise<void> => {
  await axiosInstance.delete(`/admin/shop/products/images/${imageId}`);
};

// ─────────────────────────────────────────────
// Admin — Orders
// ─────────────────────────────────────────────

export const adminGetOrders = async (params?: { status?: string; search?: string }): Promise<Order[]> => {
  const res = await axiosInstance.get('/admin/shop/orders', { params });
  return res.data.orders;
};

export const adminUpdateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  const res = await axiosInstance.patch(`/admin/shop/orders/${orderId}/status`, { status });
  return res.data.order;
};

// ─────────────────────────────────────────────
// Public Shop — Categories & Products
// ─────────────────────────────────────────────

export const getCategories = async (): Promise<ProductCategory[]> => {
  const res = await axiosInstance.get('/shop/categories');
  return res.data.categories;
};

export const getProducts = async (params?: { categoryId?: string; search?: string }): Promise<Product[]> => {
  const res = await axiosInstance.get('/shop/products', { params });
  return res.data.products;
};

export const getProduct = async (id: string): Promise<Product> => {
  const res = await axiosInstance.get(`/shop/products/${id}`);
  return res.data.product;
};

// ─────────────────────────────────────────────
// Cart
// ─────────────────────────────────────────────

export const getCart = async (): Promise<Cart> => {
  const res = await axiosInstance.get('/shop/cart');
  return res.data.cart;
};

export const addToCart = async (productId: string, quantity = 1): Promise<CartItem> => {
  const res = await axiosInstance.post('/shop/cart/items', { productId, quantity });
  return res.data.cartItem;
};

export const updateCartItem = async (itemId: string, quantity: number): Promise<void> => {
  await axiosInstance.patch(`/shop/cart/items/${itemId}`, { quantity });
};

export const removeCartItem = async (itemId: string): Promise<void> => {
  await axiosInstance.delete(`/shop/cart/items/${itemId}`);
};

export const clearCart = async (): Promise<void> => {
  await axiosInstance.delete('/shop/cart');
};

// ─────────────────────────────────────────────
// Orders (Buyer)
// ─────────────────────────────────────────────

export const placeOrder = async (shippingAddress: string, notes?: string): Promise<Order> => {
  const res = await axiosInstance.post('/shop/orders', { shippingAddress, notes });
  return res.data.order;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const res = await axiosInstance.get('/shop/orders');
  return res.data.orders;
};

export const getMyOrder = async (id: string): Promise<Order> => {
  const res = await axiosInstance.get(`/shop/orders/${id}`);
  return res.data.order;
};
