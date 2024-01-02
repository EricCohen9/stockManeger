import React, { useEffect } from "react";
import { IconButton, Tooltip, Avatar, Menu, MenuItem, Badge, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const UserCircle = () => {
  const navigate = useNavigate();
  const status = localStorage.getItem("status");

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [userStatus, setUserStatus] = React.useState<string | null>(status);

  useEffect(() => {
    // Update userStatus when local storage status changes
    setUserStatus(localStorage.getItem("status"));
  }, [localStorage.getItem("status")]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (userStatus) {
      setAnchorElUser(event.currentTarget);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseUserMenu1 = () => {
    navigate("/");
    localStorage.setItem("user", "connect");
    localStorage.setItem("status", JSON.stringify(false));
    localStorage.setItem("token", "");
  };

  return (
    <StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant={(userStatus === "true" && "dot") || "standard"}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar />
        </IconButton>
      </Tooltip>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleCloseUserMenu1}>Sign out</MenuItem>
      </Menu>
    </StyledBadge>
  );
};

export default UserCircle;
