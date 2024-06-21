import nodemailer from "nodemailer";

export async function SendMail({ to, subject, text, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    await transporter.sendMail({
      to,
      subject,
      text,
      html,
      from: "Enviador de Email <noreply@thereal.mail>",
    });
  } catch (error) {
    throw error;
  }
}

export const BuildBody = (title, text) => {
  return {
    html: `<div><div><h2 style="text-align:center;">${title}</h2><hr/></div><div><p>${text}</p></div></div>`,
    text: `${title}\n\n${text}`,
  };
};
