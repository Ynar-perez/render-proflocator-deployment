document.addEventListener('DOMContentLoaded', () => {
    const loginDiv = document.getElementById('login-div');
    const signupDiv = document.getElementById('signup-div');
    const linkToSignup = document.getElementById('js-link-to-signup');
    const linkToLogin = document.getElementById('js-link-to-login');

    const signupBtn = document.querySelector('#signup-div .signup-btn');
    const loginBtn = document.getElementById('js-login-btn');

    const termsModal = document.getElementById('terms-modal');
    const termsLink = document.querySelector('#terms-and-conditions a');
    const closeModalBtn = document.getElementById('js-close-modal');

    // SIGNIN SIGNUP TOGGLE
    linkToSignup.addEventListener('click', () => {
        loginDiv.style.display = 'none';
        signupDiv.style.display = 'flex';
    });

    linkToLogin.addEventListener('click', () => {
        signupDiv.style.display = 'none';
        loginDiv.style.display = 'flex';
    });

    // MODAL
    termsLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the link from trying to navigate
        termsModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
        termsModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === termsModal) {
            termsModal.style.display = 'none';
        }
    });


    // SIGNUP
    signupBtn.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent form from submitting the default way

        const firstName = document.getElementById('signup-firstname').value;
        const lastName = document.getElementById('signup-lastname').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const termsChecked = signupDiv.querySelector('#checkbox').checked;

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
            const response = await fetch('/api/signup', {
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
                // SUCCESS! (201 Created)
                alert(result.message); // "User created successfully!"
                
                // Switch back to login form
                signupDiv.style.display = 'none';
                loginDiv.style.display = 'flex';
            } else {
                // ERROR! (409 Conflict, 400 Bad Request)
                // We already parsed the JSON, so just use the error message.
                alert(`Error: ${result.message || 'An unknown error occurred.'}`);
            }

        } catch (error) {
            console.error('Sign-up failed:', error);
            alert('Sign-up failed. Please try again later.');
        }

    });

    // LOGIN 
    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.getElementById('js-email-input').value;
        const password = document.getElementById('js-password-input').value;

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            // 1. Check for success (status 200-299)
            if (response.ok) {
                const result = await response.json(); // Safely parse JSON for success
                
                // Store user data...
                sessionStorage.setItem('loggedInUser', JSON.stringify(result.user));
    
                // Redirect...
                window.location.href = 'proflocator.html';
            } else {
                // 2. Handle server errors (e.g., 401, 404, 405)
                // Attempt to parse JSON error message if content-type is json
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorResult = await response.json();
                    alert(`Error: ${errorResult.message || 'Server error'}`);
                } else {
                    // Handle non-JSON errors (like the 405 error with no body)
                    alert(`Login failed: HTTP Status ${response.status} (${response.statusText}).`);
                    console.error('Server responded with non-JSON error:', await response.text());
                }
            }
        } catch (error) {
        // ... (rest of your existing catch block)
            console.error('Login failed:', error);
            alert('Login failed. Please check your connection and try again.');
        }
    });
});