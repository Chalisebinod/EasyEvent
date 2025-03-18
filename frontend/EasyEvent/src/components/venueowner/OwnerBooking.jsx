import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
  LinearProgress,
  Alert,
  Chip,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VenueBookModel from "./modal/VenueBookModel";
import VenueSidebar from "./VenueSidebar";

const OwnerBooking = () => {
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const accessToken = localStorage.getItem("access_token");
  const venueId = localStorage.getItem("venueId");
  const navigate = useNavigate();

  // Reusable function to fetch approved bookings
  const fetchApprovedBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/booking/approved/${venueId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setApprovedBookings(response.data.bookings || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (venueId) {
      fetchApprovedBookings();
    }
    // eslint-disable-next-line
  }, [venueId]);

  const handleOpenCreate = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreate = () => {
    setOpenCreateModal(false);
    // Refetch approved bookings after creating a new one
    if (venueId) {
      fetchApprovedBookings();
    }
  };

  const handleBookingClick = (booking) => {
    navigate(`/venue-owner/approved-booking/${booking._id}`);
  };

  // Chip color mapping based on booking status
  const getStatusChipColor = (status) => {
    const colors = {
      Pending: "warning",
      Accepted: "success",
      Rejected: "error",
      Cancelled: "default",
      Running: "info",
      Completed: "secondary",
    };
    return colors[status] || "default";
  };

  // Renders each booking as a clickable card
  const renderBookingCard = (booking) => (
    <Grid item xs={12} md={6} key={booking._id}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        }}
        onClick={() => handleBookingClick(booking)}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
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
          <strong>Date:</strong>{" "}
          {new Date(booking.event_details.date).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Guest Count:</strong> {booking.event_details.guest_count}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Hall:</strong> {booking.hall?.name} (Capacity:{" "}
          {booking.hall?.capacity})
        </Typography>
        {booking.pricing?.total_cost && (
          <Typography variant="body2" color="text.secondary">
            <strong>Total Cost:</strong> ₹{booking.pricing.total_cost}
          </Typography>
        )}
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Foods:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {booking.selected_foods && booking.selected_foods.length > 0 ? (
              booking.selected_foods.map((food) => (
                <Chip
                  key={food._id}
                  label={food.name}
                  size="small"
                  variant="outlined"
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No food selected
              </Typography>
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
          {/* Page Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Approved Bookings
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpenCreate}>
              Create Booking
            </Button>
          </Box>

          {/* Loading / Error Handling */}
          {loading && <LinearProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          {!loading && approvedBookings.length === 0 && (
            <Alert severity="info">No approved bookings available.</Alert>
          )}

          {/* Approved Bookings Grid */}
          <Grid container spacing={3}>
            {approvedBookings.map((booking) => renderBookingCard(booking))}
          </Grid>
        </Container>
      </Box>

      {/* Modal for Creating a Booking */}
      <VenueBookModel open={openCreateModal} onClose={handleCloseCreate} />
    </Box>
  );
};

export default OwnerBooking;
