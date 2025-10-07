import { changeInfoSectionStatusColor } from './utils/color.js';
import { getProfessors } from './data-store.js';
import { sortOfficeHours } from './prof_section.js';

const profCardGrid = document.getElementById('prof-card-grid');

function unhideInfoPage() {
    const infoPage = document.getElementById('info-page');
    infoPage.style.display = 'flex';
}

function generateProfInfoContents(professorDetails) {
    let profDayTimeSetHTML = '';

    const sortedOfficeHours = sortOfficeHours(professorDetails.officeHours || []);

    if (sortedOfficeHours.length === 0) {
        profDayTimeSetHTML = '<p class="empty-office-hours">No office hours set.</p>';
    } else {
        sortedOfficeHours.forEach((set) => {
            profDayTimeSetHTML += `
                <div class="day-time">
                    <p class="day">${set.day}:</p>
                    <p class="time">${set.from}</p>
                    <p class="to">-</p>
                    <p class="time-until">${set.to}</p>
                </div>
            `;
        });
    }

    const profInfoContentsHTML = `
        <div class="info-section">
            <img src="${professorDetails.pImg}" id="info-section-display-pic">
            <p class="info-section-name">Prof. ${professorDetails.fullName}</p>
            <p id="info-section-status" class="status">${professorDetails.status || 'Not Set'}</p>
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
            <!--OFFICE LOCATION-->
            <div class="x-div">
                <div class="icon-container">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
                <p>
                    <span class="bold">${professorDetails.location?.Room || 'Not Set'}</span>
                    at 
                    <span class="bold">${professorDetails.location?.Building || ''}</span>
                </p>
            </div>
            <!--EMAIL ADDRESS-->
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
