import { changeStatusTextColor } from './utils/color.js';

async function generateProfCards() {
    let profData;
    try {
        const response = await fetch('http://localhost:3000/api/professors');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        profData = await response.json();
    } catch (error) {
        console.error("Could not fetch professors:", error);
        // Optionally, display an error message to the user in the UI
        document.getElementById('prof-card-grid').innerHTML = '<p class="error-message">Could not load professor data. Please try again later.</p>';
        return;
    }

    // More efficient way to build and inject HTML
    const cardsHtml = profData.map((prof) => `
        <div class="prof-card">
            <img class="prof-card-img" src="${prof.pImg}" alt="" width="100%">
            <div class="prof-info-div">
                <p class="prof-name">Prof. ${prof.pName}</p>
                <p class="status">${prof.status || 'Not Set'}</p>
            </div>
        </div>
    `).join('');

    document.getElementById('prof-card-grid').innerHTML = cardsHtml;
    changeStatusTextColor();
}

generateProfCards();