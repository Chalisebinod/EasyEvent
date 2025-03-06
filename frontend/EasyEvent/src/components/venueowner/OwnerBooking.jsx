import React, { useState, useEffect } from "react";
import { Box, Button, Container, Grid, Paper, Typography, Divider, LinearProgress, Alert, Chip, Tabs, Tab, Card } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VenueBookModel from "./modal/VenueBookModel";
import VenueSidebar from "./VenueSidebar";

const OwnerBooking = () => {
  const [bookings, setBookings] = useState({ requests: [], approved: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const accessToken = localStorage.getItem("access_token");
  const venueId = localStorage.getItem("venueID");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        setLoading(true);
        // Fetch booking requests
        const requestsResponse = await axios.get(
          `http://localhost:8000/api/booking/requests/venue/${venueId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // Fetch approved bookings
        const approvedResponse = await axios.get(
          `http://localhost:8000/api/booking/approved/${venueId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        setBookings({
          requests: requestsResponse.data.requests || [],
          approved: approvedResponse.data.bookings || []
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (venueId) {
      fetchAllBookings();
    }
  }, [venueId, accessToken]);

  const handleOpenCreate = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreate = () => {
    setOpenCreateModal(false);
    // Refetch bookings after creation
    if (venueId) {
      fetchAllBookings();
    }
  };

  const handleBookingClick = (booking, isRequest) => {
    if (isRequest) {
      navigate(`/venue-owner/booking-request/${booking._id}`, { state: { isRequest: true } });
    } else {
      navigate(`/venue-owner/approved-booking/${booking._id}`);
    }
  };

  const getStatusChipColor = (status) => {
    const colors = {
      Pending: "warning",
      Accepted: "success",
      Rejected: "error",
      Cancelled: "default",
      Running: "info",
      Completed: "secondary"
    };
    return colors[status] || "default";
  };

  const renderBookingCard = (booking, isRequest = true) => (
    <Grid item xs={12} md={6} key={booking._id}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6
          }
        }}
        onClick={() => handleBookingClick(booking, isRequest)}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {booking.event_details.event_type}
          </Typography>
          <Chip 
            label={booking.status}
            color={getStatusChipColor(booking.status)}
            size="small"
          />
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" color="text.secondary">
          <strong>Date:</strong> {new Date(booking.event_details.date).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Guest Count:</strong> {booking.event_details.guest_count}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Hall:</strong> {booking.hall?.name} (Capacity: {booking.hall?.capacity})
        </Typography>
        {booking.pricing?.total_cost && (
          <Typography variant="body2" color="text.secondary">
            <strong>Total Cost:</strong> ₹{booking.pricing.total_cost}
          </Typography>
        )}
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>Selected Foods:</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {booking.selected_foods && booking.selected_foods.length > 0 ? (
              booking.selected_foods.map((food) => (
                <Chip
                  key={food._id}
                  label={`${food.name}`}
                  size="small"
                  variant="outlined"
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No food selected</Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Grid>
  );

  return (
    <Box display="flex" minHeight="100vh" bgcolor="background.default">
      <VenueSidebar />
      <Box flexGrow={1} p={3}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Booking Dashboard
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpenCreate}>
              Create Booking
            </Button>
          </Box>

          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Booking Requests" />
            <Tab label="Approved Bookings" />
          </Tabs>

          {loading && <LinearProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          
          {!loading && activeTab === 0 && bookings.requests.length === 0 && (
            <Alert severity="info">No booking requests available.</Alert>
          )}
          
          {!loading && activeTab === 1 && bookings.approved.length === 0 && (
            <Alert severity="info">No approved bookings available.</Alert>
          )}

          <Grid container spacing={3}>
            {activeTab === 0 
              ? bookings.requests.map(booking => renderBookingCard(booking, true))
              : bookings.approved.map(booking => renderBookingCard(booking, false))
            }
          </Grid>
        </Container>
      </Box>
      <VenueBookModel open={openCreateModal} onClose={handleCloseCreate} />
    </Box>
  );
};

export default OwnerBooking;
