const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  timeend: {
    type: String,
    required: true,
  },
  display: {
    type: String,
    default: "background",
  },
  color: {
    type: String,
    default: "#FFEB00",
  },
  finished: {
    type: Boolean,
    default: false,
  },
  notified: {
    type: Boolean,
    default: false,
  },
});

// Aqui está a correção: exportar o modelo em vez do schema
module.exports = mongoose.model("Appointment", appointmentSchema);
