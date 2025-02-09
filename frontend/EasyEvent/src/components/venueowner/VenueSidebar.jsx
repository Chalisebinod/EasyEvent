import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Badge,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import EventIcon from "@mui/icons-material/Event";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import StoreIcon from "@mui/icons-material/Store";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const VenueSidebar = () => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Fetch unread notifications count from API
    const fetchNotificationCount = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:8000/api/notification/getUnreads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotificationCount(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();

    // Optional: Polling to refresh count every 30 seconds
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
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem button component={Link} to="/venue-owner-dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/request">
            <ListItemIcon>
              <RequestQuoteIcon />
            </ListItemIcon>
            <ListItemText primary="Request" />
          </ListItem>
          <ListItem button component={Link} to="/halls">
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary="Halls" />
          </ListItem>
          <ListItem button component={Link} to="/notification">
            <ListItemIcon>
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItem>
          <ListItem button component={Link} to="/payments">
            <ListItemIcon>
              <PaymentsIcon />
            </ListItemIcon>
            <ListItemText primary="Payments" />
          </ListItem>
          <ListItem button component={Link} to="/agreement">
            <ListItemIcon>
              <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary="Agreement" />
          </ListItem>
          <ListItem button component={Link} to="/Create-venue">
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Event" />
          </ListItem>
          <ListItem button component={Link} to="/venue-profile">
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary="Venue profile" />
          </ListItem>
          <ListItem button component={Link} to="/venueOwnerKyc">
            <ListItemIcon>
              <ProfileIcon />
            </ListItemIcon>
            <ListItemText primary="Kyc" />
          </ListItem>
          <ListItem button component={Link} to="/venue-owner-self-profile">
            <ListItemIcon>
              <ProfileIcon />
            </ListItemIcon>
            <ListItemText primary="My Profile" />
          </ListItem>
          {/* Logout button with confirmation */}
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default VenueSidebar;
