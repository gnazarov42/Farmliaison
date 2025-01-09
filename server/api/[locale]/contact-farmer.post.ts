// file: ~/server/api/contact-farmer.ts
import { getUserById } from '~/server/db/users';
import { sendEmail } from '~/server/utils/emailSender';
import { sanitizeDataForModel } from '~/server/transformers/sanitize';

export default defineEventHandler(async (event) => {
  const currentUser = event.context.currentUser;

  if (!currentUser?.id) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: 'Unauthorized' }),
    );
  }

  const { farmerId, message, name, phone } = await readBody(event);

  // Validate required fields
  if (!farmerId || !message || !name) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
      }),
    );
  }

  // Retrieve farmer's data from the database
  const farmer = await getUserById(farmerId);
  if (!farmer || !farmer.email) {
    return sendError(
      event,
      createError({ statusCode: 404, statusMessage: 'Farmer not found' }),
    );
  }

  // Prepare email data
  const templatePath = 'dm/en/contactFarmer.html';
  const templateData = {
    farmerName: farmer.name,
    senderName: name,
    senderPhone: phone,
    senderEmail: currentUser.email,
    senderMessage: message,
  };

  try {
    // Send the email using the sendEmail utility
    await sendEmail({
      to: farmer.email,
      subject: `New message from ${name}`,
      templatePath,
      templateData,
      text: `Message from ${name}:\n${message}${phone ? `\nPhone: ${phone}` : ''}`,
    });

    return { statusCode: 200, body: { message: 'Message sent successfully' } };
  } catch (error) {
    console.error('Failed to send email:', error);
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: 'Failed to send message' }),
    );
  }
});
