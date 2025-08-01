const express = require("express");
const { signup, login, getAllUsers, deleteUser,resetPassword } = require("../Controller/authController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
router.post("/signup", signup);
router.post("/login",login);

router.post("/reset-password/:token",resetPassword);
router.get("/getallusers",authMiddleware,adminMiddleware, getAllUsers); // Get all users
router.delete("/deleteuser/:id",authMiddleware,adminMiddleware, deleteUser);
module.exports = router;
