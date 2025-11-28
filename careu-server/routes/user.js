const express = require("express");
const router = express.Router();

const { getProfile } = require("../controllers/user");
const { getProviderProfile } = require("../controllers/booking");
const {auth, authorizeRoles} = require("../Middleware/authMiddleware");



// ดึงโปรไฟล์หลัง login
router.get("/profile", auth, getProfile);

router.get("/provider/me", auth, authorizeRoles("provider"), getProviderProfile);

module.exports = router;
