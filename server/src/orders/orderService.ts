
import chalk from "chalk";
import { Types } from "mongoose";
import { OrderInterface } from "../interfaces/orderInterface";
import { getAllOrders, updateByOrderId, addNewOrder, getOrdersByUserId, deleteByOrderId, getOrdersForHours } from "./orderDal";
import redisClient from "../redis/redis";


const ALL_ORDERS_CACHE_KEY = "allOrders";

const getUserOrdersCacheKey = (userId: string) => `ordersByUser:${userId}`;

const getFromCache = async (key: string) => {
  try {
    const cachedData = await redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.log(chalk.redBright(`Error retrieving data from cache (${key}):`, error));
    throw error;
  }
};

const setToCache = async (key: string, data: any, ttlSeconds: number = 10) => {
  try {
    await redisClient.set(key, JSON.stringify(data));
    await redisClient.expire(key, ttlSeconds);
  } catch (error) {
    console.log(chalk.redBright(`Error setting data to cache (${key}):`, error));
    throw error;
  }
};


const clearAllOrdersCache = async () => {
  try {
    await redisClient.del(ALL_ORDERS_CACHE_KEY);
  } catch (error) {
    console.log(chalk.redBright("Error clearing all orders cache:", error));
    throw error;
  }
};

export const getAllOrdersService = async () => {
  try {
    const cachedOrders = await getFromCache(ALL_ORDERS_CACHE_KEY);
    if (cachedOrders) {
      return cachedOrders;
    }

    const ordersFromDAL = await getAllOrders();
    if (!Array.isArray(ordersFromDAL) || ordersFromDAL.length === 0) {
      throw new Error("No orders in the database");
    }

    const ordersData = ordersFromDAL.map(order => order.toObject());

    await setToCache(ALL_ORDERS_CACHE_KEY, ordersData);

    return ordersData;
  } catch (error) {
    console.log(chalk.redBright("Error in getAllOrdersService:", error));
    throw error;
  }
};


export const updateByOrderIdService = async (orderId: Types.ObjectId, updatedData: OrderInterface) => {
  try {
    await clearAllOrdersCache();

    const updatedOrderFromDAL = await updateByOrderId(orderId, updatedData);
    const key = `orders:${updatedOrderFromDAL.id}`;
    const dataFromRedis = await redisClient.get(key);
    if (dataFromRedis) {
      console.log("Data retrieved from Redis");
      return JSON.parse(dataFromRedis);
    }
    await redisClient.setEx(key,200, JSON.stringify(updatedOrderFromDAL));
    return updatedOrderFromDAL;
  } catch (error) {
    console.log(chalk.redBright("Error in updateByOrderIdService:", error));
    throw error;
  }
};

export const addNewOrderService = async (orderData: OrderInterface) => {
  try {
    await clearAllOrdersCache();

    const newOrderFromDAL = await addNewOrder(orderData);
    const key = `orders:${newOrderFromDAL.id}`;
    const dataFromRedis = await redisClient.get(key);
    if (dataFromRedis) {
      console.log("Data retrieved from Redis");
      return JSON.parse(dataFromRedis);
    }
    await redisClient.setEx(key,200, JSON.stringify(newOrderFromDAL));
    return newOrderFromDAL;
  } catch (error) {
    console.log(chalk.redBright("Error in addNewOrderService:", error));
    throw error;
  }
};

export const getOrdersByUserIdService = async (userId: string) => {
  try {
    const cacheKey = getUserOrdersCacheKey(userId);
    const cachedOrders = await getFromCache(cacheKey);
    if (cachedOrders) {
      return cachedOrders;
    }

    const ordersByUserFromDAL = await getOrdersByUserId(userId);
    const key = `orders:${userId}`;
    const dataFromRedis = await redisClient.get(key);
    if (dataFromRedis) {
      console.log("Data retrieved from Redis");
      return JSON.parse(dataFromRedis);
    }
    await redisClient.setEx(key,200, JSON.stringify(ordersByUserFromDAL));
    if (!Array.isArray(ordersByUserFromDAL) || ordersByUserFromDAL.length === 0) {
      throw new Error("No orders found for the given user");
    }

    await setToCache(cacheKey, ordersByUserFromDAL);

    return ordersByUserFromDAL;
  } catch (error) {
    console.log(chalk.redBright("Error in getOrdersByUserIdService:", error));
    throw error;
  }
};

export const deleteOrdersByOrderIdService = async (orderId: string) => {
  try {
    await clearAllOrdersCache();

    const deleteOrderFromDAL = await deleteByOrderId(orderId);
    return deleteOrderFromDAL;
  } catch (error) {
    console.log(chalk.redBright("Error in deleteOrdersByOrderIdService:", error));
    throw error;
  }
};

export const getAllOrdersServiceStatus = async () => {
  try {
    const ordersFromDAL = await getAllOrders();

    if (ordersFromDAL instanceof Error) {
      throw ordersFromDAL;
    }

    const orderStatistics = {
      Pending: 0,
      Refunded: 0,
      Delivered: 0,
    };

    ordersFromDAL.forEach((orderDocument) => {
      const order = orderDocument.toObject();

      switch (order.status) {
        case "Pending":
          orderStatistics.Pending += 1;
          break;
        case "Refunded":
          orderStatistics.Refunded += 1;
          break;
        case "Delivered":
          orderStatistics.Delivered += 1;
          break;
        default:
          break;
      }
    });

    return orderStatistics;
  } catch (error) {
    console.log(chalk.redBright(error));
    throw error;
  }
};

export const getOrdersForHoursService = async () => {
  try{
    const orderForHours = await getOrdersForHours();
    return orderForHours;
  }catch (error) {
    console.log(chalk.redBright(error));
    throw error
  }
}
