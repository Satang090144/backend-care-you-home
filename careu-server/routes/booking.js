const express = require("express");
const router = express.Router();

const { auth, authorizeRoles } = require("../Middleware/authMiddleware");

//customer
const { createBooking, subnitReview,  getMyBookings, getBookingDetail} = require("../controllers/booking");

//provider
const { getPendingBookings, acceptBooking, setProviderLocation, getMyAcceptedJobs } = require("../controllers/booking")

router.post("/booking/create", auth, authorizeRoles("customer"), createBooking);
router.get("/booking/my", auth, authorizeRoles("customer"), getMyBookings);
router.get("/booking/:id", auth, authorizeRoles("customer"), getBookingDetail);
router.post("/booking/review", auth, authorizeRoles("customer"), subnitReview);


router.get("/pending", auth, authorizeRoles("provider"), getPendingBookings);
router.put("/accept/:id", auth, authorizeRoles("provider"), acceptBooking);
router.put("/provider/set-location", auth, authorizeRoles("provider"), setProviderLocation);
router.get("/my-jobs", auth, authorizeRoles("provider"), getMyAcceptedJobs);


module.exports = router;