const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "mentor", "admin"], required: true },
  phone_number: { type: String },
  created_at: { type: Date, default: Date.now },
},{
    timestamps: true,
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
