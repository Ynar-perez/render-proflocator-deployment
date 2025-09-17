import { profData } from "../data/prof.js";
import { greetings, convertTo12HourFormat } from "./utils/time-date.js"

greetings();

// VAR FOR USER
let user = '';

profData.forEach((prof) => {
    if (prof.pName === document.getElementById('user-name').innerText) {
        user = prof;
    }
});

document.getElementById('prof-user-name').innerHTML = user.pName;

function renderOfficeHours() {
    let profDayTimeSetHTML = '';
    
    user.officeHours.forEach((set) => {
        const singleDayTime = `
            <div class="day-time-container">
                <p class="day">${set.day}:</p>
                <p class="from-time">${set.from}</p>
                <p class="hyphen">-</p>
                <p class="to-time">${set.to}</p>
            </div>
        `;
        profDayTimeSetHTML += singleDayTime;
    })
    document.getElementById('prof-sec-office-hours-container').innerHTML = profDayTimeSetHTML;
}

// RENDER OFFICE HOURS

renderOfficeHours();
renderEditingPageOfficeHours();

// EDIT AVAILABILITY


function renderEditingPageOfficeHours() {
    let profDayTimeSetHTML = '';

    user.officeHours.forEach((set) => {
        const html = `
        <div class="prof-sec-edit-office-hour">
        <p>${set.day}</p>
        <p>${set.from}</p>
        <p>-</p>
        <p>${set.to}</p>
        <p class="office-hour-delete-text js-office-hour-delete-text">Delete</p>
        </div>
        `;
        
        profDayTimeSetHTML += html;
    })

    document.getElementById('prof-sec-edit-office-hours').innerHTML = profDayTimeSetHTML;
}


// ADD OFFICE HOUR WHEN CLICK

document.getElementById('js-office-hour-add-text').addEventListener('click', () => {
    const daySelected = document.getElementById('add-office-hour-day');
    const timeFromSelected = document.getElementById('add-office-hour-from-time');
    const timeToSelected = document.getElementById('add-office-hour-to-time');

    if (daySelected.value === '' || timeFromSelected.value === '' || timeToSelected.value === '') {
    alert('Please fill out all fields before adding.');
    return;
    }

    user.officeHours.push({
        day: daySelected.value,
        from: convertTo12HourFormat(timeFromSelected.value),
        to: convertTo12HourFormat(timeToSelected.value)
    });

    daySelected.value = '';
    timeFromSelected.value = '';
    timeToSelected.value = '';

    renderEditingPageOfficeHours();
});

function updateChanges() {
    renderOfficeHours();
    document.getElementById('prof-sec-edit').style.display = 'none';
}

document.getElementById('update-btn').addEventListener('click', updateChanges)
