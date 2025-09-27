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

// HTML OFFICE HOUR INPUT ELEMENTS

document.getElementById('add-office-hour').innerHTML = `
	<select name="day" id="add-office-hour-day">
		<option value="" disabled selected>Day</option>
		<option value="Monday">Mon</option>
		<option value="Tuesday">Tues</option>
		<option value="Wednesday">Wed</option>
		<option value="Thursday">Thu</option>
		<option value="Friday">Fri</option>
		<option value="Saturday">Sat</option>
	</select>

	<!--START-->
	<select name="from" id="add-office-hour-from-time">
		<option value="" disabled selected>From</option>
		<option value="07:00">7:00 AM</option>
		<option value="07:30">7:30 AM</option>
		<option value="08:00">8:00 AM</option>
		<option value="08:30">8:30 AM</option>
		<option value="09:00">9:00 AM</option>
		<option value="09:30">9:30 AM</option>
		<option value="10:00">10:00 AM</option>
		<option value="10:30">10:30 AM</option>
		<option value="11:00">11:00 AM</option>
		<option value="11:30">11:30 AM</option>
		<option value="12:00">12:00 PM</option>
		<option value="12:30">12:30 PM</option>
		<option value="13:00">1:00 PM</option>
		<option value="13:30">1:30 PM</option>
		<option value="14:00">2:00 PM</option>
		<option value="14:30">2:30 PM</option>
		<option value="15:00">3:00 PM</option>
		<option value="15:30">3:30 PM</option>
		<option value="16:00">4:00 PM</option>
		<option value="16:30">4:30 PM</option>
		<option value="17:00">5:00 PM</option>
	</select>

	<p>-</p>

	<select name="to" id="add-office-hour-to-time">
		<option value="" disabled selected>To</option>
		<option value="07:00">7:00 AM</option>
		<option value="07:30">7:30 AM</option>
		<option value="08:00">8:00 AM</option>
		<option value="08:30">8:30 AM</option>
		<option value="09:00">9:00 AM</option>
		<option value="09:30">9:30 AM</option>
		<option value="10:00">10:00 AM</option>
		<option value="10:30">10:30 AM</option>
		<option value="11:00">11:00 AM</option>
		<option value="11:30">11:30 AM</option>
		<option value="12:00">12:00 PM</option>
		<option value="12:30">12:30 PM</option>
		<option value="13:00">1:00 PM</option>
		<option value="13:30">1:30 PM</option>
		<option value="14:00">2:00 PM</option>
		<option value="14:30">2:30 PM</option>
		<option value="15:00">3:00 PM</option>
		<option value="15:30">3:30 PM</option>
		<option value="16:00">4:00 PM</option>
		<option value="16:30">4:30 PM</option>
		<option value="17:00">5:00 PM</option>
	</select>

	<p id="js-office-hour-add-text" class="office-hour-add-text"><i class="fa-solid fa-plus"></i></p>  
`;