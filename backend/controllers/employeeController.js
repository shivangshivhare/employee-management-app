const Employee = require("../models/Employee");
const XLSX = require("xlsx");
const fs = require("fs");

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single employee
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.empId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create employee
exports.createEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.empId, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.empId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Excel Upload
exports.uploadExcel = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const requiredCols = ["firstName", "lastName", "username", "email", "mobile"];
    const fileCols = Object.keys(data[0] || {});
    const missingCols = requiredCols.filter(col => !fileCols.includes(col));

    if (missingCols.length > 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: `Missing columns: ${missingCols.join(", ")}` });
    }

    let validRows = [];
    let invalidRows = [];

    data.forEach((row, index) => {
      let errors = [];

      if (!/^[A-Za-z]+$/.test(row.firstName)) errors.push("Invalid firstName");
      if (!/^[A-Za-z]+$/.test(row.lastName)) errors.push("Invalid lastName");
      if (!/^\S+@\S+\.\S+$/.test(row.email)) errors.push("Invalid email");
      if (!/^[6-9]\d{9}$/.test(row.mobile)) errors.push("Invalid mobile number");

      if (errors.length > 0) {
        invalidRows.push({ row: index + 2, data: row, errors });
      } else {
        validRows.push(row);
      }
    });

    if (validRows.length > 0) {
      await Employee.insertMany(validRows, { ordered: false });
    }

    fs.unlinkSync(filePath);

    res.json({
      message: "Upload processed",
      inserted: validRows.length,
      invalidRows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing Excel file" });
  }
};
