const nodemailer = require("nodemailer");
require("dotenv").config(); // Ensure .env variables are loaded

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Must match EMAIL_USER in .env
        pass: process.env.EMAIL_PASS, // Must match EMAIL_PASS in .env
    },
});

module.exports = transporter;
