const mongoose = require('mongoose');

const { Schema } = mongoose;

// Ticket schema
const ticketSchema = new Schema({
  description: String,
  urgency: Number,
  numberproblem: Number
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
