const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    match: [/^[A-Za-z]+$/, "First name must contain only letters"]
  },
  lastName: {
    type: String,
    required: true,
    match: [/^[A-Za-z]+$/, "Last name must contain only letters"]
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  mobile: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, "Invalid Indian mobile number"]
  }
});

module.exports = mongoose.model("Employee", employeeSchema);
