import { changeStatusBgColor } from './utils/color.js';

let currentStatusFilter = 'All';
let currentSearchQuery = '';

function applyFilters() {
    const allCards = document.querySelectorAll('.prof-card');

    allCards.forEach(card => {
        const nameElem = card.querySelector('.prof-name');
        const statusElem = card.querySelector('.status');

        const name = nameElem ? nameElem.innerText.replace('Prof. ', '').toLowerCase() : '';
        const status = statusElem ? statusElem.innerText : '';

        const nameMatch = name.includes(currentSearchQuery);
        const statusMatch = currentStatusFilter === 'All' || status === currentStatusFilter;

        // A card is visible only if it matches BOTH the name search AND the status filter.
        if (nameMatch && statusMatch) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- Event Listeners ---

// FILTER BUTTON
document.getElementById('filter-btn').addEventListener('click', () => {
    const showButtonElement = document.getElementById('filter-btn');
    currentStatusFilter = changeStatusBgColor(currentStatusFilter, showButtonElement);
    applyFilters();
});

// SEARCH BAR
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', function() {
    currentSearchQuery = searchBar.value.trim().toLowerCase();
    applyFilters();
});