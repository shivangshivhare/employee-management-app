const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  uploadExcel
} = require("../controllers/employeeController");

// CRUD Routes
router.get("/", getEmployees);
router.get("/:empId", getEmployee);
router.post("/", createEmployee);
router.put("/:empId", updateEmployee);
router.delete("/:empId", deleteEmployee);

// Excel Upload Route
router.post("/upload", upload.single("file"), uploadExcel);

module.exports = router;
