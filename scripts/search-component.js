import { changeStatusBgColor } from './utils/color.js';

// --- State Management ---
// We store the current state of our filters here.
let currentStatusFilter = 'All';
let currentSearchQuery = '';

// --- Main Filtering Logic ---
// This single function applies both filters at once.
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

// Filter Button
document.getElementById('filter-btn').addEventListener('click', () => {
    const showButtonElement = document.getElementById('filter-btn');
    // Update the global status filter state and then apply all filters.
    currentStatusFilter = changeStatusBgColor(currentStatusFilter, showButtonElement);
    applyFilters();
});

// Search Bar
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', function() {
    // Update the global search query state and then apply all filters.
    currentSearchQuery = searchBar.value.trim().toLowerCase();
    applyFilters();
});