import {profData} from '../data/prof.js';
import { changeStatusTextColor } from './utils/color.js';

// GENERATE HTML PROFCARD USING ARRAY profCard[]

function generateProfCards() {
    profData.map((prof) => {
        updateAllProfessorsStatus(profData);
        const html = `
            <div class="prof-card">
            <img class="prof-card-img" src="${prof.pImg}" alt="" width="100%">
            <div class="prof-info-div">
                <p class="prof-name">Prof. ${prof.pName}</p>
                <p class="status">${prof.status || 'Not Set'}</p>
            </div>
            </div>
        `;
        const placeProfCard = document.getElementById('prof-card-grid');
        placeProfCard.innerHTML += html;
    });
}

function updateAllProfessorsStatus(profData) {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentDay = currentTime.getDay();
    const currentMinutes = currentTime.getMinutes();
;
}


generateProfCards();

changeStatusTextColor();