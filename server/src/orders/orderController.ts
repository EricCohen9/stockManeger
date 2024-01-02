import { Types } from 'mongoose';
import { Request, Response } from 'express';
import {OrderInterface} from '../interfaces/orderInterface';
import {
  getAllOrdersService,
  updateByOrderIdService,
  addNewOrderService,
  getOrdersByUserIdService,
  deleteOrdersByOrderIdService,
  getOrdersForHoursService
} from './orderService';
import { handleError } from '../utils/handleErrors';

export const handleGetAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await getAllOrdersService();
    res.send(orders);
  } catch (error) {
    handleError(res, error);
  }
};

export const handleUpdateByOrderId = async (req: Request, res: Response) => {
  try {
    const orderId = new Types.ObjectId(req.params.orderId);
    const updatedData = req.body as OrderInterface;
    const updatedOrder = await updateByOrderIdService(orderId, updatedData);
    res.send(updatedOrder);
  } catch (error) {
    handleError(res, error);
  }
};

export const handleAddNewOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body as OrderInterface;
    const newOrder = await addNewOrderService(orderData);
    res.json({ newOrder:newOrder,productNotFound:res.locals.productNotFound });
  } catch (error) {
    handleError(res, error);
  }
};

export const handleGetOrdersByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const ordersByUser = await getOrdersByUserIdService(userId);
    res.send(ordersByUser);
  } catch (error) {
    handleError(res, error);
  }
};


export const handleDeleteOrdersByOrderId = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const ordersByUser = await deleteOrdersByOrderIdService(orderId);
    res.send({ message: 'Order deleted successfully'});
  } catch (error) {
    handleError(res, error);
  }
};

export const getOrdersForHoursController = async (req: Request, res: Response) => {
  try{
    const ordersForHours = await getOrdersForHoursService()
    res.send(ordersForHours)
  }catch(error) {
    handleError(res, error);
  }
}