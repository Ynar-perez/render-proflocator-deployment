import {profData} from '../data/prof.js';

// IDENTIFIES WHICH CARD WAS CLICKED
const profCardGrid = document.getElementById('prof-card-grid');

function unhideInfoPage() {
    // DISPLAYS/UNHIDES THE INFO SECTION
    const infoPage = document.getElementById('info-page');
    infoPage.style.display = 'flex';
}

profCardGrid.addEventListener('click', (event) => {
    const clickedElement = event.target;
    if (
        clickedElement.classList.contains('prof-info-div') || 
        clickedElement.classList.contains('prof-card-img') ||
        clickedElement.classList.contains('prof-name') ||
        clickedElement.classList.contains('status')
    ) {
        unhideInfoPage();

        //IDENTIFIES WHOSE CARD WAS CLICKED
        const parentDiv = clickedElement.closest('.prof-card');
        const profName = parentDiv.querySelector('.prof-name').innerText.replace('Prof. ', '').trim();

        // HOLDS PROFESSOR'S DETAILS FROM THE DATA ARRAY
        const professorDetails = profData.find(prof => prof.pName.trim() === profName); 

        let profDayTimeSetHTML = '';

        professorDetails.officeHours.forEach((set) => {
            const singleDayTime = `
                <div class="day-time">
                    <p class="day">${set.day}:</p>
                    <p class="time">${set.from}</p>
                    <p class="to">-</p>
                    <p class="time-until">${set.to}</p>
                </div>
            `;
            profDayTimeSetHTML += singleDayTime;
        });

        // GENERATE HTML
        const profInfoContentsHTML = `
        <div class="info-section">
            <img src="${professorDetails.pImg}" class="info-section-display-pic">

            <p class="info-section-name">Prof. ${professorDetails.pName}</p>

            <p class="info-section-status">${professorDetails.status}</p>

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
                    <i class="fontawesome-icon fa-solid fa-map-pin"></i>
                </div>
                <p>
                    <span class="bold">Faculty Room</span>
                        at 
                    <span class="bold">Rizal Building</span>
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

        // GENERATES PROF INFO HTML TO INFO SECTION
        document.getElementById('js-generated-html-info-container').innerHTML = profInfoContentsHTML;
    }
});

// CLOSE BUTTON FOR INFO PAGE
const closeButtonElement = document.getElementById('info-section-close-btn');
closeButtonElement.addEventListener('click', () => document.getElementById('info-page').style.display = 'none');







