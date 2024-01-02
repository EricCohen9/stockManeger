import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { RootState } from "../main";
import UserCircle from "./UserCircle";

export default function Header() {
  const [, setStatusUser] = useState(false);
  const userStatus = useSelector((state: RootState) => state.user.status);

  useEffect(() => {
    setStatusUser(userStatus);
    
  }, [userStatus]);
  return (
    <Box sx={{ flexGrow: 1, minHeight: "0px" }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#424242a0" }}>
        <Toolbar sx={{ background: "" }}>
          <Typography  variant="h6" component="div" sx={{ flexGrow: 1 ,color:"white" }}>
            Order Management
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <UserCircle />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
