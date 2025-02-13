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

const VenueSidebar = () => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

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
    const confirmLogout = window.confirm("Do you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
            backgroundColor: "#2C3E50", // Dark background
            color: "#ECF0F1", // Light text color
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Sidebar Header */}
        <Box className="text-center p-4 bg-gay font-extrabold rounded-lg mb-4">
          <Typography variant="h6">EasyEvent</Typography>
        </Box>

        {/* Navigation Links */}
        <List>
          <ListItem button component={Link} to="/venue-owner-dashboard">
            <ListItemIcon>
              <DashboardIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/request">
            <ListItemIcon>
              <RequestQuoteIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Request" />
          </ListItem>
          <ListItem button component={Link} to="/halls">
            <ListItemIcon>
              <StoreIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Halls" />
          </ListItem>
          <ListItem button component={Link} to="/notification">
            <ListItemIcon>
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon sx={{ color: "#ECF0F1" }} />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItem>
          <ListItem button component={Link} to="/payments">
            <ListItemIcon>
              <PaymentsIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Payments" />
          </ListItem>
          <ListItem button component={Link} to="/agreement">
            <ListItemIcon>
              <AccountBalanceIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Agreement" />
          </ListItem>
          <ListItem button component={Link} to="/Create-venue">
            <ListItemIcon>
              <EventIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Event" />
          </ListItem>
          <ListItem button component={Link} to="/Venue-profile">
            <ListItemIcon>
              <StoreIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Venue Profile" />
          </ListItem>
          <ListItem button component={Link} to="/venueOwnerKyc">
            <ListItemIcon>
              <ProfileIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="KYC" />
          </ListItem>
        </List>

        <Divider sx={{ borderColor: "#7F8C8D" }} />

        {/* Logout Button */}
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "#ECF0F1" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default VenueSidebar;
