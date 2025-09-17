import {profData} from '../data/prof.js';

// GENERATE HTML PROFCARD USING ARRAY profCard[]

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

changeStatusTextColor();

function changeStatusTextColor() {
    const statuses = document.getElementsByClassName('status');

    for (const status of statuses){
        if (status.innerText.trim() === 'Available') {
        status.style.color = 'var(--available)';
        } else if (status.innerText.trim() === 'In a Meeting') {
        status.style.color = 'var(--in-a-meeting)';
        } else if (status.innerText.trim() === 'In Class') {
        status.style.color = 'var(--in-class)';
        } else if (status.innerText.trim() === 'Away') {
        status.style.color = 'var(--away)';
        } else if (status.innerText.trim() === 'Busy') {
        status.style.color = 'var(--busy)';
        } else if (status.innerText.trim() === 'Not Set') {
        status.style.color = 'var(--not-set)';
        }
    }
}