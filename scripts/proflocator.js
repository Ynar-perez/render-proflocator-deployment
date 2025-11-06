import { updateLiveTime } from "./utils/time-date.js";

// --- USER SESSION INITIALIZATION ---
function initializeUserSession() {
	const userDataString = sessionStorage.getItem('loggedInUser');
	if (!userDataString) {
		// If no user is logged in, redirect to the login page
		window.location.href = 'index.html';
		return null; // Stop execution
	}

	const user = JSON.parse(userDataString);

	// Update the header with user's information
	document.getElementById('user-name').innerText = user.fullName;
	document.getElementById('user-type').innerText = user.role;

	return user; // Return the user object for other scripts to use
}

export const currentUser = initializeUserSession();

if (currentUser) {
	// HEADER LIVE TIME AND DATE
	updateLiveTime();
	setInterval(updateLiveTime, 1000);
}

// DROPDOWN MENU
const dropdownMenu = document.getElementById('dropdown-menu');
const profileImgBtn = document.getElementById('profile-img-btn');

if (profileImgBtn) {
	profileImgBtn.addEventListener('click', (event) => {
		event.stopPropagation();
		if (dropdownMenu.style.display === 'flex') {
			dropdownMenu.style.display = 'none';
		} else {
			dropdownMenu.style.display = 'flex';
		}
	});
}

// Hide dropdown when clicking outside
document.addEventListener('click', function(event) {
	if (dropdownMenu.style.display === 'flex' && !dropdownMenu.contains(event.target) && event.target !== profileImgBtn && !profileImgBtn.contains(event.target)) {
		dropdownMenu.style.display = 'none';
	}
});

// --- Logout Functionality ---
const logoutButton = document.getElementById('logout-btn');
if (logoutButton) {
	logoutButton.addEventListener('click', async (event) => {
		event.preventDefault(); // Prevent the link from navigating immediately
		try {
			// Inform the server to destroy the session
			await fetch('/api/logout', { method: 'POST' });
		} catch (error) {
			console.error('Logout request to server failed:', error);
			// Proceed with client-side cleanup even if server call fails
		} finally {
			// Clear the user session from the browser and redirect
			sessionStorage.removeItem('loggedInUser');
			window.location.href = 'index.html';
		}
	});
}