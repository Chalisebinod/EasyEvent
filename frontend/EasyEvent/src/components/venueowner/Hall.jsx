import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
  FormControl,
  OutlinedInput,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Avatar,
  Fab,
} from "@mui/material";
import {
  AddPhotoAlternate,
  Delete,
  Edit,
  Close,
  Check,
  MeetingRoom,
  People,
  LocalDining,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import VenueSidebar from "./VenueSidebar";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  overflow: "hidden",
}));

const ImagePreview = styled("div")(({ theme }) => ({
  position: "relative",
  margin: theme.spacing(1),
  display: "inline-block",
}));

const Hall = () => {
  const [venue, setVenue] = useState(null);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Create Hall Modal (for adding new hall)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States for editing and deleting a hall
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const [editHall, setEditHall] = useState({
    name: "",
    capacity: "",
    pricePerPlate: "",
    features: [],
    availability: false,
    description: "",
  });

  const [newHall, setNewHall] = useState({
    name: "",
    capacity: "",
    pricePerPlate: "",
    features: [],
    images: [],
    availability: false,
    description: "",
    address: "",
  });

  // For custom features
  const [customFeature, setCustomFeature] = useState("");

  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/venueOwner/profile",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (response.data.venue) {
          setVenue(response.data.venue);
          localStorage.setItem("venueID", response.data.venue._id);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [accessToken]);

  useEffect(() => {
    const venueId = localStorage.getItem("venueID");
    if (!venueId) return;
    const fetchHalls = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/halls/${venueId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setHalls(response.data.halls);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    };
    fetchHalls();
  }, [venue, accessToken]);

  const handleAddHall = async () => {
    try {
      const venueId = localStorage.getItem("venueID");
      const formData = new FormData();
      formData.append("name", newHall.name);
      formData.append("capacity", newHall.capacity);
      formData.append("pricePerPlate", newHall.pricePerPlate);
      formData.append("availability", newHall.availability);
      formData.append("venue", venueId);
      formData.append("description", newHall.description);
      formData.append("address", newHall.address);

      newHall.images.forEach((image) => formData.append("images", image));
      newHall.features.forEach((feat) => formData.append("features", feat));

      const response = await axios.post(
        "http://localhost:8000/api/halls",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setHalls([...halls, response.data.hall]);
      toast.success("Hall added successfully!");
      setIsModalOpen(false);
      setNewHall({
        name: "",
        capacity: "",
        pricePerPlate: "",
        features: [],
        images: [],
        availability: false,
        description: "",
        address: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add hall.");
    }
  };

  const handleImageUpload = (e) => {
    if (newHall.images.length + e.target.files.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }
    setNewHall({
      ...newHall,
      images: [...newHall.images, ...Array.from(e.target.files)],
    });
  };

  const removeImage = (index) => {
    setNewHall({
      ...newHall,
      images: newHall.images.filter((_, i) => i !== index),
    });
  };

  // PATCH request to update a hall's details
  const handleEditHall = async (hallId, updatedData) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/halls/${hallId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the halls list with the edited hall
      setHalls(
        halls.map((hall) => (hall._id === hallId ? response.data.hall : hall))
      );

      toast.success("Hall updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update hall.");
    }
  };

  // DELETE request to remove a hall
  const handleDeleteHall = async (hallId) => {
    try {
      await axios.delete(`http://localhost:8000/api/halls/${hallId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Remove the deleted hall from the state
      setHalls(halls.filter((hall) => hall._id !== hallId));

      toast.success("Hall deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete hall.");
    }
  };

  // Add custom feature for creating a hall
  const handleAddCustomFeature = () => {
    if (!customFeature.trim()) return;
    setNewHall({
      ...newHall,
      features: [...newHall.features, customFeature.trim()],
    });
    setCustomFeature("");
  };

  return (
    <Box display="flex" minHeight="100vh">
      <ToastContainer position="top-center" autoClose={3000} />
      <VenueSidebar />
      <Box flexGrow={1} p={4} bgcolor="grey.100">
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "grey.900" }}
            >
              Hall Management
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "grey.700" }}>
              {venue?.name || "Your Venue"}
            </Typography>
          </Box>
          <Fab
            variant="extended"
            color="primary"
            onClick={() => setIsModalOpen(true)}
          >
            <MeetingRoom sx={{ mr: 1 }} />
            Add New Hall
          </Fab>
        </Box>

        {/* Content */}
        {loading ? (
          <LinearProgress color="secondary" />
        ) : error ? (
          <Box
            p={2}
            bgcolor="error.light"
            color="error.contrastText"
            borderRadius={1}
          >
            {error}
          </Box>
        ) : !venue ? (
          <Box textAlign="center" p={4} color="grey.600">
            No venue created yet
          </Box>
        ) : (
          <Grid container spacing={4}>
            {halls.map((hall) => (
              <Grid item xs={12} sm={6} lg={4} key={hall._id}>
                <StyledCard>
                  {hall.images?.length > 0 && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={hall.images[0]}
                      alt={hall.name}
                      sx={{ objectFit: "cover" }}
                    />
                  )}
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={1}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {hall.name}
                      </Typography>
                      <Box>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedHall(hall);
                            // Preload the edit state with current hall data
                            setEditHall({
                              name: hall.name,
                              capacity: hall.capacity,
                              pricePerPlate: hall.pricePerPlate,
                              features: hall.features || [],
                              availability: hall.availability,
                              description: hall.description || "",
                            });
                            setEditModalOpen(true);
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setSelectedHall(hall);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box display="flex" gap={1} mb={1}>
                      <Chip
                        icon={<People />}
                        label={`Capacity: ${hall.capacity}`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<LocalDining />}
                        label={`$${hall.pricePerPlate}/plate`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                    {hall.features?.length > 0 && (
                      <Box mb={1}>
                        <Typography
                          variant="caption"
                          sx={{ color: "grey.600" }}
                        >
                          Features:
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                          {hall.features.map((feature, index) => (
                            <Chip key={index} label={feature} size="small" />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Create Hall Dialog */}
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fullWidth
          maxWidth="md"
          scroll="paper"
          PaperProps={{
            sx: {
              maxHeight: "80vh",
              mt: 6,
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(to right, #7e22ce, #2563eb)",
              color: "#fff",
              py: 2,
              px: 3,
              mb: 4,
            }}
          >
            <span>Create New Hall</span>
            <IconButton onClick={() => setIsModalOpen(false)} color="inherit">
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Hall Name"
                  fullWidth
                  variant="outlined"
                  value={newHall.name}
                  onChange={(e) =>
                    setNewHall({ ...newHall, name: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Description"
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  value={newHall.description}
                  onChange={(e) =>
                    setNewHall({ ...newHall, description: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newHall.availability}
                      onChange={(e) =>
                        setNewHall({
                          ...newHall,
                          availability: e.target.checked,
                        })
                      }
                      color="primary"
                    />
                  }
                  label="Availability"
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Capacity"
                      type="number"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">people</InputAdornment>
                        ),
                      }}
                      value={newHall.capacity}
                      onChange={(e) =>
                        setNewHall({ ...newHall, capacity: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Price Per Plate"
                      type="number"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      value={newHall.pricePerPlate}
                      onChange={(e) =>
                        setNewHall({
                          ...newHall,
                          pricePerPlate: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
                <FormControl component="fieldset" sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "grey.600", mb: 1 }}
                  >
                    Features
                  </Typography>
                  <FormGroup row>
                    {["AC", "Projector", "Stage", "Catering", "Parking"].map(
                      (feature) => (
                        <FormControlLabel
                          key={feature}
                          control={
                            <Checkbox
                              checked={newHall.features.includes(feature)}
                              onChange={(e) => {
                                const features = [...newHall.features];
                                if (e.target.checked) {
                                  features.push(feature);
                                } else {
                                  const index = features.indexOf(feature);
                                  features.splice(index, 1);
                                }
                                setNewHall({ ...newHall, features });
                              }}
                              color="primary"
                            />
                          }
                          label={feature}
                        />
                      )
                    )}
                  </FormGroup>
                  <Box display="flex" alignItems="center" mt={1}>
                    <TextField
                      label="Custom Feature"
                      variant="outlined"
                      size="small"
                      value={customFeature}
                      onChange={(e) => setCustomFeature(e.target.value)}
                      sx={{ mr: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddCustomFeature}
                    >
                      Add
                    </Button>
                  </Box>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} mt={1}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <OutlinedInput
                    id="image-upload"
                    type="file"
                    inputProps={{ multiple: true, accept: "image/*" }}
                    onChange={handleImageUpload}
                    startAdornment={
                      <InputAdornment position="start">
                        <AddPhotoAlternate color="action" />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "grey.300",
                    borderRadius: 1,
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  {newHall.images.length === 0 ? (
                    <Typography color="grey.500">No images selected</Typography>
                  ) : (
                    <Box display="flex" flexWrap="wrap" justifyContent="center">
                      {newHall.images.map((image, index) => (
                        <ImagePreview key={index}>
                          <Avatar
                            variant="rounded"
                            src={URL.createObjectURL(image)}
                            sx={{ width: 80, height: 80 }}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              opacity: 0.8,
                              transition: "opacity 0.3s",
                            }}
                            onClick={() => removeImage(index)}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </ImagePreview>
                      ))}
                    </Box>
                  )}
                </Box>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 1, color: "grey.500" }}
                >
                  {5 - newHall.images.length} images remaining
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: 1, borderColor: "grey.300" }}>
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="outlined"
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddHall}
              variant="contained"
              color="primary"
              startIcon={<Check />}
            >
              Create Hall
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Hall Dialog */}
        <Dialog
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          fullWidth
          maxWidth="md"
          scroll="paper"
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(to right, #7e22ce, #2563eb)",
              color: "#fff",
              py: 2,
              px: 3,
              mb: 4,
            }}
          >
            <span>Edit Hall</span>
            <IconButton onClick={() => setEditModalOpen(false)} color="inherit">
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Hall Name"
                  fullWidth
                  variant="outlined"
                  value={editHall.name}
                  onChange={(e) =>
                    setEditHall({ ...editHall, name: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Description"
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  value={editHall.description}
                  onChange={(e) =>
                    setEditHall({ ...editHall, description: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editHall.availability}
                      onChange={(e) =>
                        setEditHall({
                          ...editHall,
                          availability: e.target.checked,
                        })
                      }
                      color="primary"
                    />
                  }
                  label="Availability"
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Capacity"
                      type="number"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">people</InputAdornment>
                        ),
                      }}
                      value={editHall.capacity}
                      onChange={(e) =>
                        setEditHall({ ...editHall, capacity: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Price Per Plate"
                      type="number"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      value={editHall.pricePerPlate}
                      onChange={(e) =>
                        setEditHall({
                          ...editHall,
                          pricePerPlate: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
                <FormControl component="fieldset" sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "grey.600", mb: 1 }}
                  >
                    Features
                  </Typography>
                  <FormGroup row>
                    {["AC", "Projector", "Stage", "Catering", "Parking"].map(
                      (feature) => (
                        <FormControlLabel
                          key={feature}
                          control={
                            <Checkbox
                              checked={editHall.features.includes(feature)}
                              onChange={(e) => {
                                const features = [...editHall.features];
                                if (e.target.checked) {
                                  features.push(feature);
                                } else {
                                  const index = features.indexOf(feature);
                                  features.splice(index, 1);
                                }
                                setEditHall({ ...editHall, features });
                              }}
                              color="primary"
                            />
                          }
                          label={feature}
                        />
                      )
                    )}
                  </FormGroup>
                </FormControl>
              </Grid>
              {/* Optionally, add image upload/edit component here */}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: 1, borderColor: "grey.300" }}>
            <Button
              onClick={() => setEditModalOpen(false)}
              variant="outlined"
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await handleEditHall(selectedHall._id, editHall);
                setEditModalOpen(false);
              }}
              variant="contained"
              color="primary"
              startIcon={<Check />}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the hall "{selectedHall?.name}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteModalOpen(false)}
              variant="outlined"
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await handleDeleteHall(selectedHall._id);
                setDeleteModalOpen(false);
              }}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Hall;
