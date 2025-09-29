import { changeStatusTextColor } from './utils/color.js';
import { getProfessors } from './data-store.js';

async function generateProfCards() {
    const profData = await getProfessors();
    if (profData.length === 0) {
        document.getElementById('prof-card-grid').innerHTML = '<p class="error-message">Could not load professor data. Please try again later.</p>';
        return;
    }

    // More efficient way to build and inject HTML
    const cardsHtml = profData.map((prof) => `
        <div class="prof-card" data-email="${prof.email}">
        <img class="prof-card-img" src="${prof.pImg}" alt="" width="100%">
            <div class="prof-info-div">
                <div class="prof-card-details">
                    <p class="prof-name">Prof. ${prof.fullName}</p>
                    <p class="status">${prof.status || 'Not Set'}</p>
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('prof-card-grid').innerHTML = cardsHtml;
    changeStatusTextColor();
}

generateProfCards();