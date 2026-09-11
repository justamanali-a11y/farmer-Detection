const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

exports.sendVerificationOtp = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "FarmerDetect email verification code",
    text: `Your FarmerDetect verification code is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your FarmerDetect verification code is:</p><h2>${otp}</h2><p>This code expires in 10 minutes.</p>`,
  });
};

exports.sendPasswordResetEmail = async (email, resetUrl) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Reset your FarmerDetect password",
    text: `Open this link to reset your password: ${resetUrl}. It expires in 15 minutes.`,
    html: `<p>Open this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 15 minutes.</p>`,
  });
};
