const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const appointmentController = require("../controllers/appointmentController");
const sampleController = require("../controllers/sampleController");
const paymentController = require("../controllers/paymentController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/fetch-doctors", userController.fetchDoctors);

// Define routes for appointment-related operations
router.post('/create-appointment', appointmentController.createAppointment);
router.get('/fetch-appointments/:id', appointmentController.fetchAppointments);
router.put('/accept-appointment', appointmentController.acceptAppointment);
router.put('/reschedule-appointment', appointmentController.rescheduleAppointment);

//Routes for smaple collection
router.post('/create-collection-request', sampleController.createSample);
router.get('/fetch-reports/:id', sampleController.fetchReports);
router.get('/fetch-samples', sampleController.fetchSamples);
router.put('/accept-sample', sampleController.acceptSample);
router.put('/reschedule-sample', sampleController.rescheduleSample);
router.put('/sample-feedback', sampleController.sampleFeedback);

//Routes for payment
router.post('/create-checkout-session', paymentController.createSession);


module.exports = router;

