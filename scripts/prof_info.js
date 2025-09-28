import { changeInfoSectionStatusColor } from './utils/color.js';

// Get the grid containing professor cards
const profCardGrid = document.getElementById('prof-card-grid');

function unhideInfoPage() {
    // Show the info section
    const infoPage = document.getElementById('info-page');
    infoPage.style.display = 'flex';
}

profCardGrid.addEventListener('click', async (event) => {
    const clickedElement = event.target;
    if (
        clickedElement.classList.contains('prof-info-div') ||
        clickedElement.classList.contains('prof-card-img') ||
        clickedElement.classList.contains('prof-name') ||
        clickedElement.classList.contains('status')
    ) {
        const parentDiv = clickedElement.closest('.prof-card');
        // The professor's name is stored in a data attribute on the card
        const profName = parentDiv.querySelector('.prof-name').innerText.replace('Prof. ', '').trim();

        // --- NEW: Fetch data from the server ---
        let professorDetails;
        try {
            const response = await fetch('http://localhost:3000/api/professors');
            const professors = await response.json();
            professorDetails = professors.find(prof => prof.pName.trim() === profName);
        } catch (error) {
            console.error('Failed to fetch professor details:', error);
            return; // Stop if the fetch fails
        }

        unhideInfoPage();
        generateProfInfoContents();

        function generateProfInfoContents() {
            // Generate HTML for office hours
            let profDayTimeSetHTML = '';

            professorDetails.officeHours.forEach((set) => {
                profDayTimeSetHTML += `
                    <div class="day-time">
                        <p class="day">${set.day}:</p>
                        <p class="time">${set.from}</p>
                        <p class="to">-</p>
                        <p class="time-until">${set.to}</p>
                    </div>
                `;
            });

            // Generate full HTML for info section
            const profInfoContentsHTML = `
                <div class="info-section">
                    <img src="${professorDetails.pImg}" id="info-section-display-pic">
                    <p class="info-section-name">Prof. ${professorDetails.pName}</p>
                    <p id="info-section-status">${professorDetails.status}</p>
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

            // Insert generated HTML into info section
            document.getElementById('js-generated-html-info-container').innerHTML = profInfoContentsHTML;
            
            changeInfoSectionStatusColor();

            // Style profCards

            const profCards = document.querySelectorAll('.prof-card');
            profCards.forEach(card => {
                card.style.border = '4px solid transparent';
                card.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)';
            });

            parentDiv.style.boxShadow = '0px 0px 10px blue';

        }
    }
});

// Close button for info page
const closeButtonElement = document.getElementById('info-section-close-btn');
closeButtonElement.addEventListener('click', () => {
    document.getElementById('info-page').style.display = 'none';

    const profCards = document.querySelectorAll('.prof-card');
    profCards.forEach(card => {
        card.style.border = '4px solid transparent';
        card.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)';
    });
});
