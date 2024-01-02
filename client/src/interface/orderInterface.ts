export interface OrderInterface {
  _id: string;
  cartItems: Product[];
  orderTime: string;
  status: string;
  price: number;
  shippingDetails: ShippingDetails;
}
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}
export interface ShippingDetails {
  address: string;
  userId: number;
  contactNumber: string;
  orderType: string;
  id: string;
}

export interface CostumeOrders {
  id: string;
  price: number;
  address: string;
  orderType: string;
  status: string;
  orderTime: string;
  userId: number;
}
