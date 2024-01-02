import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { CostumeOrders, OrderInterface } from "../interface/orderInterface";
import { DataGrid, GridCellParams, GridRenderCellParams } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { requestGetOrders, requestDeleteOrder, requestPutOrderStatus } from "../requestsToServer/requestToOrders";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { OrderDetailsDialog } from "./OrderDetailsDialog";

const statusMap: { [key: string]: string } = {
  Pending: "#ffb84da9",
  Delivered: "#74ff03a0",
  Refunded: "#ff00009e",
};
const showToastMessage = () => {
  toast.success("The deletion was successful !", {
    position: toast.POSITION.TOP_LEFT,
  });
};
export function LatestOrders() {
  const [orders, setOrders] = useState<OrderInterface[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<CostumeOrders | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 0.5,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
    },
    {
      field: "orderType",
      headerName: "Order Type",
      flex: 0.8,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            bgcolor: statusMap[params.value],
            color: "white",
            p: "5px",
            borderRadius: 50,
            width: "85px",
            textAlign: "center",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "delete",
      headerName: "Delete Order",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Button onClick={(e) => handleDeleteOrder(e, params.id.toString())} disabled={params.row.status !== "Pending"} startIcon={<DeleteIcon />}>
          Delete
        </Button>
      ),
    },
    {
      field: "changeStatus",
      headerName: "Change Status",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Button onClick={(e) => handleChangeStatus(e, params.id.toString())} disabled={!params.row.orderType || params.row.orderType !== "Pickup" || params.row.status !== "Pending"}>
          Change Status
        </Button>
      ),
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      const data = await requestGetOrders();
      setOrders(data);
    };
    fetchData();
  }, []);

  const handleRowClick = (params: GridCellParams) => {
    setSelectedOrder(params.row as CostumeOrders);
    setOpenDialog(true);
  };
  const handleDeleteOrder = async (event: React.MouseEvent<HTMLButtonElement>, orderId: string) => {
    event.stopPropagation();
    const isConfirmed = window.confirm("Are you sure you want to delete this order?");
    if (isConfirmed) {
      await requestDeleteOrder(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      showToastMessage();
    }
  };
  const handleChangeStatus = async (event: React.MouseEvent<HTMLButtonElement>, orderId: string) => {
    event.stopPropagation();
    await requestPutOrderStatus(orderId);

    const updatedOrders: OrderInterface[] = [...orders];

    const order = orders.find((o) => o._id === orderId);
    if (order) {
      order.status = "Delivered";
    }

    setOrders(updatedOrders);

    showToastMessage();
  };

  const costumeOrders = orders
    ? orders.map((order: OrderInterface) => {
        const temp = {
          id: order._id,
          price: order.price,
          address: (order.shippingDetails && order.shippingDetails.address) || "N/A",
          orderType: (order.shippingDetails && order.shippingDetails.orderType) || "N/A",
          status: order.status,
          orderTime: order.orderTime,
          userId: (order.shippingDetails && order.shippingDetails.userId) || "N/A",
        };
        return temp;
      })
    : [];

  return (
    <Box sx={{ margin: "20px" }}>
      <Box
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#424242",
            color: "#FAFAFA",
          },
          "& .MuiDataGrid-columnHeaders .MuiDataGrid-sortIcon": {
            color: "#FAFAFA",
          },
          "& .MuiDataGrid-columnHeaders .MuiIconButton-root .MuiSvgIcon-root": {
            color: "#FAFAFA",
          },
        }}
      >
        <DataGrid onCellClick={handleRowClick} getRowId={(row: { id: string }) => row.id} rows={costumeOrders || []} columns={columns} />
        <OrderDetailsDialog order={selectedOrder} open={openDialog} onClose={() => setOpenDialog(false)} />
      </Box>
      <ToastContainer />
    </Box>
  );
}