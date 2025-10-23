const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwFT2H1R8gIJog82IbTpv0cFRfRMKZinL5O9iJdjSrYDlzEIWRViXRa7QqxmYlZjlY/exec';

const form = document.getElementById('waitlistForm');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('errorMessage');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModal');

// Get form inputs
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const commentInput = document.getElementById('comment');

// Get error elements
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');

// Validation functions
function validateName(name) {
    if (!name || name.trim() === '') {
        return 'Please enter your name';
    }
    if (name.trim().length < 2) {
        return 'Name must be at least 2 characters';
    }
    return '';
}

function validateEmail(email) {
    if (!email || email.trim() === '') {
        return 'Please enter your email address';
    }
    if (!email.includes('@')) {
        return 'Please enter a valid email address with @';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return '';
}

// Real-time validation
nameInput.addEventListener('blur', function() {
    const error = validateName(this.value);
    nameError.textContent = error;
    if (error) {
        nameInput.classList.add('error');
    } else {
        nameInput.classList.remove('error');
    }
});

emailInput.addEventListener('blur', function() {
    const error = validateEmail(this.value);
    emailError.textContent = error;
    if (error) {
        emailInput.classList.add('error');
    } else {
        emailInput.classList.remove('error');
    }
});

// Clear errors on input
nameInput.addEventListener('input', function() {
    if (this.value.trim() !== '') {
        nameError.textContent = '';
        nameInput.classList.remove('error');
    }
});

emailInput.addEventListener('input', function() {
    if (this.value.includes('@')) {
        emailError.textContent = '';
        emailInput.classList.remove('error');
    }
});

// Close modal
closeModalBtn.addEventListener('click', function() {
    modalOverlay.classList.remove('active');
});

// Close modal when clicking outside
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const comment = commentInput.value.trim();

    // Validate all fields
    const nameErrorMsg = validateName(name);
    const emailErrorMsg = validateEmail(email);

    // Display errors
    nameError.textContent = nameErrorMsg;
    emailError.textContent = emailErrorMsg;

    // Add error class
    if (nameErrorMsg) nameInput.classList.add('error');
    else nameInput.classList.remove('error');
    
    if (emailErrorMsg) emailInput.classList.add('error');
    else emailInput.classList.remove('error');

    // Stop if there are errors
    if (nameErrorMsg || emailErrorMsg) {
        return;
    }

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Joining...';

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                comment: comment,
                timestamp: new Date().toISOString()
            })
        });

        // Show success modal popup
        modalOverlay.classList.add('active');
        errorMessage.style.display = 'none';
        form.reset();

        // Clear any error states
        nameInput.classList.remove('error');
        emailInput.classList.remove('error');
        nameError.textContent = '';
        emailError.textContent = '';

        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get Early Access';

    } catch (error) {
        // Show error message
        errorMessage.style.display = 'block';
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get Early Access';
    }
});