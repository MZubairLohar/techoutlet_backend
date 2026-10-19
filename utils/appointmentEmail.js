import nodemailer from 'nodemailer';

const ADMIN_EMAIL = 'info@techoutlet.uk';

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const getTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const port = Number(process.env.EMAIL_PORT || 587);

  if (!host || !user || !pass || !Number.isInteger(port) || port <= 0) {
    throw new Error('Appointment email is not configured: check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

export const sendAppointmentEmails = async (appointment, transporter = getTransporter()) => {
  const details = [
    ['Name', appointment.name],
    ['Email', appointment.email],
    ['Phone', appointment.phoneNumber],
    ['Device', appointment.mobileType],
    ['Problem', appointment.problem],
    ['Comment', appointment.comment || 'None'],
    ['Appointment time', new Date(appointment.AppointmentTime).toLocaleString()],
  ];
  const plainText = details.map(([label, value]) => `${label}: ${value}`).join('\n');
  const html = `<table>${details.map(([label, value]) =>
    `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`
  ).join('')}</table>`;

  const messages = [
    {
      recipient: ADMIN_EMAIL,
      subject: 'New TechOutlet repair appointment',
      replyTo: appointment.email,
      heading: 'A new repair appointment has been booked.',
    },
    {
      recipient: appointment.email,
      subject: 'Your TechOutlet repair appointment',
      replyTo: ADMIN_EMAIL,
      heading: 'Thank you for booking a repair appointment with TechOutlet. Here are your booking details.',
    },
  ];

  const results = await Promise.all(messages.map(async ({ recipient, subject, replyTo, heading }) => {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        replyTo,
        subject,
        text: `${heading}\n\n${plainText}`,
        html: `<div><p>${escapeHtml(heading)}</p>${html}</div>`,
      });
      return { recipient, status: 'sent' };
    } catch (error) {
      return {
        recipient,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }));

  return results;
};
