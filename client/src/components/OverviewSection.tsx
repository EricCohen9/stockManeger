import { Grid, Container, Box } from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { OverviewTotalProfit } from "../components/OverviewTotalProfit";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
// client
import { HANDLE_ORDERS_STATUS_MUTATION, requestGetOrders } from "../requestsToServer/requestToOrders";
import { GET_TIME_REGISTER, GET_ORDERS_FOR_HOURS, GET_TIME_REGISTER_SUBSCRIPITION} from "../requestsToServer/requestToOrders";
import { client } from "../App";
function OverviewSection() {
  const [totalPrice, setTotalPrice] = useState(0);
  const [registrationsData, setRegistrationsData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [orderTime, setOrderTime] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [statusOrder, setStatusOrder] = useState<StatusOrderInterface>({ Pending: 0, Refunded: 0, Delivered: 0 });

  interface StatusOrderInterface {
    Pending: number;
    Refunded: number;
    Delivered: number;
  }
  const { data: timeData, loading: timeLoading, error: timeError, subscribeToMore: subscribeToMoreTime } = useQuery(GET_TIME_REGISTER);

console.log(timeLoading);
console.log(timeError);


// const { data, loading, error, subscribeToMore } = useQuery(GET_TIME_REGISTER);
  useEffect(() => {
    setRegistrationsData(timeData?.getRegisterTime || []);
  }, [timeData]);
  
  useEffect(() => {
    const unsubscribe = subscribeToMoreTime({
      document: GET_TIME_REGISTER_SUBSCRIPITION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newQuantity = subscriptionData.data.getTimeRegister;
        setRegistrationsData(newQuantity)       
      },
    });
    return () => unsubscribe();
  }, [subscribeToMoreTime]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await client.mutate({
          mutation: HANDLE_ORDERS_STATUS_MUTATION,
        });
        const response = data.handleGetAllOrdersStatus;
        setStatusOrder(response);
      } catch (error) {
        console.error("Error fetching registration data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await client.query({
          query: GET_ORDERS_FOR_HOURS,
        });
        const response = { data: { getOrdersForHoursQuery: data.getOrdersForHoursQuery } };
        setOrderTime(response.data.getOrdersForHoursQuery);
        console.log(response.data.getOrdersForHoursQuery,"setOrderTime");
      } catch (error) {
        console.error("Error fetching orders data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await requestGetOrders();
        const ordersData = orders;
        const calculatedTotalPrice = ordersData.reduce((total, order) => {
          return total + order.price;
        }, 0);
        setTotalPrice(calculatedTotalPrice);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid item sx={{ margin: "20px" }} container spacing={10}>
        <Grid item xs={12} sm={6} lg={3}>
          <OverviewTotalProfit sx={{ height: "100%" }} value={"$" + String(totalPrice)} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: statusOrder.Pending, label: "Pending", color: "#ff7b00" },
                  { id: 1, value: statusOrder.Delivered, label: "Delivered", color: "#74ff03" },
                  { id: 2, value: statusOrder.Refunded, label: "Refunded", color: "#ff0000" },
                ],
              },
            ]}
            width={400}
            height={200}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex" }}>
        <BarChart
          xAxis={[
            {
              id: "barCategories",
              data: [
                "00:00",
                "01:00",
                "02:00",
                "03:00",
                "04:00",
                "05:00",
                "06:00",
                "07:00",
                "08:00",
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "18:00",
                "19:00",
                "20:00",
                "21:00",
                "22:00",
                "23:00",
              ],
              scaleType: "band",
            },
          ]}
          series={[
            {
              data: [...orderTime],
              color: "#2196f3",
            },
          ]}
          width={800}
          height={500}
        />
        <LineChart
          xAxis={[{ data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] }]}
          series={[
            {
              data: [...registrationsData],
              area: true,
            },
          ]}
          width={800}
          height={500}
        />
      </Box>
    </Container>
  );
}

export default OverviewSection;
