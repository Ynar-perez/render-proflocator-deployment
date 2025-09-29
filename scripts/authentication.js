document.addEventListener('DOMContentLoaded', () => {
    const loginDiv = document.getElementById('login-div');
    const signupDiv = document.getElementById('signup-div');
    const linkToSignup = document.getElementById('js-link-to-signup');
    const linkToLogin = document.getElementById('js-link-to-login');

    const signupBtn = document.querySelector('#signup-div .signup-btn');
    const loginBtn = document.getElementById('js-login-btn');

    // --- Modal Elements ---
    const termsModal = document.getElementById('terms-modal');
    const termsLink = document.querySelector('#terms-and-conditions a');
    const closeModalBtn = document.getElementById('js-close-modal');

    // --- View Toggling ---
    linkToSignup.addEventListener('click', () => {
        loginDiv.style.display = 'none';
        signupDiv.style.display = 'flex';
    });

    linkToLogin.addEventListener('click', () => {
        signupDiv.style.display = 'none';
        loginDiv.style.display = 'flex';
    });

    // --- Modal Logic ---
    termsLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the link from trying to navigate
        termsModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
        termsModal.style.display = 'none';
    });

    // Close modal if user clicks outside of the content
    window.addEventListener('click', (event) => {
        if (event.target === termsModal) {
            termsModal.style.display = 'none';
        }
    });


    // --- Sign-Up Logic ---
    signupBtn.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent form from submitting the default way

        // Get form data
        const firstName = document.getElementById('signup-firstname').value;
        const lastName = document.getElementById('signup-lastname').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const termsChecked = signupDiv.querySelector('#checkbox').checked;

        // Basic Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            alert('Please fill out all required fields.');
            return;
        }
        if (!email.endsWith('@ccc.edu.ph')) {
            alert('Please use a valid CCC email address (e.g., yourname@ccc.edu.ph).');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        if (!termsChecked) {
            alert('You must agree to the Terms and Conditions.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: `${firstName} ${lastName}`,
                    email: email,
                    password: password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                // Switch to login view after successful signup
                signupDiv.style.display = 'none';
                loginDiv.style.display = 'flex';
            } else {
                // Show error message from server
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Sign-up failed:', error);
            alert('Sign-up failed. Please try again later.');
        }
    });

    // --- Login Logic ---
    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.getElementById('js-email-input').value;
        const password = document.getElementById('js-password-input').value;

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                // Store user data in sessionStorage to pass it to the next page
                sessionStorage.setItem('loggedInUser', JSON.stringify(result.user));

                // Redirect to the main application page
                window.location.href = 'proflocator.html';
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your connection and try again.');
        }
    });
});