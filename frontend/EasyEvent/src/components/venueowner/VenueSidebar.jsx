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
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const drawerWidth = 250;

const VenueSidebar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(0);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/notification/getUnreads",
          { headers: { Authorization: `Bearer ${token}` } }
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

  // Helper: if the current route matches the link, set it as active.
  // Active item: white background, dark-blue text.
  const getNavItemStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      margin: "6px 8px",
      borderRadius: "8px",
      backgroundColor: isActive ? "#ffffff" : "transparent",
      transition: "all 0.2s ease",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: isActive ? "#0D47A1" : "#ffffff",
      },
      "&:hover": {
        backgroundColor: isActive ? "#ffffff" : "rgba(255,255,255,0.2)",
      },
    };
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            // Using a modern gradient from deep blue to green
            background: "linear-gradient(45deg, #0D47A1, #1B5E20)",
            color: "#ffffff",
            borderRight: "none",
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
            background: "linear-gradient(45deg, #0D47A1, #1B5E20)",
            mb: 2,
            borderRadius: 1,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography variant="h5" sx={{ color: "#ffffff", fontWeight: "bold" }}>
            EasyEvent
          </Typography>
        </Box>

        {/* Navigation Links */}
        <List>
          <ListItem
            button
            component={Link}
            to="/venue-owner-dashboard"
            sx={getNavItemStyle("/venue-owner-dashboard")}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/user-request"
            sx={getNavItemStyle("/user-request")}
          >
            <ListItemIcon>
              <RequestQuoteIcon />
            </ListItemIcon>
            <ListItemText primary="Request" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/bookings-owner"
            sx={getNavItemStyle("/bookings-owner")}
          >
            <ListItemIcon>
              <BookOnlineIcon />
            </ListItemIcon>
            <ListItemText primary="Bookings" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/halls"
            sx={getNavItemStyle("/halls")}
          >
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary="Halls" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/notification"
            sx={getNavItemStyle("/notification")}
          >
            <ListItemIcon>
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/transaction"
            sx={getNavItemStyle("/transaction")}
          >
            <ListItemIcon>
              <PaymentsIcon />
            </ListItemIcon>
            <ListItemText primary="Payments" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/agreement"
            sx={getNavItemStyle("/agreement")}
          >
            <ListItemIcon>
              <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary="Agreement" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/foodManagement"
            sx={getNavItemStyle("/foodManagement")}
          >
            <ListItemIcon>
              <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary="Food Management" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/chat"
            sx={getNavItemStyle("/chat")}
          >
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Chat" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/Venue-profile"
            sx={getNavItemStyle("/Venue-profile")}
          >
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary="Venue Profile" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/venueOwnerKyc"
            sx={getNavItemStyle("/venueOwnerKyc")}
          >
            <ListItemIcon>
              <ProfileIcon />
            </ListItemIcon>
            <ListItemText primary="KYC" />
          </ListItem>
        </List>

        <Divider sx={{ borderColor: "#ffffff", my: 2 }} />

        {/* Logout Button */}
        <List>
          <ListItem
            button
            onClick={openLogoutDialog}
            sx={{
              margin: "6px 8px",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: "#ffffff" }} />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
