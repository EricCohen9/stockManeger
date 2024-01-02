import { Types } from "mongoose";
import { OrderInterface } from "../interfaces/orderInterface";
import {
    getAllOrdersService,
    getOrdersByUserIdService,
    updateByOrderIdService,
    addNewOrderService,
    deleteOrdersByOrderIdService,
    getAllOrdersServiceStatus,
    getOrdersForHoursService
  } from "../orders/orderService"; 
  import { PubSub } from "graphql-subscriptions";
  export const pubsub = new PubSub()
export const orderResolvers = {
    getAllOrders: () => getAllOrdersService(),

    getOrdersByUserId: (_: unknown, { userId }: { userId: string }) =>
      getOrdersByUserIdService(userId),

      updateOrder: (
        _: unknown,
        { orderId, updatedData }: { orderId: string; updatedData: OrderInterface }
      ) => updateByOrderIdService(new Types.ObjectId(orderId), updatedData),

      addNewOrder: (_: unknown, { orderData }: { orderData: OrderInterface }) =>{
        try{
         const newOrder = addNewOrderService(orderData)
         pubsub.publish("ORDERS_FOR_HOURS", {
          getOrdersForHours:getOrdersForHoursService ,
        });
         return newOrder
        } catch(error){
         throw new Error("Could not adding order");
        }
       },

       deleteOrder: async (_: unknown, { orderId }: { orderId: string }) => {
        const id = orderId;
        try {
          const order = await deleteOrdersByOrderIdService(id);
          return `delete order successfully`;
        } catch (error) {
          console.error("Error deleting order:", error);
          throw new Error("Could not delete order");
        }
      },
      handleGetAllOrdersStatus:async()=>{
        try {
          const orders = await getAllOrdersServiceStatus();
          return orders;
        } catch (error) {
          console.error("Error deleting order:", error);
          throw new Error("Could not delete order");
        }
      },
      // getOrdersForHours: async () => {
      //   try{
      //     const orders = await getOrdersForHoursService();
      //     return orders;
      //   }catch (error){
      //     throw new Error("Could not get order")
      //   }
      // }
      getOrdersForHours: {
        subscribe: async () => {
        return pubsub.asyncIterator(["ORDERS_FOR_HOURS"]);
        }
      }
}