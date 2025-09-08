// GENERATE HTML PROFCARD USING ARRAY profCard[]

profCard.forEach((prof) => {
    const html = `
        <div class="prof-card">
            <img src="${prof.pImg}" alt="" width="100%">
            <div class="prof-info-div">
                <p class="prof-name">Prof. ${prof.pName}</p>
                <p class="department">${prof.department}</p>
                <p class="status">${prof.status}</p>
                <button class="view-more-btn">View Profile</button>
            </div>
        </div>
    `;
    const placeProfCard = document.getElementById('prof-card-grid');
    placeProfCard.innerHTML += html;
});

// STATUS COLOR CHANGER (should place below GENERATE HTML PROFCARD)

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

/*
    STATUS

    Available var(--available)
    In a Meeting var(--in-a-meeting)
    In Class var(--in-class)
    Away var(--away)
    Busy var(--busy)
    Not Set var(--not-set)
*/


// DISPLAY WHAT IS CLICKED TO THE CONSOLE
/*
const whatIsThis = document.body;
whatIsThis.addEventListener('click', (event) => {
    console.log(event.target);
});
*/




