import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Badge,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  RequestQuote as RequestQuoteIcon,
  Event as EventIcon,
  Payments as PaymentsIcon,
  AccountBalance as AccountBalanceIcon,
  AccountCircle as ProfileIcon,
  Store as StoreIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const drawerWidth = 250;

const VenueSidebar = ({ children }) => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/notification/getUnreads",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotificationCount(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const openLogoutDialog = () => setLogoutDialogOpen(true);
  const closeLogoutDialog = () => setLogoutDialogOpen(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      {/* Drawer (Sidebar) */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#2C3E50", // Dark sidebar background
            color: "#ECF0F1", // Light text
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Sidebar Header */}
        <Box
          sx={{
            textAlign: "center",
            p: 3,
            // Subtle gradient
            background: "linear-gradient(135deg, #34495E 20%, #2C3E50 80%)",
            mb: 3,
            borderRadius: 1,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography variant="h5" sx={{ color: "#ECF0F1", fontWeight: "bold" }}>
            EasyEvent
          </Typography>
        </Box>

        {/* Navigation Links */}
        <List>
          <ListItem
            button
            component={Link}
            to="/venue-owner-dashboard"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/user-request"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <RequestQuoteIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Request" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/halls"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <StoreIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Halls" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/notification"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon sx={{ color: "#ECF0F1" }} />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/transaction"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <PaymentsIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Payments" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/agreement"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <AccountBalanceIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Agreement" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/chat"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <EventIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="chat" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/Venue-profile"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <StoreIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Venue Profile" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/venueOwnerKyc"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <ProfileIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="KYC" />
          </ListItem>
        </List>

        <Divider sx={{ borderColor: "#7F8C8D", my: 2 }} />

        {/* Logout Button */}
        <List>
          <ListItem
            button
            onClick={openLogoutDialog}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        {/* You can add a Top Bar or Page Title here if desired */}
        {children}
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={closeLogoutDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VenueSidebar;
