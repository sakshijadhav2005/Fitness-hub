
const User = require("../Model/User"); // ✅ Import User model

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); 
const transporter = require("../config/config"); 
require("dotenv").config();

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({  message: "Signup successful!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
  // ✅ Debugging line to check
     const isadmin = user.isAdmin;

    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
// ✅ Debugging line to check token generation
    // ✅ Send user data along with the token
    res.json({
      token,
      user: {
        id: user._id, // User ID
        name: user.name, // Include other user details if needed
        email: user.email,
        isAdmin: user.isAdmin, // Include admin status
      },
      message: "Login successful!"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Generate reset token (valid for 15 minutes)
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

      // Reset password link
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

      // Email options
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Password Reset Request",
          html: `<p>Click the link below to reset your password:</p>
                 <a href="${resetLink}">${resetLink}</a>
                 <p>This link will expire in 15 minutes.</p>`,
      };

      // Send email
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
};

// ✅ Reset Password function
const resetPassword = async (req, res) => {
  try {
      const { token } = req.params;
      const { newPassword } = req.body;

      // Verify token
      let decoded;
      try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
          return res.status(400).json({ message: "Invalid or expired token" });
      }

      const user = await User.findById(decoded.userId);
      if (!user) return res.status(400).json({ message: "Invalid token" });

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
};
const getAllUsers = async (req , res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {signup, login, forgotPassword, resetPassword, getAllUsers , deleteUser};





