import nodemailer, { Transporter, SendMailOptions, createTransport } from   "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { CustomAPIError } from "../../errors";

// Define a function to send emails using the nodemailer transporter
const sendMail = async (mailOptions: SendMailOptions) => {
  try {
    // Define the SMTP transport details
    const transportDetails: SMTPTransport.Options = {
      host: process.env.SMTP_SERVER, // SMTP server address (e.g., smtp.gmail.com)
      port: Number(process.env.SMTP_PORT), // SMTP port number (e.g., 587 for TLS)
      auth: {
        user: process.env.SMTP_EMAIL_USER, // SMTP email user (your email address)
        pass: process.env.SMTP_EMAIL_PASS, // SMTP email password (your email password or app password)
      },
    };

    // Create a transporter using the transport details
    const transporter: Transporter = createTransport(transportDetails);

    // Send the email with the provided mail options
    const info = await transporter.sendMail(mailOptions);

    // Log the message ID of the sent email for reference
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    // Log the error and throw a custom API error if email sending fails
    console.log(error);
    throw new CustomAPIError(
      "Email could not be sent. Please try again later or contact support.",
      500
    );
  }
};

export default sendMail;
