import { currentUser } from "./proflocator.js";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if a user is logged in. If not, redirect to the login page.
    if (!currentUser) {
        console.log("No user found, redirecting to login.");
        window.location.href = 'index.html';
        return;
    }

    // 2. Populate the account information fields.
    populateAccountInfo();

    // 3. Add event listener for the password change form.
    const passwordForm = document.getElementById('password-change-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handleChangePassword);
    }
});

function populateAccountInfo() {
    // Find the elements to display the data
    const fullNameEl = document.getElementById('account-fullname');
    const emailEl = document.getElementById('account-email');
    const roleEl = document.getElementById('account-role');

    // Set the text content from the currentUser object
    if (fullNameEl) fullNameEl.textContent = currentUser.fullName || 'N/A';
    if (emailEl) emailEl.textContent = currentUser.email || 'N/A';
    if (roleEl) roleEl.textContent = currentUser.role || 'N/A';
}

function handleChangePassword(event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    // TODO: Implement password change logic
    // 1. Get values from the form (current, new, confirm)
    // 2. Validate that new and confirm passwords match
    // 3. Send a request to your server/backend to update the password
    alert('Password change functionality is not yet implemented.');
}