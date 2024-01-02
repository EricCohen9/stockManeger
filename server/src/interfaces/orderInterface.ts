export interface OrderInterface {
  id?: string;
  cartItems?: Product[];
  orderTime?: string;
  status?: string;
  price?: number;
  shippingDetails?: ShippingDetails;
}
export interface Product {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
}
export interface ShippingDetails {
  address?: string;
  userId?: number;
  contactNumber?: string;
  orderType?: string;
  id?: string;
}


