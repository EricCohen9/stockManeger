import mongoose, { Schema, Document, Model } from 'mongoose';

const productSchema = new Schema({
  id: String,
  name: String, 
  description: String,
  price: Number,
  quantity: Number  
});

const shippingDetailsSchema = new Schema({
  address: String,
  userId: Number,
  contactNumber: String, 
  orderType: String,
  id: String
});

const orderSchema = new Schema({
  id: String,
  cartItems: [productSchema],
  orderTime: String,
  status: String,
  price: Number,
  shippingDetails: shippingDetailsSchema 
});

const ordersforhoursSchema = new Schema({
  time: String
})

export const ProductModel = mongoose.model('Product', productSchema);
export const ShippingDetailsModel = mongoose.model('ShippingDetails', shippingDetailsSchema);
export const OrderModel = mongoose.model('Order', orderSchema);
export const OrderForHoursModel = mongoose.model('OrderForHours', ordersforhoursSchema);