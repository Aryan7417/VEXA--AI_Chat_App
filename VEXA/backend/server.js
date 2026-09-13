const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Send OTP
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await transporter.sendMail({
      from: `"VEXA" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your VEXA Verification Code",
      text: `Your VEXA verification code is ${otp}. It expires in 5 minutes.`,
    });

    console.log(`OTP sent to ${email}: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Email Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

// Verify OTP
app.post("/api/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const data = otpStore.get(email);

  if (!data) {
    return res.status(400).json({
      success: false,
      message: "OTP not found or expired",
    });
  }

  if (Date.now() > data.expiresAt) {
    otpStore.delete(email);

    return res.status(400).json({
      success: false,
      message: "OTP expired",
    });
  }

  if (data.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  otpStore.delete(email);

  res.json({
    success: true,
    message: "Email verified successfully",
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "VEXA Backend is running 🚀",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`VEXA Backend running on port ${PORT}`);
});