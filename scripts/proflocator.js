import { updateLiveTime } from "./utils/time-date.js";

// HEADER LIVE TIME AND DATE

updateLiveTime();
setInterval(updateLiveTime, 1000);

// DROPDOWN MENU
const dropdownMenu = document.getElementById('dropdown-menu');
const profileImgBtn = document.getElementById('profile-img-btn');

function toggleDropdownMenu(event) {
	event.stopPropagation();
	if (dropdownMenu.style.display === 'flex') {
		dropdownMenu.style.display = 'none';
	} else {
		dropdownMenu.style.display = 'flex';
	}
}

profileImgBtn.addEventListener('click', toggleDropdownMenu);

// Hide dropdown when clicking outside
document.addEventListener('click', function(event) {
	if (dropdownMenu.style.display === 'flex' && !dropdownMenu.contains(event.target) && event.target !== profileImgBtn && !profileImgBtn.contains(event.target)) {
		dropdownMenu.style.display = 'none';
	}
});



