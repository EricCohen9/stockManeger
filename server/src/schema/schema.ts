import { gql } from "graphql-tag";
export const typeDefs = gql`
  type User {
    id: Int!
    email: String!
    code: String!
    password: String!
  }
  type User_login {
    hour: Int!
    registrations: Int!
  }

  type Query {
    getUser(id: Int!): User
    getAllUsers: [User]
    getRegisterTime:[Int!]
  }

  type Mutation {
    registerUser(email: String!, password: String!): RegisterUserResponse
    loginUser(email: String!, password: String!): RegisterUserResponse
    deleteUser(id: Int!): String
    forgotPassword(email: String!): String
    comperepassword(email: String!, code: String!): String
    resetPassword(email: String!, password: String!): ResetPasswordResponse
  }

  type RegisterUserResponse {
    user: User
    accessToken: String
  }

  type ResetPasswordResponse {
    success: Boolean
    message: String
  }
  type Product {
    id: String
    name: String
    description: String
    price: Int
    quantity: Int
  }

  type ShippingDetails {
    address: String
    userId: Int
    contactNumber: String
    orderType: String
    id: String
  }

  type Order {
    _id: String
    id: String
    cartItems: [Product]
    orderTime: String
    status: String
    price: Int
    shippingDetails: ShippingDetails
  }
  type Query {
    getAllOrders: [Order]
    getOrdersByUserId(userId: String): [Order]
    getOrdersForHours: [Int]
  }

  type Mutation {
    updateOrder(orderId: String, updatedData: OrderInput): Order
    addNewOrder(orderData: OrderInput): Order
    deleteOrder(orderId: String): String!
    handleGetAllOrdersStatus: OrderStatusCounts!
  }
  type Subscription {
    getTimeRegister: [Int!]
  }

  input OrderInput {
    _id: String
    cartItems: [ProductInput]
    orderTime: String
    status: String
    price: Int
    shippingDetails: ShippingDetailsInput
  }

  input ProductInput {
    id: String
    name: String
    description: String
    price: Int
    quantity: Int
  }

  input ShippingDetailsInput {
    address: String
    userId: Int
    contactNumber: String
    orderType: String
    id: String
  }
  type OrderStatusCounts {
    Pending: Int!
    Refunded: Int!
    Delivered: Int!
  }

  type Subscription {
    getOrdersForHours: [Int] 
}`
