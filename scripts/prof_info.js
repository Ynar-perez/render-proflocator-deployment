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
    const parentDiv = clickedElement.closest('.prof-card');

    // If the click was not inside a professor card, do nothing.
    if (parentDiv) {
        // Use the unique email from the data attribute for a reliable lookup
        const profEmail = parentDiv.dataset.email;

        // --- Fetch data from the server ---
        let professorDetails;
        try {
            const response = await fetch('http://localhost:3000/api/professors');
            const professors = await response.json();
            professorDetails = professors.find(prof => prof.email === profEmail);
        } catch (error) {
            console.error('Failed to fetch professor details:', error);
            return; // Stop if the fetch fails
        }

        // If no professor was found (which shouldn't happen now), stop execution.
        if (!professorDetails) {
            console.error(`Could not find professor details for email: ${profEmail}`);
            return;
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
                    <p class="info-section-name">Prof. ${professorDetails.fullName}</p>
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
        }
    }
});

// Close button for info page
const closeButtonElement = document.getElementById('info-section-close-btn');
closeButtonElement.addEventListener('click', () => {
    document.getElementById('info-page').style.display = 'none';
});
