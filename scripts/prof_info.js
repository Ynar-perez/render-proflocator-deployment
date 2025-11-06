import { changeInfoSectionStatusColor } from './utils/color.js';
import { getProfessors } from './data-store.js';
import { convertTo12HourFormat, getDayIndex, parseTime, formatTimeAgo } from './utils/time-date.js';
import { sortOfficeHours } from './prof_section.js';

const profCardGrid = document.getElementById('prof-card-grid');

function unhideInfoPage() {
    const infoPage = document.getElementById('info-page');
    infoPage.style.display = 'flex';
}

function sortSchedules(schedules = []) {
    return [...(schedules || [])].sort((a, b) => {
        const dayDiff = getDayIndex(a.day) - getDayIndex(b.day);
        if (dayDiff !== 0) return dayDiff;
        // The 'from' time for schedules is in 24hr format 'HH:mm'
        // so we can use parseTime directly.
        const timeA = parseTime(a.from);
        const timeB = parseTime(b.from);
        return timeA - timeB;
    });
}

/**
 * Converts a full day name to its short abbreviation.
 * @param {string} day - The full name of the day (e.g., "Monday").
 * @returns {string} The abbreviated day name (e.g., "M").
 */
function getDayAbbreviation(day) {
    const abbreviations = {
        'Monday': 'M', 'Tuesday': 'T', 'Wednesday': 'W',
        'Thursday': 'Th', 'Friday': 'F', 'Saturday': 'S',
        'Sunday': 'Su'
    };
    return abbreviations[day] || day;
}

function generateProfInfoContents(professorDetails) {
    let profDayTimeSetHTML = '';

    const sortedOfficeHours = sortOfficeHours(professorDetails.consultationHours || []);

    if (sortedOfficeHours.length === 0) {
        profDayTimeSetHTML = '<p class="empty-consultation-hours">No consultation hours set.</p>';
    } else {
        profDayTimeSetHTML = `<table class="info-schedule-table">
            <thead>
                <tr>
                    <th>Day</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>`;
        sortedOfficeHours.forEach((set) => {
            profDayTimeSetHTML += `
                <tr>
                    <td class="day-col">${set.day}:</td>
                    <td class="time-col">${set.from} - ${set.to}</td>
                </tr>
            `;
        });
        profDayTimeSetHTML += '</tbody></table>';
    }

    const statusText = professorDetails.status || 'Not Set';
    const statusUntilText = professorDetails.statusUntil ? ` (until ${convertTo12HourFormat(professorDetails.statusUntil)})` : '';

    let classScheduleHTML = '';
    const sortedSchedules = sortSchedules(professorDetails.classSchedules);

    if (sortedSchedules.length === 0) {
        classScheduleHTML = '<p class="empty-schedule">No class schedules set.</p>';
    } else {
        classScheduleHTML = `<table class="info-schedule-table">
            <thead>
                <tr>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Subject</th>
                    <th>Section</th>
                    <th>Room/Type</th>
                </tr>
            </thead>
            <tbody>`;
        sortedSchedules.forEach(schedule => {
            const timeString = `${convertTo12HourFormat(schedule.from)} - ${convertTo12HourFormat(schedule.to)}`;
            classScheduleHTML += `
                <tr>
                    <td class="day-col">${getDayAbbreviation(schedule.day)}</td>
                    <td class="time-col">${timeString}</td>
                    <td class="subject-col">${schedule.subject}</td>
                    <td class="section-col">${schedule.section}</td>
                    <td class="room-col">${schedule.roomType}</td>
                </tr>`;
        });
        classScheduleHTML += '</tbody></table>';
    }

    let locationHTML;
    const hasLocation = professorDetails.location && professorDetails.location.Room && professorDetails.location.Building && professorDetails.location.Room !== 'Not Set';

    let locationTimeAgo = '';
    if (professorDetails.locationLastModified) {
        locationTimeAgo = ` <span class="location-time-ago">(${formatTimeAgo(professorDetails.locationLastModified)})</span>`;
    }

    if (hasLocation) {
        locationHTML = `
            <p>
                <span class="bold">${professorDetails.location.Room}</span>
                at 
                <span class="bold">${professorDetails.location.Building}</span>
                ${locationTimeAgo}
            </p>`;
    } else {
        locationHTML = `<p><span class="bold">Not Set</span>${locationTimeAgo}</p>`;
    }
    const profInfoContentsHTML = `
        <div class="info-section">
            <img src="${professorDetails.pImg}" id="info-section-display-pic">
            <p class="info-section-name">Prof. ${professorDetails.fullName}</p>
            <p class="status-container"><span id="info-section-status" class="status">${statusText}</span><span class="status-until">${statusUntilText}</span></p>

                        <!--CURRENT LOCATION-->
            <div class="x-div">
                <div class="icon-container">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
                ${locationHTML}
            </div>

            <!--DEPARTMENT-->
            <div class="x-div">
                <div class="icon-container">
                    <i class="fontawesome-icon fa-solid fa-school"></i>
                </div>
                <p>Department of 
                    <span class="bold">${professorDetails.department}</span>
                </p>
            </div>


            <!--CONSULTATION DETAILS-->
            <p class="bold cons-details-title">Consultation Details:</p>
            <div class="day-time-div">
                ${profDayTimeSetHTML}
            </div>

            <div>
                <p class="bold cons-details-title">Class Schedule:</p>
                <div class="class-sched-div">
                    ${classScheduleHTML}
                </div>
            </div>

            <!--EMAIL ADDRESS-->
            <p class="bold cons-details-title">Contact:</p>
            <div class="x-div">
                <div class="icon-container">
                    <i class="fontawesome-icon fa-solid fa-at"></i>
                </div>
                <p class="bold pointer">
                    ${professorDetails.email}
                </p>
            </div>
        </div>
    `;

    document.getElementById('js-generated-html-info-container').innerHTML = profInfoContentsHTML;
    
    changeInfoSectionStatusColor();
}

profCardGrid.addEventListener('click', async (event) => {
    const clickedElement = event.target;
    const parentDiv = clickedElement.closest('.prof-card');

    // If the click was not inside a professor card, do nothing.
    if (parentDiv) {
        // Scroll the main window to the top to ensure the info panel is visible
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const allCards = profCardGrid.querySelectorAll('.prof-card');
        allCards.forEach(card => {
            card.classList.remove('active');
        });

        parentDiv.classList.add('active');
        const profEmail = parentDiv.dataset.email;

        // FETCH DATA FROM SERVER
        let professorDetails;
        try {
            const professors = await getProfessors(); // Use the central data store
            professorDetails = professors.find(prof => prof.email === profEmail);
        } catch (error) {
            console.error('Failed to get professor details from data store:', error);
            return; // Stop if the fetch fails
        }

        if (!professorDetails) {
            console.error(`Could not find professor details for email: ${profEmail}`);
            return;
        }

        unhideInfoPage();
        generateProfInfoContents(professorDetails);

        // Also scroll the info panel itself to the top
        const infoPage = document.getElementById('info-page');
        if (infoPage) {
            infoPage.scrollTop = 0;
        }
    }
});

const closeButtonElement = document.getElementById('info-section-close-btn');
closeButtonElement.addEventListener('click', () => {
    document.getElementById('info-page').style.display = 'none';

    const activeCard = profCardGrid.querySelector('.prof-card.active');
    if (activeCard) {
        activeCard.classList.remove('active');
    }
});
