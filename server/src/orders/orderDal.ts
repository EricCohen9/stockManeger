import { handleDBResponseError } from "../utils/handleErrors";
import {OrderInterface} from "../interfaces/orderInterface";
import { Types, Document, Model } from "mongoose";
import { ProductModel, ShippingDetailsModel, OrderModel, OrderForHoursModel } from "../mongoDB/Schemas/order";


type CollectionResult = Promise<Document[] | Error>;

export const getAllOrders = async (): CollectionResult => {
  try {
    console.log("db");
    
    const orders = await OrderModel.find({});
    
    return orders;
  } catch (error) {
    return handleDBResponseError(error);
  }
};

export const updateByOrderId = async (orderId: Types.ObjectId, updatedData: OrderInterface) => {
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, updatedData, { new: true });
    if (!updatedOrder) throw new Error('Order not found!');
    return updatedOrder;
  } catch (error) {
    return handleDBResponseError(error);
  }
};

export const addNewOrder = async (orderData: OrderInterface) => {
  try {
    const newOrder = new OrderModel({
      cartItems: orderData.cartItems,
      orderTime: orderData.orderTime,
      status: orderData.status,
      price: orderData.price,
      shippingDetails: orderData.shippingDetails,
    });

    newOrder.isNew = true;
    await newOrder.save();
    return newOrder;
  } catch (error) {
    return handleDBResponseError(error);
  }
};

export const getOrdersByUserId = async (userId: string): CollectionResult => {
  try {
    const orders = await OrderModel.find({ "shippingDetails.userId": userId });
    return orders;
  } catch (error) {
    return handleDBResponseError(error);
  }
};

export const deleteByOrderId = async (orderId: string) => {
  try {
    const orderDelete = await OrderModel.findOneAndDelete({ _id:orderId });
    if (!orderDelete) {
      console.log(`Order with ID ${orderId} not found`);
      throw new Error(`Order with ID ${orderId} not found!`);
    }
    return "delete successful"
  } catch (error) {
    return handleDBResponseError(error);
  }
};
export const getOrdersForHours = async () =>{
  try{
    const OrdersForHours = await OrderForHoursModel.find({})
    const countHours = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    OrdersForHours.map((Order)=>{
      const date = new Date(Order.time as string)
      countHours[date.getHours()]++
    })
    return countHours
  }catch (error) {
    return handleDBResponseError(error);
  }

}
