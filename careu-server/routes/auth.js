const express = require("express");
const router = express.Router();
const { register,registerProvider, login, loginProvider } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/register-provider", registerProvider);
router.post("/login-provider", loginProvider);

module.exports = router;
