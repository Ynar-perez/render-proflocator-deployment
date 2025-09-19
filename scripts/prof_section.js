
import { profData } from "../data/prof.js";
import { greetings, convertTo12HourFormat, getDayIndex } from "./utils/time-date.js";

// --- Initialization ---

displayProfSection();
greetings();

// USER DATA
let user = '';
let editingUser = null; // DUPLICATE COPY FOR EDITING

// DISPLAY PROF SECTION IF USER IS A PROFESSOR
function displayProfSection() {
    const typeOfAccount = document.getElementById('user-type');
    if (typeOfAccount.innerText === 'PROFESSOR') {
        document.getElementById('prof-sec').style.display = 'flex';
        document.getElementById('student-section').style.paddingTop = '30px';
    } else if (typeOfAccount.innerText === 'STUDENT') {
        document.getElementById('prof-sec').style.display = 'none';
    }
}

// FIND THE CURRENT USER FROM profData
profData.forEach((prof) => {
    if (prof.pName === document.getElementById('user-name').innerText) {
        user = prof;
    }
});
document.getElementById('prof-user-name').innerHTML = user.pName;

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
function sortOfficeHours(arr) {
    return arr.slice().sort((a, b) => {
        const dayDiff = getDayIndex(a.day) - getDayIndex(b.day);
        if (dayDiff !== 0) return dayDiff;
        return parseTime(a.from) - parseTime(b.from);
    });
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

// DISPLAY OFFICE HOURS IN EDITING PAGE

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

// EDIT BUTTON; OPENS EDITING PAGE
document.getElementById('edit-btn').addEventListener('click', () => {
    editingUser = JSON.parse(JSON.stringify(user));
    document.getElementById('prof-sec-edit').style.display = 'flex';
    renderEditingPageOfficeHours();
});

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

// UPDATE BUTTON
function updateChanges() {
    if (editingUser) {
        user.officeHours = JSON.parse(JSON.stringify(editingUser.officeHours));
        user.status = editingUser.status;
    }
    renderOfficeHours();
    document.getElementById('prof-sec-edit').style.display = 'none';
    editingUser = null;
}

document.getElementById('update-btn').addEventListener('click', updateChanges);

// CANCEL EDITING BUTTON
document.getElementById('cancel-btn').addEventListener('click', () => {
    document.getElementById('prof-sec-edit').style.display = 'none';
    editingUser = JSON.parse(JSON.stringify(user));
    document.getElementById('add-office-hour-day').value = '';
    document.getElementById('add-office-hour-from-time').value = '';
    document.getElementById('add-office-hour-to-time').value = '';
});

// RENDER
renderOfficeHours();
renderEditingPageOfficeHours();
