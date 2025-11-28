const express = require("express");
const router = express.Router();
const { auth, authorizeRoles } = require("../Middleware/authMiddleware");

const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require("../controllers/service");


router.get("/service", getServices);


router.get("/service/:id", getServiceById);


router.post("/service-admin", auth, authorizeRoles("admin"), createService);


router.put("/service/:id", auth, authorizeRoles("admin"), updateService);


router.delete("/service/:id", auth, authorizeRoles("admin"), deleteService);

module.exports = router;
