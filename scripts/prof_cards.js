import { changeStatusTextColor } from './utils/color.js';
import { getProfessors, refreshProfessors } from './data-store.js';
import { refreshProfSection } from './prof_section.js';
import { convertTo12HourFormat } from './utils/time-date.js';

export async function generateProfCards(forceRefresh = false) { 
    const profData = forceRefresh ? await refreshProfessors() : await getProfessors();
    if (profData.length === 0) {
        document.getElementById('prof-card-grid').innerHTML = '<p class="error-message">Could not load professor data. Please try again later.</p>';
        return;
    }

    const statusOrder = {
        'Available': 1,
        'In a Meeting': 2,
        'In Class': 3,
        'Busy': 4,
        'Away': 5,
        'Not Set': 6
    };

    const sortedProfData = profData.slice().sort((a, b) => {
        const statusA = a.status || 'Not Set';
        const statusB = b.status || 'Not Set';

        return (statusOrder[statusA] || 99) - (statusOrder[statusB] || 99);
    });

    const cardsHtml = sortedProfData.map((prof) => {
        const statusText = prof.status || 'Not Set';
        const statusUntilText = prof.statusUntil ? ` (until ${convertTo12HourFormat(prof.statusUntil)})` : '';

        return `
        <div class="prof-card" data-email="${prof.email}">
            <img class="prof-card-img" src="${prof.pImg}" alt="" width="100%">
            <div class="prof-info-div">
                <div class="prof-card-details">
                    <p class="prof-name">Prof. ${prof.fullName}</p>
                    <p class="status-container"><span class="status">${statusText}</span><span class="status-until">${statusUntilText}</span></p>
                </div>
            </div>
        </div>
    `}).join('');

    document.getElementById('prof-card-grid').innerHTML = cardsHtml;
    changeStatusTextColor();
}

// --- INITIAL LOAD & POLLING ---

// 1. Initial load of the professor cards
await generateProfCards();

// 2. Set up a poller to refresh the cards every 10 seconds
setInterval(async () => {
    console.log('🔄 Refreshing professor data...');
    await generateProfCards(true); // Force a refresh of the data store and re-render cards
    await refreshProfSection(); // Re-render the professor's private section
}, 10000); // 10000 milliseconds = 10 seconds