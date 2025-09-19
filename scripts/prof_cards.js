import {profData} from '../data/prof.js';
import { changeStatusTextColor } from './utils/color.js';

// GENERATE HTML PROFCARD USING ARRAY profCard[]

function generateProfCards() {
    document.getElementById('prof-card-grid').innerHTML = null; // Clear existing cards

    profData.forEach((prof) => {
        const html = `
        <div class="prof-card">
        <img class="prof-card-img" src="${prof.pImg}" alt="" width="100%">
        <div class="prof-info-div">
            <p class="prof-name">Prof. ${prof.pName}</p>
            <p class="status">${prof.status}</p>
        </div>
        </div>
        `;
        const placeProfCard = document.getElementById('prof-card-grid');
        placeProfCard.innerHTML += html;
    });
}

generateProfCards();

changeStatusTextColor();