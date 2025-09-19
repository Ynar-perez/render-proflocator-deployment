import { changeStatusBgColor } from './utils/color.js';
import {} from './utils/filter.js';

document.getElementById('filter-btn').addEventListener('click', toggleFilter)

function toggleFilter() {
    const showButtonElement = document.getElementById('filter-btn');
    const filter = showButtonElement.innerText;
    let currentStatus;

    const temp = changeStatusBgColor(filter, showButtonElement, currentStatus);
    currentStatus = temp;
    
    doFilter(currentStatus);
}

function doFilter(currentStatus) {
    const statuses = document.querySelectorAll('.status'); 
    const allCards = document.querySelectorAll('.prof-card');

    allCards.forEach(card => card.style.display = 'none');

    const hideAllCards = () => allCards.forEach(card => card.style.display = 'none');

    if (currentStatus === 'All') {
        allCards.forEach(card => card.style.display = 'flex')
    }   else if (currentStatus === 'Available') {
        hideAllCards();
        statuses.forEach(status => {
            if (status.innerText === 'Available') {
                const card = status.closest('.prof-card');
                if (card) card.style.display = 'flex';
            }
        })
    }   else if (currentStatus === 'In a Meeting') {
        hideAllCards();
        statuses.forEach(status => {
            if (status.innerText === 'In a Meeting') {
                const card = status.closest('.prof-card');
                if (card) card.style.display = 'flex';
            }
        })
    }   else if (currentStatus === 'In Class') {
        hideAllCards();
        statuses.forEach(status => {
            if (status.innerText === 'In Class') {
                const card = status.closest('.prof-card');
                if (card) card.style.display = 'flex';
            }
        })
    }   else if (currentStatus === 'Away') {
        hideAllCards();
        statuses.forEach(status => {
            if (status.innerText === 'Away') {
                const card = status.closest('.prof-card');
                if (card) card.style.display = 'flex';
            }
        })
    }   else if (currentStatus === 'Busy') {
        hideAllCards();
        statuses.forEach(status => {
            if (status.innerText === 'Busy') {
                const card = status.closest('.prof-card');
                if (card) card.style.display = 'flex';
            }
        })
    }   else if (currentStatus === 'Not Set') {
        hideAllCards();
        statuses.forEach(status => {
            if (status.innerText === 'Not Set') {
                const card = status.closest('.prof-card');
                if (card) card.style.display = 'flex';
            }
        })
    }

}

// SEARCH BAR FUNCTIONALITY
const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('input', function() {
    const query = searchBar.value.trim().toLowerCase();
    const profCards = document.querySelectorAll('.prof-card');
    profCards.forEach(card => {
        const nameElem = card.querySelector('.prof-name');
        if (nameElem) {
            const name = nameElem.innerText.replace('Prof. ', '').toLowerCase();
            if (name.includes(query)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });
});