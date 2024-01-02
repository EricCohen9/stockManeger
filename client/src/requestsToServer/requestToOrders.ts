import { OrderInterface } from "../interface/orderInterface";
// import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";
import { client } from "../App";

export const GET_TIME_REGISTER = gql`
  query GetRegisterTime {
    getRegisterTime
  }
`;

export const HANDLE_ORDERS_STATUS_MUTATION = gql`
  mutation {
    handleGetAllOrdersStatus {
      Delivered
      Pending
      Refunded
    }
  }
`;

export const GET_ORDERS_FOR_HOURS = gql`
  query GetOrdersForHours {
    getOrdersForHoursQuery
  }
`;
export const GET_TIME_REGISTER_SUBSCRIPITION = gql`
  subscription GetTimeRegister {
    getTimeRegister
  }
`;
export const GET_ORDER_FOR_HOURS_SUBSCRIPITION = gql`
  subscription Subscription {
  getOrdersForHours
}
`;
// export const client = new ApolloClient({
//   uri: `${import.meta.env.VITE_BASE_URL}`,
//   cache: new InMemoryCache(),
// });

export const requestGetOrders = async () => {
  try {
    const result = await client.query<{ getAllOrders: OrderInterface[] }>({
      query: gql`
        query GetAllOrders {
          getAllOrders {
            _id
            price
            shippingDetails {
              address
            }
            shippingDetails {
              orderType
            }
            status
            orderTime
            shippingDetails {
              userId
            }
          }
        }
      `,
    });
    return result.data.getAllOrders;
  } catch (error) {
    console.error("Error in requestGetOrders:", error);
    throw error;
  }
};

export const requestDeleteOrder = async (id: string): Promise<{ _id: string }> => {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation DeleteOrder($orderId: String!) {
          deleteOrder(orderId: $orderId)
        }
      `,
      variables: {
        orderId: id,
      },
    });
    return data.deleteOrder;
  } catch (error) {
    console.error(`Error deleting order with ID }:`, error);
    throw error;
  }
};

export const requestPutOrderStatus = async (id: string): Promise<{ _id: string }> => {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation UpdateOrder($orderId: String!, $order: OrderInput!) {
          updateOrder(orderId: $orderId, updatedData: $order) {
            _id
            status
          }
        }
      `,
      variables: {
        orderId: id,
        order: {
          status: "Delivered",
        },
      },
    });

    return data.updateOrder;
  } catch (error) {
    console.error(`Error deleting order with ID }:`, error);
    throw error;
  }
};
