import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  subject,
  html,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
}) => {
  try {
    let transporter;

    console.log(EMAIL_HOST , EMAIL_PORT , EMAIL_USER , EMAIL_PASS)

    if (EMAIL_HOST && EMAIL_PORT && EMAIL_USER && EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: true, // false for 587 (TLS), true for 465 (SSL)
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
           tls: {
        rejectUnauthorized: false, // allows self-signed certificates (common in cPanel/webmail)
      },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    const info = await transporter.sendMail({
      from: `"${EMAIL_USER || process.env.EMAIL_USER}" <${EMAIL_USER ||
        process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: error.message };
  }
};
