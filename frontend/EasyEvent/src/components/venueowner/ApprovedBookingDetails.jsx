import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaFileContract,
  FaSignature,
} from 'react-icons/fa';
import VenueSidebar from './VenueSidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// STEP TITLES
const steps = ['Set Payment Details', 'Generate Agreement', 'Add Signature'];

// Create an Axios instance with interceptor
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to always attach the latest token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Quill modules configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
};

function ApprovedBookingDetails() {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();

  // BASIC STATE
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // STEP MANAGEMENT
  const [activeStep, setActiveStep] = useState(0);

  // PAYMENT DETAILS STATE
  const [paymentDetails, setPaymentDetails] = useState({
    advanceAmount: '',
    dueDate: '',
    paymentInstructions: '',
  });
  const [paymentExists, setPaymentExists] = useState(false);

  // AGREEMENT STATE
  const [agreement, setAgreement] = useState({
    terms: '',
    venueRules: '',
    cancellationPolicy: '',
  });

  // SIGNATURE STATE
  const [ownerSignature, setOwnerSignature] = useState(null);

  // TEMPLATES
  const [templates, setTemplates] = useState({
    terms: [],
    rules: [],
    cancellation: [],
  });
  const [selectedTemplates, setSelectedTemplates] = useState({
    terms: '',
    rules: '',
    cancellation: '',
  });

  // CUSTOM TEMPLATE USAGE
  const [useCustomTemplate, setUseCustomTemplate] = useState({
    terms: false,
    rules: false,
    cancellation: false,
  });
  const [customTemplates, setCustomTemplates] = useState({
    terms: '',
    rules: '',
    cancellation: '',
  });

  // FETCH BOOKING & TEMPLATES ON MOUNT
  useEffect(() => {
    fetchBookingDetails();
    fetchTemplates();
  }, [bookingId]);

  // GET BOOKING DETAILS
  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/api/booking/approved/details/${bookingId}`);
      if (response.data && response.data.booking) {
        const bookingData = response.data.booking;
        setBooking(bookingData);

        // Check if payment details exist
        if (bookingData.payment_details) {
          setPaymentExists(true);
          setPaymentDetails({
            advanceAmount: bookingData.payment_details.advance_amount || '',
            dueDate: bookingData.payment_details.due_date?.split('T')[0] || '',
            paymentInstructions: bookingData.payment_details.instructions || '',
          });

          // Step logic
          if (bookingData.agreement) {
            if (bookingData.agreement.owner_signature) {
              setActiveStep(2); // Already have signature
            } else {
              setActiveStep(1); // Move to agreement step
            }
          } else {
            setActiveStep(1); // Move to agreement step
          }
        } else {
          setPaymentExists(false);
          setActiveStep(0); // Payment details step
        }
      } else {
        throw new Error('Invalid response format');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to fetch booking details'
      );
      setLoading(false);
    }
  };

  // GET TEMPLATES
  const fetchTemplates = async () => {
    try {
      const venueId = localStorage.getItem('venueId');
      const response = await axiosInstance.get(`/api/booking/templates/${venueId}`);

      if (response.data.success) {
        // Separate templates by type
        const sortedTemplates = {
          terms: response.data.templates.filter((t) => t.type === 'terms'),
          rules: response.data.templates.filter((t) => t.type === 'rules'),
          cancellation: response.data.templates.filter((t) => t.type === 'cancellation'),
        };
        setTemplates(sortedTemplates);

        // Automatically select default templates
        const defaultTemplates = {
          terms: sortedTemplates.terms.find((t) => t.isDefault)?._id || '',
          rules: sortedTemplates.rules.find((t) => t.isDefault)?._id || '',
          cancellation: sortedTemplates.cancellation.find((t) => t.isDefault)?._id || '',
        };
        setSelectedTemplates(defaultTemplates);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch templates');
    }
  };

  // HANDLE PAYMENT SUBMIT
  const handlePaymentDetailsSubmit = async () => {
    try {
      // If already set, skip
      if (paymentExists) {
        setActiveStep(1);
        return;
      }
      const response = await axiosInstance.post(
        `/api/booking/payment-details/${bookingId}`,
        {
          advanceAmount: parseFloat(paymentDetails.advanceAmount),
          dueDate: paymentDetails.dueDate,
          paymentInstructions: paymentDetails.paymentInstructions,
          sendEmail: false,
        }
      );

      if (response.data.success) {
        setPaymentExists(true);
        toast.success('Payment details saved successfully');
        await fetchBookingDetails();
        setActiveStep(1);
      } else {
        throw new Error(response.data.message || 'Failed to save payment details');
      }
    } catch (err) {
      console.error('Error saving payment details:', err);
      toast.error(
        err.response?.data?.message || err.message || 'Failed to save payment details'
      );
    }
  };

  // HANDLE AGREEMENT GENERATION
  const handleAgreementGeneration = async () => {
    try {
      // Gather template data
      const agreementData = {
        termsTemplateId: useCustomTemplate.terms ? null : selectedTemplates.terms,
        rulesTemplateId: useCustomTemplate.rules ? null : selectedTemplates.rules,
        cancellationTemplateId: useCustomTemplate.cancellation ? null : selectedTemplates.cancellation,
        customTerms: useCustomTemplate.terms ? customTemplates.terms : null,
        customRules: useCustomTemplate.rules ? customTemplates.rules : null,
        customCancellation: useCustomTemplate.cancellation ? customTemplates.cancellation : null,
      };

      const response = await axiosInstance.post(
        `/api/booking/generate-agreement/${bookingId}`,
        agreementData
      );

      if (response.data.success) {
        toast.success('Agreement generated successfully');
        setActiveStep(2);
      } else {
        throw new Error(response.data.message || 'Failed to generate agreement');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate agreement');
      console.error('Agreement generation error:', err.response?.data || err);
    }
  };

  // HANDLE SIGNATURE UPLOAD
  const handleSignatureUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('signature', ownerSignature);
      formData.append('sendFinalEmail', 'true');

      const response = await axiosInstance.put(
        `/api/booking/owner-signature/${bookingId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        toast.success('Process completed! Final confirmation email sent to user');
        setTimeout(() => navigate('/venue-owner-dashboard'), 2000);
      } else {
        throw new Error(response.data.message || 'Failed to complete the process');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete the process');
      console.error('Final submission error:', err);
    }
  };

  // TEMPLATE SELECT
  const handleTemplateSelect = (type, templateId) => {
    setSelectedTemplates((prev) => ({ ...prev, [type]: templateId }));

    // Find the selected template
    const template = templates[type].find((t) => t._id === templateId);
    if (template) {
      setAgreement((prev) => ({
        ...prev,
        [type === 'terms'
          ? 'terms'
          : type === 'rules'
          ? 'venueRules'
          : 'cancellationPolicy']: template.content,
      }));
    }
  };

  // CUSTOM TEMPLATE CHANGES
  const handleCustomTemplateChange = (type, content) => {
    setCustomTemplates((prev) => ({ ...prev, [type]: content }));
  };

  // SWITCH BETWEEN CUSTOM & DEFAULT
  const handleUseCustomTemplateChange = (type) => {
    setUseCustomTemplate((prev) => ({ ...prev, [type]: !prev[type] }));
    // If switching from default to custom, fill in from the existing content
    if (!useCustomTemplate[type]) {
      setCustomTemplates((prev) => ({
        ...prev,
        [type]:
          agreement[
            type === 'terms' ? 'terms' : type === 'rules' ? 'venueRules' : 'cancellationPolicy'
          ] || '',
      }));
    } else {
      // If switching from custom to default, revert to the selected template
      handleTemplateSelect(type, selectedTemplates[type]);
    }
  };

  // RENDER TEMPLATE SECTION
  const renderTemplateSection = (type, label) => {
    const templateKey =
      type === 'terms' ? 'terms' : type === 'rules' ? 'venueRules' : 'cancellationPolicy';

    return (
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{label}</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={useCustomTemplate[type]}
                  onChange={() => handleUseCustomTemplateChange(type)}
                />
              }
              label="Use Custom Template"
            />
          </Box>

          {!useCustomTemplate[type] ? (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select {label} Template</InputLabel>
              <Select
                value={selectedTemplates[type]}
                onChange={(e) => handleTemplateSelect(type, e.target.value)}
                label={`Select ${label} Template`}
              >
                {templates[type]?.map((template) => (
                  <MenuItem key={template._id} value={template._id}>
                    {template.title} {template.isDefault && '(Default)'}
                  </MenuItem>
                ))}
              </Select>
              {selectedTemplates[type] && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Preview:
                  </Typography>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        templates[type]?.find((t) => t._id === selectedTemplates[type])?.content ||
                        '',
                    }}
                  />
                </Box>
              )}
            </FormControl>
          ) : (
            <Box sx={{ mb: 2 }}>
              <ReactQuill
                value={customTemplates[type]}
                onChange={(content) => handleCustomTemplateChange(type, content)}
                modules={quillModules}
                style={{ height: '200px', marginBottom: '50px' }}
              />
            </Box>
          )}
        </Paper>
      </Grid>
    );
  };

  // LOADING STATE
  if (loading) {
    return (
      <Box display="flex" minHeight="100vh">
        <VenueSidebar />
        <Box flexGrow={1} display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <Box display="flex" minHeight="100vh">
        <VenueSidebar />
        <Box flexGrow={1} p={3}>
          <Alert severity="error">{error}</Alert>
          <Button onClick={() => navigate('/venue-owner/bookings')} sx={{ mt: 2 }}>
            Back to Bookings
          </Button>
        </Box>
      </Box>
    );
  }

  // MAIN RENDER
  return (
    <Box display="flex" minHeight="100vh" bgcolor="background.default">
      <VenueSidebar />
      <Box flexGrow={1} p={3}>
        <ToastContainer />
        <Container maxWidth="lg">
          {/* Header */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Approved Booking Details
            </Typography>
            <Stepper activeStep={activeStep} sx={{ mt: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* Booking Information */}
          <Grid container spacing={3}>
            {/* Basic Details */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <FaUser style={{ marginRight: '8px' }} />
                  Customer Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {booking && (
                  <>
                    <Typography>
                      <strong>Name:</strong> {booking.user.name}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {booking.user.email}
                    </Typography>
                    <Typography>
                      <strong>Contact:</strong> {booking.user.contact_number}
                    </Typography>
                  </>
                )}
              </Paper>
            </Grid>

            {/* Event Details */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <FaCalendarAlt style={{ marginRight: '8px' }} />
                  Event Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {booking && (
                  <>
                    <Typography>
                      <strong>Event Type:</strong> {booking.event_details.event_type}
                    </Typography>
                    <Typography>
                      <strong>Date:</strong>{' '}
                      {new Date(booking.event_details.date).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      <strong>Guest Count:</strong> {booking.event_details.guest_count}
                    </Typography>
                  </>
                )}
              </Paper>
            </Grid>

            {/* Pricing Summary */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <FaMoneyBillWave style={{ marginRight: '8px' }} />
                  Pricing Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {booking?.pricing_summary && (
                  <Grid container spacing={3}>
                    {/* Per Plate Details */}
                    <Grid item xs={12} md={4}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Per Plate Pricing
                        </Typography>
                        <Typography>
                          <strong>Original:</strong> ₹
                          {booking.pricing_summary.per_plate_details.original}
                        </Typography>
                        <Typography>
                          <strong>User Offered:</strong> ₹
                          {booking.pricing_summary.per_plate_details.user_offered}
                        </Typography>
                        <Typography>
                          <strong>Final:</strong> ₹
                          {booking.pricing_summary.per_plate_details.final}
                        </Typography>
                        <Typography sx={{ mt: 1 }}>
                          <strong>Guest Count:</strong> {booking.pricing_summary.guest_count}
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Cost Breakdown */}
                    <Grid item xs={12} md={4}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Cost Breakdown
                        </Typography>
                        <Typography>
                          <strong>Food Cost:</strong> ₹
                          {booking.pricing_summary.total_food_cost}
                        </Typography>
                        <Typography>
                          <strong>Additional Services:</strong> ₹
                          {booking.pricing_summary.additional_services_cost}
                        </Typography>
                        <Typography sx={{ mt: 1, color: 'primary.main' }}>
                          <strong>Total Cost:</strong> ₹
                          {booking.pricing_summary.total_cost}
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Payment Status */}
                    <Grid item xs={12} md={4}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          bgcolor:
                            booking.pricing_summary.payment_status === 'Paid'
                              ? '#e8f5e9'
                              : '#fff3e0',
                        }}
                      >
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Payment Status
                        </Typography>
                        <Typography>
                          <strong>Status:</strong> {booking.pricing_summary.payment_status}
                        </Typography>
                        <Typography>
                          <strong>Advance amount :</strong> ₹
                          {booking.pricing_summary.amount_paid}
                        </Typography>
                        <Typography
                          sx={{
                            color:
                              booking.pricing_summary.balance_amount > 0
                                ? 'error.main'
                                : 'success.main',
                          }}
                        >
                          <strong>Balance:</strong> ₹
                          {booking.pricing_summary.balance_amount}
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Selected Foods */}
                    {booking.selected_foods && booking.selected_foods.length > 0 && (
                      <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            Selected Foods
                          </Typography>
                          <Grid container spacing={2}>
                            {booking.selected_foods.map((food) => (
                              <Grid item xs={12} sm={6} md={4} key={food._id}>
                                <Typography>
                                  {food.name} - ₹{food.price}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                        </Paper>
                      </Grid>
                    )}

                    {/* Additional Services */}
                    {booking.additional_services && booking.additional_services.length > 0 && (
                      <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            Additional Services
                          </Typography>
                          <Grid container spacing={2}>
                            {booking.additional_services.map((service, index) => (
                              <Grid item xs={12} sm={6} md={4} key={index}>
                                <Typography>
                                  {service.name} - ₹{service.price || 0}
                                </Typography>
                                {service.description && (
                                  <Typography variant="body2" color="text.secondary">
                                    {service.description}
                                  </Typography>
                                )}
                              </Grid>
                            ))}
                          </Grid>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                )}
              </Paper>
            </Grid>

            {/* Payment Details Form */}
            {activeStep === 0 && (
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    <FaMoneyBillWave style={{ marginRight: '8px' }} />
                    Set Payment Details
                  </Typography>
                  {paymentExists ? (
                    <>
                      <Alert
                        severity={
                          booking?.payment_details?.payment_status === 'Pending'
                            ? 'warning'
                            : 'info'
                        }
                        sx={{ mb: 2 }}
                      >
                        {booking?.payment_details?.payment_status === 'Pending' ? (
                          <>
                            <strong>Payment Pending:</strong> Advance payment of ₹
                            {paymentDetails.advanceAmount} is required by{' '}
                            {new Date(paymentDetails.dueDate).toLocaleDateString()}
                          </>
                        ) : (
                          <>
                            Payment details have been set. Payment status:{' '}
                            {booking?.payment_details?.payment_status}
                          </>
                        )}
                      </Alert>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography>
                            <strong>Required Advance Amount:</strong> ₹
                            {paymentDetails.advanceAmount}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography>
                            <strong>Due Date:</strong>{' '}
                            {new Date(paymentDetails.dueDate).toLocaleDateString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography>
                            <strong>Payment Instructions:</strong>
                          </Typography>
                          <Typography>{paymentDetails.paymentInstructions}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography>
                            <strong>Payment Status:</strong>{' '}
                            {booking?.payment_details?.payment_status}
                          </Typography>
                          {booking?.payment_details?.paid_at && (
                            <Typography>
                              <strong>Paid At:</strong>{' '}
                              {new Date(booking.payment_details.paid_at).toLocaleString()}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" onClick={() => setActiveStep(1)}>
                          Continue to Agreement
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Required Advance Amount"
                            type="number"
                            value={paymentDetails.advanceAmount}
                            onChange={(e) =>
                              setPaymentDetails({
                                ...paymentDetails,
                                advanceAmount: e.target.value,
                              })
                            }
                            helperText="This amount will be required from the user to confirm the booking"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Due Date"
                            type="date"
                            value={paymentDetails.dueDate}
                            onChange={(e) =>
                              setPaymentDetails({
                                ...paymentDetails,
                                dueDate: e.target.value,
                              })
                            }
                            InputLabelProps={{ shrink: true }}
                            helperText="Deadline for the advance payment"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Payment Instructions"
                            value={paymentDetails.paymentInstructions}
                            onChange={(e) =>
                              setPaymentDetails({
                                ...paymentDetails,
                                paymentInstructions: e.target.value,
                              })
                            }
                            helperText="Provide clear instructions for making the payment"
                          />
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          onClick={handlePaymentDetailsSubmit}
                          disabled={!paymentDetails.advanceAmount || !paymentDetails.dueDate}
                        >
                          Set Required Payment & Continue
                        </Button>
                      </Box>
                    </>
                  )}
                </Paper>
              </Grid>
            )}

            {/* Agreement Generation */}
            {activeStep === 1 && (
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    <FaFileContract style={{ marginRight: '8px' }} />
                    Generate Agreement
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    {renderTemplateSection('terms', 'Terms & Conditions')}
                    {renderTemplateSection('rules', 'Venue Rules')}
                    {renderTemplateSection('cancellation', 'Cancellation Policy')}
                  </Grid>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={handleAgreementGeneration}
                      disabled={
                        !(
                          (useCustomTemplate.terms
                            ? customTemplates.terms
                            : selectedTemplates.terms) &&
                          (useCustomTemplate.rules
                            ? customTemplates.rules
                            : selectedTemplates.rules) &&
                          (useCustomTemplate.cancellation
                            ? customTemplates.cancellation
                            : selectedTemplates.cancellation)
                        )
                      }
                    >
                      Generate & Continue
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            )}

            {/* Signature Upload */}
            {activeStep === 2 && (
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    <FaSignature style={{ marginRight: '8px' }} />
                    Add Your Signature
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setOwnerSignature(e.target.files[0])}
                      style={{ display: 'none' }}
                      id="signature-upload"
                    />
                    <label htmlFor="signature-upload">
                      <Button variant="outlined" component="span" startIcon={<FaSignature />}>
                        Upload Signature Image
                      </Button>
                    </label>
                    {ownerSignature && (
                      <Typography sx={{ mt: 2 }}>
                        Signature file selected: {ownerSignature.name}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={handleSignatureUpload}
                      disabled={!ownerSignature}
                    >
                      Upload & Send to User
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default ApprovedBookingDetails;
