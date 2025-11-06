import { greetings, convertTo12HourFormat, getDayIndex, parseTime, setupTimeDropdownLogic } from "./utils/time-date.js";
import { changeStatusTextColor } from "./utils/color.js";
import { currentUser } from "./proflocator.js";

import { getProfessors } from "./data-store.js";
// --- Initialization ---

// USER DATA
let user = '';
let editingUser = null; // DUPLICATE COPY FOR EDITING

// --- Location Data ---
const buildingToRoomsMap = {
    'Admin Building': [
        'Ab Faculty',
        'Ab1',
        'Ab2 Sports Development and Socio Cultural Office',
        'Ab3',
        'Ab4',
        'Ab5',
        'Ab6 Psychology Laboratory',
        'Ab7-Ab8 Registrar',
        'Ab9 Canteen Sentinel\'s Office',
        'Chemlab',
        'Deans office',
        'Finance Management Office',
        'Gender and Development Child Minding Room',
        'Guidance office',
        'Health service office',
        'Institutional audit office',
        'Lazaro Hall',
        'Management Information System',
        'Office of assistant vice-president for academic affairs',
        'Office of student affairs',
        'Office of the college president',
        'OVP for academic affairs',
        'OVP for administration',
        'OVP for extension and linkages',
        'OVP for research and innovations',
        'OVP for research extension, planning, and quality assurance',
        'Physics Laboratory',
        'Record Management Office',
        'Speech Laboratory',
        'Sports Development Office'
    ],
    'Rizal Building': [
        'R-1', 'R-2', 'R-3', 'R-4', 'R-5', 'R-6', 'R-7', 'R-8', 'R-9', 'R-10', 'R-11', 'R-12', 'R-13', 'R-14',
        'Rizal Conference room', 'Rizal Faculty Office'
    ],
    'JMC Building': [
        '1 JMC-CL1', '1 JMC-CL2', '1 JMC-CL3', '1 JMC-CL4', '1 JMC-CL5',
        '2 JMC-3', '2 JMC-4', '2 JMC-5', '2 JMC-6',
        '3 JMC-7', '3 JMC-8', '3 JMC-9', '3 JMC-10', '3 JMC-11', '3 JMC-12',
        'Audio Visual room', 'Library'
    ]
};

async function initializeProfSection() {
    // 1. Check if the current user is a professor. If not, hide the section and stop.
    if (!currentUser || currentUser.role !== 'PROFESSOR') {
        document.getElementById('prof-sec').style.display = 'none';
        return;
    }

    // If the user is a professor, make the section visible.
    document.getElementById('prof-sec').style.display = 'flex';

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

        // 4. INITIALIZE THE EDITING SECTION (MOVED HERE)
        editingUser = JSON.parse(JSON.stringify(user));
        renderEditingPageOfficeHours();
        populateClassRoomOptions(); // Populate the class schedule room dropdown
        renderClassSchedules(); // Render the class schedules table

        // --- Attach all event listeners for the editing section ---
        document.getElementById('status-options').addEventListener('change', handleStatusChange);
        document.getElementById('building-options').addEventListener('change', handleBuildingChange);
        document.getElementById('room-options').addEventListener('change', handleRoomChange);
        document.getElementById('add-class-btn').addEventListener('click', handleAddClass); // This ID is in the HTML
        document.getElementById('add-consultation-hour-btn').addEventListener('click', handleAddOfficeHour);
        document.getElementById('update-btn').addEventListener('click', updateAvailabilityChanges);
        document.getElementById('status-until-time').addEventListener('change', handleStatusUntilChange);
        document.getElementById('update-schedule-btn').addEventListener('click', updateScheduleChanges);

        // --- Setup for Dynamic Time Dropdowns ---
        // --- Event listeners for enabling/disabling Add buttons ---
        const consultationInputs = [
            document.getElementById('add-consultation-hour-day'),
            document.getElementById('add-consultation-hour-from-time'),
            document.getElementById('add-consultation-hour-to-time')
        ];
        consultationInputs.forEach(input => input.addEventListener('change', checkConsultationHourInputs));

        const classScheduleInputs = [
            document.getElementById('new-class-day'),
            document.getElementById('new-class-time-from'),
            document.getElementById('new-class-time-to'),
            document.getElementById('new-class-subject'),
            document.getElementById('new-class-section'),
            document.getElementById('new-class-room')
        ];
        classScheduleInputs.forEach(input => {
            input.addEventListener('change', checkClassScheduleInputs); // For <select>
            input.addEventListener('input', checkClassScheduleInputs);  // For <input type="text">
        });

        checkConsultationHourInputs();
        checkClassScheduleInputs();
        setupTimeDropdownLogic(
            document.getElementById('add-consultation-hour-from-time'),
            document.getElementById('add-consultation-hour-to-time')
        );
        setupTimeDropdownLogic(
            document.getElementById('new-class-time-from'),
            document.getElementById('new-class-time-to')
        );

    } catch (error) {
        console.error("Failed to fetch professor data for section:", error);
    }
}

/**
 * Checks if all consultation hour input fields are filled and enables/disables the add button.
 */
function checkConsultationHourInputs() {
    const day = document.getElementById('add-consultation-hour-day').value;
    const from = document.getElementById('add-consultation-hour-from-time').value;
    const to = document.getElementById('add-consultation-hour-to-time').value;
    const addButton = document.getElementById('add-consultation-hour-btn');

    addButton.disabled = !(day && from && to);
}

/**
 * Checks if all class schedule input fields are filled and enables/disables the add button.
 */
function checkClassScheduleInputs() {
    const day = document.getElementById('new-class-day').value;
    const from = document.getElementById('new-class-time-from').value;
    const to = document.getElementById('new-class-time-to').value;
    const subject = document.getElementById('new-class-subject').value.trim();
    const section = document.getElementById('new-class-section').value.trim();
    const roomType = document.getElementById('new-class-room').value;
    const addButton = document.getElementById('add-class-btn');

    addButton.disabled = !(day && from && to && subject && section && roomType);
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
    displayProfStatusUntil(); // STATUS UNTIL
}

function displayProfStatusUntil() {
    const statusUntilContainer = document.getElementById('prof-sec-status-until');
    if (user.statusUntil) {
        statusUntilContainer.innerHTML = ` (until ${convertTo12HourFormat(user.statusUntil)})`;
        statusUntilContainer.style.display = 'inline';
    } else {
        statusUntilContainer.style.display = 'none';
    }
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
    const sorted = sortOfficeHours(user.consultationHours);
    if (sorted.length === 0) {
        profDayTimeSetHTML = '<p class="empty-consultation-hours">No consultation hours set.</p>';
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
    document.getElementById('prof-sec-consultation-hours-container').innerHTML = profDayTimeSetHTML;
}

/**
 * Compares the original user data with the editingUser data to detect changes.
 * Enables or disables the update button based on whether changes are found.
 */
function checkForAvailabilityChanges() {
    const updateBtn = document.getElementById('update-btn');
    if (!user || !editingUser) {
        updateBtn.disabled = true;
        return;
    }

    const originalHours = sortOfficeHours(user.consultationHours);
    // When checking for changes, we should compare against the hours that will *actually* be saved.
    const finalEditedHours = sortOfficeHours(editingUser.consultationHours.filter(h => !h._toDelete));

    const statusUntilChanged = user.statusUntil !== editingUser.statusUntil;
    const statusChanged = user.status !== editingUser.status;
    const locationChanged = JSON.stringify(user.location) !== JSON.stringify(editingUser.location);
    const consultHoursChanged = JSON.stringify(originalHours) !== JSON.stringify(finalEditedHours);

    // Enforce: if status is 'Not Set', location must be set to 'Not Set'.
    // If location is changed while status is 'Not Set' and editingUser.status is not set, disable update.
    const statusIsNotSet = !editingUser.status || editingUser.status === 'Not Set';
    // Only block updates when the status is Not Set AND the user is attempting to change the location.
    // Allow other changes (like consultation-hour deletions) to proceed.
    if (statusIsNotSet && locationChanged) {
        updateBtn.disabled = true;
        return;
    }

    updateBtn.disabled = !(statusChanged || locationChanged || consultHoursChanged || statusUntilChanged);
}

function checkForScheduleChanges() {
    const scheduleUpdateBtn = document.getElementById('update-schedule-btn');
    if (!user || !editingUser) {
        scheduleUpdateBtn.disabled = true;
        return;
    }

    const originalSchedules = sortSchedules(user.classSchedules);
    const editedSchedules = sortSchedules(editingUser.classSchedules);

    const classSchedulesChanged = JSON.stringify(originalSchedules) !== JSON.stringify(editedSchedules);

    scheduleUpdateBtn.disabled = !classSchedulesChanged;
}

/**
 * Populates the 'status-until-time' dropdown with 15-minute intervals
 * for the next 5 hours.
 */
function populateStatusUntilOptions() {
    const dropdown = document.getElementById('status-until-time');
    dropdown.innerHTML = ''; // Clear existing options

    // Add a "Forever" option
    const foreverOption = document.createElement('option');
    foreverOption.value = 'forever';
    foreverOption.textContent = 'Until Changed';
    dropdown.appendChild(foreverOption);

    // --- Calculate the correct start time, rounded up to the next 15-minute interval ---
    const now = new Date();
    const minutes = now.getMinutes();
    const remainder = minutes % 15;
    const minutesToAdd = remainder === 0 ? 0 : 15 - remainder;
    
    // Create a new Date object for the start time to avoid modifying 'now'
    const startTime = new Date(now.getTime() + minutesToAdd * 60 * 1000);
    // Reset seconds and milliseconds to ensure clean 15-minute intervals
    startTime.setSeconds(0, 0);

    // Set the end time to 9:00 PM of the current day, as requested.
    const endTime = new Date(now);
    endTime.setHours(21, 0, 0, 0); // 21:00 is 9:00 PM

    // Loop from the rounded-up start time until 9:00 PM
    for (let time = new Date(startTime); time <= endTime; time.setMinutes(time.getMinutes() + 15)) {
        const option = document.createElement('option');
        const time24hr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
        option.value = time24hr;
        option.textContent = convertTo12HourFormat(time24hr);
        dropdown.appendChild(option);
    }

    dropdown.value = editingUser.statusUntil ? editingUser.statusUntil : 'forever';
}

// DISPLAY OFFICE HOURS IN EDITING PAGE USING editingUser(duplicate copy of prof data)
function renderEditingPageOfficeHours() {
    let profDayTimeSetHTML = '';
    if (!editingUser) return;

    // Check for changes and set button states initially
    checkForAvailabilityChanges();
    checkForScheduleChanges();
    // Set status dropdown to current editingUser.status

    // Populate and set the status-until dropdown
    populateStatusUntilOptions();

    const statusDropdown = document.getElementById('status-options');
    if (statusDropdown) {
        // Map status to value
        let statusValue = 'not-set';
        if (editingUser.status === 'Available') statusValue = 'available';
        else if (editingUser.status === 'In a Meeting') statusValue = 'in-a-meeting';
        else if (editingUser.status === 'In Class') statusValue = 'in-class';
        else if (editingUser.status === 'Away') statusValue = 'away';
        else if (editingUser.status === 'Busy') statusValue = 'busy';
        statusDropdown.value = statusValue;
    }

    // Set location dropdowns to current editingUser.location
    populateBuildingOptions(); // Populate buildings first
    const buildingDropdown = document.getElementById('building-options');
    const roomDropdown = document.getElementById('room-options');

    const currentBuilding = editingUser.location?.Building || 'Rizal Building';
    buildingDropdown.value = currentBuilding;

    // Update room options based on the current building
    updateRoomOptions(currentBuilding);

    // If status is Not Set, default room to 'Not Set'
    const currentRoom = editingUser.location?.Room || (editingUser.status === 'Not Set' ? 'Not Set' : 'Faculty Room');
    roomDropdown.value = currentRoom;

    // Ensure editingUser.location reflects the UI
    if (!editingUser.location) editingUser.location = { Building: currentBuilding, Room: currentRoom };
    else editingUser.location.Room = currentRoom;

    // Ensure the editingUser object is consistent
    if (!editingUser.location) editingUser.location = { Building: currentBuilding, Room: currentRoom };

    // --- Check total hours and disable add functionality if limit is reached ---
    let totalMinutes = 0;
    editingUser.consultationHours.forEach(hour => {
        // Only count hours that are NOT marked for deletion
        if (!hour._toDelete) {
            totalMinutes += parseTime(hour.to) - parseTime(hour.from);
        }
    });

    const addButton = document.getElementById('add-consultation-hour-btn');

    if (totalMinutes >= 600) {
        const totalHours = (totalMinutes / 60).toFixed(1);
        addButton.title = `You have reached the 10-hour weekly limit (${totalHours} hours set).`;
        addButton.disabled = true;
    } else {
        addButton.title = '';
        addButton.disabled = false;
    }
    const sorted = sortOfficeHours(editingUser.consultationHours);
    if (sorted.length === 0) {
        profDayTimeSetHTML = '';
    } else {
        sorted.forEach((set, idx) => {
            const html = `
            <tr data-idx="${idx}" class="${set._toDelete ? 'marked-for-deletion' : ''}">
                <td class="day">${set.day}</td>
                <td class="time-range">${set.from} - ${set.to}</td>
                <td>
                    <button 
                        class="btn-style-2 ${set._toDelete ? 'btn-style-secondary' : 'btn-style-danger'} delete-consultation-btn"
                    >
                        ${set._toDelete ? 'Undo' : 'Delete'}
                    </button>
                </td>
            </tr>
            `;
            profDayTimeSetHTML += html;
        });
    }
    const tableBody = document.getElementById('consultation-hours-tbody');
    const addRow = tableBody.querySelector('tr:last-child'); // Keep the 'add' row
    tableBody.innerHTML = profDayTimeSetHTML; // Add the data rows
    if (addRow) {
        tableBody.appendChild(addRow); // Re-attach the 'add' row
    }

    // Attach a single, delegated event listener to the table body for handling deletes.
    // This is more efficient than adding a listener to every button.
    const consultationTableBody = document.getElementById('consultation-hours-tbody');
    consultationTableBody.onclick = function(e) {
        // Check if a delete button was clicked
        if (e.target && e.target.classList.contains('delete-consultation-btn')) {
            handleDeleteConsultationHour(e);
        }
    };
}

function handleDeleteConsultationHour(e) {
    const row = e.target.closest('tr');
    if (!row) return;

    // Read displayed values from the row to identify the real item in editingUser.consultationHours
    const day = row.querySelector('.day')?.textContent.trim();
    const timeRange = row.querySelector('.time-range')?.textContent.trim();
    if (!day || !timeRange) return;

    const [from, to] = timeRange.split(' - ');
    if (!from || !to) return;

    // Find the index in the original array (not the sorted copy)
    const originalIdx = editingUser.consultationHours.findIndex(h => h.day === day && h.from === from && h.to === to);
    if (originalIdx === -1) return;

    // Toggle the deletion flag on the actual editingUser entry
    editingUser.consultationHours[originalIdx]._toDelete = !editingUser.consultationHours[originalIdx]._toDelete;

    // Re-render to show the change and check if the main update button should be enabled
    renderEditingPageOfficeHours();
    checkForAvailabilityChanges();
}

// SELECT STATUS; ONLY UPDATE WHEN UPDATE BUTTON IS CLICKED
function handleStatusChange(e) {
    if (!editingUser) return;
    const value = e.target.value;
    let statusText = '';
    if (value === 'available') statusText = 'Available';
    else if (value === 'in-a-meeting') statusText = 'In a Meeting';
    else if (value === 'in-class') statusText = 'In Class';
    else if (value === 'away') statusText = 'Away';
    else if (value === 'busy') statusText = 'Busy';
    editingUser.status = statusText;
    checkForAvailabilityChanges();
}

function handleStatusUntilChange(e) {
    if (!editingUser) return;
    const value = e.target.value;
    if (value === 'forever') {
        editingUser.statusUntil = null;
    } else {
        editingUser.statusUntil = value;
    }
    checkForAvailabilityChanges();
}

// --- Dynamic Location Dropdown Logic ---

function populateBuildingOptions() {
    const buildingDropdown = document.getElementById('building-options');
    buildingDropdown.innerHTML = ''; // Clear existing options
    for (const building of Object.keys(buildingToRoomsMap)) {
        const option = document.createElement('option');
        option.value = building;
        option.textContent = building;
        buildingDropdown.appendChild(option);
    }
}

function updateRoomOptions(selectedBuilding) {
    const roomDropdown = document.getElementById('room-options');
    const rooms = buildingToRoomsMap[selectedBuilding] || [];
    roomDropdown.innerHTML = ''; // Clear existing options
    const maxLength = 40; // Max characters to display in the dropdown

    // Add a 'Not Set' default option
    const notSetOption = document.createElement('option');
    notSetOption.value = 'Not Set';
    notSetOption.textContent = 'Not Set';
    roomDropdown.appendChild(notSetOption);

    for (const room of rooms) {
        const option = document.createElement('option');
        option.value = room;
        option.title = room; // Show full name on hover

        // Truncate text if it's too long
        if (room.length > maxLength) {
            option.textContent = room.substring(0, maxLength - 3) + '...';
        } else {
            option.textContent = room;
        }

        roomDropdown.appendChild(option);
    }
}
// SELECT LOCATION; ONLY UPDATE WHEN UPDATE BUTTON IS CLICKED
function handleBuildingChange(e) {
    if (!editingUser) return;

    if (!editingUser.location) editingUser.location = { Building: '', Room: '' };
    const selectedBuilding = e.target.value;
    editingUser.location.Building = selectedBuilding;

    // Update room options and set the room to the first one in the list
    updateRoomOptions(selectedBuilding);
    const roomDropdown = document.getElementById('room-options');
    if (roomDropdown.options.length > 0) {
        editingUser.location.Room = roomDropdown.options[0].value;
        roomDropdown.value = editingUser.location.Room; // Also update the UI
    }
    checkForAvailabilityChanges();
}

function handleRoomChange(e) {
    if (!editingUser) return;
    if (!editingUser.location) editingUser.location = { Building: '', Room: '' };
    const selectedRoom = e.target.value;
    // If status is Not Set, prevent selecting a room other than 'Not Set'
    if ((!editingUser.status || editingUser.status === 'Not Set') && selectedRoom !== 'Not Set') {
        // Show a warning and revert selection
        alert('Please set your status before selecting a location.');
        // revert dropdown back to Not Set if available
        const roomDropdown = document.getElementById('room-options');
        if (roomDropdown) roomDropdown.value = 'Not Set';
        editingUser.location.Room = 'Not Set';
        checkForAvailabilityChanges();
        return;
    }
    editingUser.location.Room = selectedRoom;
    checkForAvailabilityChanges();
}
/**
 * Populates the 'Room / Type' dropdown for the class schedule table.
 * It includes options for Online/Asynchronous and all rooms from buildings.
 */
function populateClassRoomOptions() {
    // A separate list for class rooms to avoid showing offices/faculty rooms
    const buildingToClassRoomsMap = {
        'Admin Building': [
            'Ab1', 'Ab3', 'Ab4', 'Ab5', 'Ab6 Psychology Laboratory', 'Chemlab',
            'Lazaro Hall', 'Physics Laboratory', 'Speech Laboratory'
        ],
        'Rizal Building': [
            'R-1', 'R-2', 'R-3', 'R-4', 'R-5', 'R-6', 'R-7', 'R-8', 'R-9', 'R-10',
            'R-11', 'R-12', 'R-13', 'R-14', 'Rizal Conference room'
        ],
        'JMC Building': [
            '1 JMC-CL1', '1 JMC-CL2', '1 JMC-CL3', '1 JMC-CL4', '1 JMC-CL5',
            '2 JMC-3', '2 JMC-4', '2 JMC-5', '2 JMC-6', '3 JMC-7', '3 JMC-8',
            '3 JMC-9', '3 JMC-10', '3 JMC-11', '3 JMC-12', 'Audio Visual room'
        ]
    };
    const roomDropdown = document.getElementById('new-class-room');
    if (!roomDropdown) return;

    roomDropdown.innerHTML = ''; // Clear existing options

    // Add a placeholder
    const placeholder = new Option('Select Room/Type', '', true, true);
    placeholder.disabled = true;
    roomDropdown.add(placeholder);

    // Add non-physical class types
    roomDropdown.add(new Option('Online', 'Online'));
    roomDropdown.add(new Option('Asynchronous', 'Asynchronous'));

    // Add rooms from buildings using optgroup
    for (const building in buildingToClassRoomsMap) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = building;
        buildingToClassRoomsMap[building].forEach(room => {
            optgroup.appendChild(new Option(room, room));
        });
        roomDropdown.appendChild(optgroup);
    }
}

/**
 * Sorts class schedules by day and then by start time.
 * @param {Array} schedules - The array of schedule objects to sort.
 * @returns {Array} A new, sorted array of schedules.
 */
function sortSchedules(schedules = []) {
    return [...schedules].sort((a, b) => {
        const dayDiff = getDayIndex(a.day) - getDayIndex(b.day);
        if (dayDiff !== 0) return dayDiff;
        return parseTime(a.from) - parseTime(b.from);
    });
}

/**
 * Renders the class schedules into the table in the editing section.
 */
function renderClassSchedules() {
    const tableBody = document.querySelector('.class-schedule-table tbody');
    if (!tableBody) return;

    // Preserve the "add new" row
    const addRow = tableBody.querySelector('tr:last-child');
    tableBody.innerHTML = ''; // Clear existing schedule rows

    const sortedSchedules = sortSchedules(editingUser.classSchedules);

    if (sortedSchedules.length > 0) {
        sortedSchedules.forEach((schedule, index) => {
            const timeString = `${convertTo12HourFormat(schedule.from)} - ${convertTo12HourFormat(schedule.to)}`;
            const row = document.createElement('tr');
            row.className = schedule._toDelete ? 'marked-for-deletion' : '';
            row.innerHTML = `
                <td data-day="${schedule.day}" data-from="${schedule.from}" data-to="${schedule.to}" data-subject="${schedule.subject}">${schedule.day}</td>
                <td>${timeString}</td>
                <td>${schedule.subject}</td>
                <td>${schedule.section}</td>
                <td>${schedule.roomType}</td>
                <td>
                    <button class="btn-style-2 ${schedule._toDelete ? 'btn-style-secondary' : 'btn-style-danger'} delete-class-btn">
                        ${schedule._toDelete ? 'Undo' : 'Delete'}
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Re-attach the "add new" row at the end
    if (addRow) {
        tableBody.appendChild(addRow);
    }

    // Re-attach delete button event listeners
    attachDeleteScheduleListeners();
}

/**
 * Attaches click event listeners to all "Delete" buttons in the schedule table.
 */
function attachDeleteScheduleListeners() {
    document.querySelectorAll('.delete-class-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const row = e.currentTarget.closest('tr');
            const firstCell = row.querySelector('td');
            const { day, from, to, subject } = firstCell.dataset;

            // Find the schedule to toggle
            const scheduleToToggle = editingUser.classSchedules.find(s =>
                s.day === day && s.from === from && s.to === to && s.subject === subject
            );

            if (scheduleToToggle) {
                // Toggle the deletion state
                scheduleToToggle._toDelete = !scheduleToToggle._toDelete;
            }

            renderClassSchedules();
            checkForScheduleChanges();
        });
    });
}

// ADD CLASS SCHEDULE
async function handleAddClass() {
    const day = document.getElementById('new-class-day').value;
    const from = document.getElementById('new-class-time-from').value;
    const to = document.getElementById('new-class-time-to').value;
    const subject = document.getElementById('new-class-subject').value.trim();
    const section = document.getElementById('new-class-section').value.trim();
    const roomType = document.getElementById('new-class-room').value;

    if (!day || !from || !to || !subject || !section || !roomType) {
        alert('Please fill all fields to add a class schedule.');
        return;
    }

    // Add to local editingUser and immediately persist
    editingUser.classSchedules.push({ day, from, to, subject, section, roomType });
    renderClassSchedules();
    checkForScheduleChanges();

    // Clear input fields after adding
    document.getElementById('new-class-day').value = '';
    document.getElementById('new-class-time-from').value = '';
    document.getElementById('new-class-time-to').value = '';
    document.getElementById('new-class-subject').value = '';
    document.getElementById('new-class-section').value = '';
    document.getElementById('new-class-room').value = '';
    checkClassScheduleInputs(); // Disable the add button again
}

// ADD OFFICE HOUR
function handleAddOfficeHour() {
    if (!editingUser) return;
    const daySelected = document.getElementById('add-consultation-hour-day');
    const timeFromSelected = document.getElementById('add-consultation-hour-from-time');
    const timeToSelected = document.getElementById('add-consultation-hour-to-time');

    // --- Calculate total hours to enforce 10-hour limit ---
    let totalMinutes = 0;
    // 1. Calculate existing hours
    editingUser.consultationHours.forEach(hour => {
        totalMinutes += parseTime(hour.to) - parseTime(hour.from);
    });

    if (totalMinutes >= 600) {
        alert('You have already reached the 10-hour weekly limit for consultation hours.');
        return;
    }

    // 2. Calculate duration of the new entry
    const newFromTime = convertTo12HourFormat(timeFromSelected.value);
    const newToTime = convertTo12HourFormat(timeToSelected.value);
    const newEntryMinutes = parseTime(convertTo12HourFormat(newToTime)) - parseTime(convertTo12HourFormat(newFromTime));

    // 3. Check if adding the new entry exceeds the 10-hour (600 minutes) limit
    if (totalMinutes + newEntryMinutes > 600) {
        const currentTotalHours = (totalMinutes / 60).toFixed(1);
        alert(`You cannot add this entry. You have already set ${currentTotalHours} hours of consultation time, and the weekly limit is 10 hours.`);
        return;
    }

    editingUser.consultationHours.push({
        day: daySelected.value,
        from: convertTo12HourFormat(timeFromSelected.value),
        to: convertTo12HourFormat(timeToSelected.value),
        // Ensure new items don't have the delete flag
        _toDelete: false 
    });
    
    daySelected.value = '';
    timeFromSelected.value = '';
    timeToSelected.value = '';

    checkConsultationHourInputs(); // Disable the add button again
    document.getElementById('update-btn').click(); // Auto-save on add
}

// UPDATE BUTTON
async function updateAvailabilityChanges() {
    if (editingUser) {
        // Filter out items marked for deletion before sending to the server
        const finalConsultationHours = editingUser.consultationHours.filter(h => !h._toDelete);

        // Construct the payload to be sent
        const updatePayload = {
            status: editingUser.status,
            statusUntil: editingUser.statusUntil,
            location: editingUser.location,
            consultationHours: finalConsultationHours,
        };

        // Check if location was changed and add timestamp
        const locationChanged = JSON.stringify(user.location) !== JSON.stringify(editingUser.location);
        if (locationChanged) {
            updatePayload.locationLastModified = new Date().toISOString();
        }

        // --- Send updated data to the server ---
        try {
            const response = await fetch(`/api/professors/${editingUser.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatePayload),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile on the server.');
            }
            const respJson = await response.json();
            alert('Availability updated successfully!');
            console.log('✅ Profile updated successfully on the server.');

            // --- Update local state and UI using server-returned doc when available ---
            const serverUpdated = respJson.updated;
            if (serverUpdated) {
                // Use server's canonical values to avoid clock skew or formatting differences
                user.status = serverUpdated.status;
                user.statusUntil = serverUpdated.statusUntil;
                user.location = serverUpdated.location;
                user.locationLastModified = serverUpdated.locationLastModified;
                user.consultationHours = serverUpdated.consultationHours || JSON.parse(JSON.stringify(finalConsultationHours));
            } else {
                // Fallback: use client-side values
                user.status = editingUser.status;
                user.statusUntil = editingUser.statusUntil;
                user.location = JSON.parse(JSON.stringify(editingUser.location));
                if (locationChanged) {
                    user.locationLastModified = updatePayload.locationLastModified;
                }
                user.consultationHours = JSON.parse(JSON.stringify(finalConsultationHours));
            }

            // Refresh central data store so other UI (prof info) will read server-stored timestamps
            await getProfessors(true);

            _handleSuccessfulUpdate();

            // After everything is updated, reset the editing state
            displayProfSectionContents();
            editingUser = JSON.parse(JSON.stringify(user));
            checkForAvailabilityChanges(); // This will disable the button
            renderEditingPageOfficeHours(); // Re-render the table to remove deleted rows
            // The color will be updated by the function below
        } catch (error) {
            console.error('❌ Error updating profile:', error);
            alert('Could not save changes. Please try again.');
        }
    }
}

async function updateScheduleChanges() {
    if (editingUser) {
        // Filter out items marked for deletion before sending
        const finalClassSchedules = editingUser.classSchedules.filter(s => !s._toDelete);

        try {
            const response = await fetch(`/api/professors/${editingUser.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    classSchedules: finalClassSchedules,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update schedule on the server.');
            }
            alert('Schedule updated successfully!');
            console.log('✅ Schedule updated successfully on the server.');

            // --- Update local state and UI only AFTER successful save ---
            user.classSchedules = JSON.parse(JSON.stringify(finalClassSchedules));

            _handleSuccessfulUpdate();

            // After everything is updated, reset the editing state
            editingUser = JSON.parse(JSON.stringify(user));
            checkForScheduleChanges(); // This will disable the button
            renderClassSchedules(); // Re-render the table to remove deleted rows
        } catch (error) {
            console.error('❌ Error updating schedule:', error);
            alert('Could not save schedule changes. Please try again.');
        }
    }
}

/**
 * Helper function to perform common UI updates after a successful save.
 */
function _handleSuccessfulUpdate() {
    // Hide the info page since the data is now fresh
    document.getElementById('info-page').style.display = 'none';

    // Remove the 'active' class from the selected card to remove the highlight
    const activeCard = document.querySelector('.prof-card.active');
    if (activeCard) {
        activeCard.classList.remove('active');
        // Also update the status on the card itself
        if (activeCard.dataset.email === user.email) {
            updateUserProfCardStatus();
        }
    }
}

function updateUserProfCardStatus() {
    document.querySelectorAll('.prof-card').forEach(card => {
        const cardEmail = card.dataset.email;
        if (cardEmail === user.email) {
            const statusContainer = card.querySelector('.status-container'); // The <p> tag
            const statusUntilText = user.statusUntil ? ` (until ${convertTo12HourFormat(user.statusUntil)})` : '';
            
            // Update the entire content of the status paragraph
            statusContainer.innerHTML = `<span class="status">${user.status}</span><span class="status-until">${statusUntilText}</span>`;
            changeStatusTextColor(); // Recolor the status after an update
        }
    })
}

// Initialize the section after the DOM is fully loaded and other scripts have run
document.addEventListener('DOMContentLoaded', initializeProfSection);
