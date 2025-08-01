const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin:{ type: Boolean, required: true , default: false },
  resetToken: { type: String },
  tokenExpiry: { type: Date ,expires: 3600}
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;
