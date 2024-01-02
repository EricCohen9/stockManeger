import {  Box , Button, Typography } from "@mui/material";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface UserInterface {

  id: number;
  email: string;
  password: string;
  isadmin: boolean;
  code: " ";
}
const showToastMessage = () => {
  toast.success("The deletion was successful !", {
    position: toast.POSITION.TOP_LEFT,
  });
}
export const CustomersTable = () => {

  const [users, setUsers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "isadmin",
      headerName: "Permissions",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: params.value ? "green" : "yellow",
          }}
        >
          {params.value ? "Admin" : "User"}
        </Typography>
      ),
    },
    {
      field: "delete",
      headerName: "Delete user",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Button onClick={() => handleDeleteUser(Number(params.id))} startIcon={<DeleteIcon />}>
          Delete
        </Button>
      ),
    },
    {
      field: "changeStatus",
      headerName: "Change Status",
      width: 200,
      renderCell: (params: GridRenderCellParams) => <Button onClick={() => handleChangeStatus(params.id.toString())}>Change Status</Button>,
    },
  ];
  

  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      console.log(`Successfully deleted user with ID ${userId}`);
      showToastMessage()
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
    }
  };

  const handleChangeStatus = (userId: string) => {
    console.log(`Change status for user with ID ${userId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<UserInterface[]>(`${import.meta.env.VITE_BASE_URL}users`, {
          headers: { Authorization: token },
        });
        const usersData: UserInterface[] = response.data;
        setUsers(usersData);
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ margin: "10%", textAlign: "center" }}>
      <Typography variant="h3" sx={{ padding: "2%" }}>
        Customers
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            width: "80vw",
            height: "80vh",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#424242",
              color: "#fafafa",
            },
            "& .MuiDataGrid-sortIcon": {
              color: "#fafafa",
            },
            "& .MuiIconButton-root .MuiSvgIcon-root": {
              color: "#fafafa",
            },
          }}
        >
          <DataGrid loading={loading} getRowId={(row: { id: number }) => row.id} rows={users} columns={columns} />
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};
