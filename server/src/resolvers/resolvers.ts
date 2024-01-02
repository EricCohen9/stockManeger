import { userResolvers } from '../users/userResolvers';
import { orderResolvers } from '../orders/orderResolvers';
import {pubsub} from "../orders/orderResolvers"
export const resolvers={
    Query: {
      getAllUsers: userResolvers.getAllUsers,
      getRegisterTime:userResolvers.getRegisterTime,
      getAllOrders:orderResolvers.getAllOrders,
      getOrdersForHours:orderResolvers.getOrdersForHours,
      getOrdersByUserId:orderResolvers.getOrdersByUserId,
      
    },
    Mutation: {
      registerUser: userResolvers.registerUser,
      loginUser: userResolvers.login,
      deleteUser: userResolvers.deleteUser,
      forgotPassword: userResolvers.forgotPassword,
      comperepassword: userResolvers.comperepassword,
      resetPassword: userResolvers.resetPassword,
      updateOrder:orderResolvers.updateOrder,
      addNewOrder:orderResolvers.addNewOrder,
      deleteOrder:orderResolvers.deleteOrder,
      handleGetAllOrdersStatus:orderResolvers.handleGetAllOrdersStatus

    },
    Subscription: {
      getOrdersForHours:orderResolvers.getOrdersForHours,
      getTimeRegister:userResolvers.getTimeRegister
    },

  }