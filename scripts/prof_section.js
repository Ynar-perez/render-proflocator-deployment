import { greetings, convertTo12HourFormat, getDayIndex } from "./utils/time-date.js";
import { changeStatusTextColor } from "./utils/color.js";
import { currentUser } from "./proflocator.js";

import { getProfessors } from "./data-store.js";
// --- Initialization ---

// USER DATA
let user = '';
let editingUser = null; // DUPLICATE COPY FOR EDITING

initializeProfSection();

async function initializeProfSection() {
    // 1. Check if the current user is a professor. If not, hide the section and stop.
    if (!currentUser || currentUser.role !== 'PROFESSOR') {
        document.getElementById('prof-sec').style.display = 'none';
        return;
    }

    // If the user is a professor, make the section visible.
    document.getElementById('prof-sec').style.display = 'flex';
    document.getElementById('student-section').style.paddingTop = '30px';

    // 2. IDENTIFY THE USER AND GET DATA
    try {
        const profData = await getProfessors(); // Use the central data store
        // Find the professor profile that matches the logged-in user's email
        user = profData.find(prof => prof.email === currentUser.email);

        if (!user) {
            console.error("Could not find a professor profile for the logged-in user.");
            return;
        }
        // 3. DISPLAY CONTENTS IN PROF SECTION USING THE DATA
        displayProfSectionContents();
    } catch (error) {
        console.error("Failed to fetch professor data for section:", error);
    }
}

export async function refreshProfSection() {
    if (!currentUser || currentUser.role !== 'PROFESSOR') {
        return; // Don't do anything if not a professor
    }
    try {
        const profData = await getProfessors(); // Get latest data from the store
        const updatedUser = profData.find(prof => prof.email === currentUser.email);
        if (updatedUser) {
            user = updatedUser; // Update the module's user object
            displayProfSectionContents();
        }
    } catch (error) {
        console.error("Failed to refresh professor section:", error);
    }
}

function displayProfSectionContents() {
    greetings(); // GREETING
    document.getElementById('prof-user-name').innerHTML = user.fullName; // NAME
    displayProfStatus(); // STATUS in the professor's own dashboard
    changeStatusTextColor(); // This will now color all status texts on the page
    displayProfLocation(); // LOCATION
    renderOfficeHours(); // OFFICE HOURS
}

// // Converts a time string (e.g., "7:00 AM" or "13:30") to total minutes since midnight for easy time comparison and sorting.
function parseTime(timeStr) {
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier) {
        if (modifier.toUpperCase() === 'PM' && hours !== 12) hours += 12;
        if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
    }
    return hours * 60 + (minutes || 0);
}

// SORT OFFICE HOURS
export function sortOfficeHours(arr) {
    return arr.slice().sort((a, b) => {
        const dayDiff = getDayIndex(a.day) - getDayIndex(b.day);
        if (dayDiff !== 0) return dayDiff;
        return parseTime(a.from) - parseTime(b.from);
    });
}

// DISPLAY STATUS
function displayProfStatus() {
    const statusContainer = document.getElementById('prof-sec-status');
    statusContainer.innerHTML = user.status || 'Not Set';
}

// DISPLAY LOCATION
function displayProfLocation() {
    const locationContainer = document.getElementById('prof-sec-location');
    if (user.location && user.location.Room && user.location.Building) {
        locationContainer.innerHTML = `${user.location.Room} at ${user.location.Building}`;
    } else {
        locationContainer.innerHTML = 'Not Set';
    }
}

// DISPLAY OFFICE HOURS
function renderOfficeHours() {
    let profDayTimeSetHTML = '';
    const sorted = sortOfficeHours(user.officeHours);
    if (sorted.length === 0) {
        profDayTimeSetHTML = '<p class="empty-office-hours">No office hours set.</p>';
    } else {
        sorted.forEach((set) => {
            const singleDayTime = `
                <div class="day-time-container">
                    <p class="day">${set.day}:</p>
                    <p class="from-time">${set.from}</p>
                    <p class="hyphen">-</p>
                    <p class="to-time">${set.to}</p>
                </div>
            `;
            profDayTimeSetHTML += singleDayTime;
        });
    }
    document.getElementById('prof-sec-office-hours-container').innerHTML = profDayTimeSetHTML;
}

// EDIT BUTTON; OPENS EDITING PAGE
document.getElementById('edit-btn').addEventListener('click', () => {
    editingUser = JSON.parse(JSON.stringify(user));
    const editButton = document.getElementById('edit-btn');

    document.getElementById('prof-sec-edit').style.display = 'flex';
    editButton.textContent = 'Editing...';
    editButton.classList.add('editing-state');
    editButton.disabled = true;
    const daySelected = document.getElementById('add-office-hour-day');
    const timeFromSelected = document.getElementById('add-office-hour-from-time');
    const timeToSelected = document.getElementById('add-office-hour-to-time');
    if (daySelected) {
        daySelected.value = '';
        daySelected.removeAttribute('placeholder');
    }
    if (timeFromSelected) {
        timeFromSelected.value = '';
        timeFromSelected.removeAttribute('placeholder');
    }
    if (timeToSelected) {
        timeToSelected.value = '';
        timeToSelected.removeAttribute('placeholder');
    }
    renderEditingPageOfficeHours();
});

// DISPLAY OFFICE HOURS IN EDITING PAGE USING editingUser(duplicate copy of prof data)
function renderEditingPageOfficeHours() {
    let profDayTimeSetHTML = '';
    if (!editingUser) return;
    // Set status dropdown to current editingUser.status
    const statusDropdown = document.getElementById('status-options');
    if (statusDropdown) {
        // Map status to value
        let statusValue = 'Not Set';
        if (editingUser.status === 'Available') statusValue = 'available';
        else if (editingUser.status === 'In a Meeting') statusValue = 'in-a-meeting';
        else if (editingUser.status === 'In Class') statusValue = 'in-class';
        else if (editingUser.status === 'Away') statusValue = 'away';
        else if (editingUser.status === 'Busy') statusValue = 'busy';
        statusDropdown.value = statusValue;
    }

    // Set location dropdowns to current editingUser.location
    const buildingDropdown = document.getElementById('building-options');
    const roomDropdown = document.getElementById('room-options');
    buildingDropdown.value = editingUser.location?.Building || 'Rizal Building';
    roomDropdown.value = editingUser.location?.Room || 'Faculty';

    const sorted = sortOfficeHours(editingUser.officeHours);
    if (sorted.length === 0) {
        profDayTimeSetHTML = '<p class="empty-office-hours">No office hours set.</p>';
    } else {
        sorted.forEach((set, idx) => {
            const html = `
            <div class="prof-sec-edit-office-hour" data-idx="${idx}">
            <p>${set.day}</p>
            <p>${set.from}</p>
            <p>-</p>
            <p>${set.to}</p>
            <p class="office-hour-delete-text js-office-hour-delete-text" data-idx="${idx}"><i class="fa-solid fa-minus"></i></p>
            </div>
            `;
            profDayTimeSetHTML += html;
        });
    }
    document.getElementById('prof-sec-edit-office-hours').innerHTML = profDayTimeSetHTML;

    // DELETE OFFICE HOUR WHEN CLICKED
    document.querySelectorAll('.js-office-hour-delete-text').forEach(deleteButton => {
        deleteButton.addEventListener('click', (e) => {
            let target = e.target;
            // If the icon is clicked, get parent
            if (target.tagName === 'I') {
                target = target.parentElement;
            }
            const idx = parseInt(target.getAttribute('data-idx'));
            const sorted = sortOfficeHours(editingUser.officeHours);
            const toDelete = sorted[idx];
            const realIdx = editingUser.officeHours.findIndex(oh => oh.day === toDelete.day && oh.from === toDelete.from && oh.to === toDelete.to);
            if (realIdx !== -1) {
                editingUser.officeHours.splice(realIdx, 1);
                renderEditingPageOfficeHours();
            }
        });
    });
}

// SELECT STATUS; ONLY UPDATE WHEN UPDATE BUTTON IS CLICKED
document.getElementById('status-options').addEventListener('change', (e) => {
    if (!editingUser) return;
    const value = e.target.value;
    let statusText = '';
    if (value === 'available') statusText = 'Available';
    else if (value === 'in-a-meeting') statusText = 'In a Meeting';
    else if (value === 'in-class') statusText = 'In Class';
    else if (value === 'away') statusText = 'Away';
    else if (value === 'busy') statusText = 'Busy';
    editingUser.status = statusText;
});

// SELECT LOCATION; ONLY UPDATE WHEN UPDATE BUTTON IS CLICKED
document.getElementById('building-options').addEventListener('change', (e) => {
    if (!editingUser) return;
    if (!editingUser.location) editingUser.location = { Building: '', Room: '' };
    editingUser.location.Building = e.target.value;
});
document.getElementById('room-options').addEventListener('change', (e) => {
    if (!editingUser) return;
    if (!editingUser.location) editingUser.location = { Building: '', Room: '' };
    editingUser.location.Room = e.target.value;
});

// ADD OFFICE HOUR
document.getElementById('js-office-hour-add-text').addEventListener('click', () => {
    if (!editingUser) return;
    const daySelected = document.getElementById('add-office-hour-day');
    const timeFromSelected = document.getElementById('add-office-hour-from-time');
    const timeToSelected = document.getElementById('add-office-hour-to-time');

    // Return if any field is empty
    if (daySelected.value === '' || timeFromSelected.value === '' || timeToSelected.value === '') {
        alert('Please fill out all fields before adding.');
        return;
    }

    editingUser.officeHours.push({
        day: daySelected.value,
        from: convertTo12HourFormat(timeFromSelected.value),
        to: convertTo12HourFormat(timeToSelected.value)
    });

    daySelected.value = '';
    timeFromSelected.value = '';
    timeToSelected.value = '';

    renderEditingPageOfficeHours();
});

// --- Dynamic Time Dropdown Logic ---
// When a "From" time is selected, disable invalid "To" time options.
const timeFromSelected = document.getElementById('add-office-hour-from-time');
const timeToSelected = document.getElementById('add-office-hour-to-time');

timeFromSelected.addEventListener('change', () => {
    const fromTimeValue = timeFromSelected.value;

    if (!fromTimeValue) {
        for (const option of timeToSelected.options) {
            option.disabled = false;
        }
        return;
    }

    let shouldResetToTime = false;

    for (const option of timeToSelected.options) {
        if (!option.value) continue;

        option.disabled = option.value <= fromTimeValue;

        if (option.selected && option.disabled) {
            shouldResetToTime = true;
        }
    }

    if (shouldResetToTime) {
        timeToSelected.value = '';
    }
});

// UPDATE BUTTON
document.getElementById('update-btn').addEventListener('click', updateChanges);

async function updateChanges() {
    if (editingUser) {
        // --- Send updated data to the server ---
        try {
            const response = await fetch(`http://localhost:3000/api/professors/${editingUser.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: editingUser.status,
                    location: editingUser.location,
                    officeHours: editingUser.officeHours,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile on the server.');
            }
            console.log('✅ Profile updated successfully on the server.');

            // --- Update local state and UI only AFTER successful save ---
            user.officeHours = JSON.parse(JSON.stringify(editingUser.officeHours));
            user.status = editingUser.status;
            user.location = JSON.parse(JSON.stringify(editingUser.location));

            displayProfSectionContents();
            document.getElementById('prof-sec-edit').style.display = 'none';
            const editButton = document.getElementById('edit-btn');
            editButton.textContent = 'Edit';
            editButton.classList.remove('editing-state');
            editButton.disabled = false;
            editingUser = null;

            // HIDE INFO PAGE WHEN UPDATED
            document.getElementById('info-page').style.display = 'none';


            // Remove 'active' class from the selected card to remove the highlight
            const activeCard = document.querySelector('.prof-card.active');
            if (activeCard) {
                activeCard.classList.remove('active');
            }

            updateUserProfCardStatus();
            // The color will be updated by the function below
        } catch (error) {
            console.error('❌ Error updating profile:', error);
            alert('Could not save changes. Please try again.');
        }
    }
}

function updateUserProfCardStatus() {
    document.querySelectorAll('.prof-card').forEach(card => {
        const cardEmail = card.dataset.email;
        if (cardEmail === user.email) {
            const statusElement = card.querySelector('.status');
            statusElement.innerText = user.status;
            changeStatusTextColor(); // Recolor all statuses after an update
        }
    })
}

// CANCEL EDITING BUTTON
document.getElementById('cancel-btn').addEventListener('click', () => {
    document.getElementById('prof-sec-edit').style.display = 'none';
    const editButton = document.getElementById('edit-btn');
    editButton.textContent = 'Edit';
    editButton.classList.remove('editing-state');
    editButton.disabled = false;
    editingUser = null;
    document.getElementById('add-office-hour-day').value = '';
    document.getElementById('add-office-hour-from-time').value = '';
    document.getElementById('add-office-hour-to-time').value = '';
});
