import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html , EMAIL_HOST , EMAIL_PORT , EMAIL_USER , EMAIL_PASS }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST || process.env.EMAIL_HOST,
      port: EMAIL_PORT || parseInt(process.env.EMAIL_PORT),
      secure: true, 
      auth: {
        user: EMAIL_USER || process.env.EMAIL_USER,
        pass: EMAIL_PASS || process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({ 
      from: `"Ravens Digital: " <${process.env.EMAIL_USER}>`,
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
