// IDENTIFIES WHICH IS WHICH
const profCardGrid = document.getElementById('prof-card-grid');

profCardGrid.addEventListener('click', (event) => {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('view-more-btn')) {
        const infoPopup = document.getElementById('info-page');
        infoPopup.style.display = 'flex';

        const parentDiv = clickedElement.closest('.prof-card');

        const profName = parentDiv.querySelector('.prof-name').innerText.replace('Prof. ', '').trim();

        console.log(`Prof. ${profName}`);

        const professorDetails = profCard.find(prof => prof.pName.trim() === profName); //HOLDS PROFESSOR'S DETAILS
        console.log(professorDetails);
    }
});

// EXIT BUTTON OF INFO PAGE
const closeButtonElement = document.getElementById('info-section-close-btn');
closeButtonElement.addEventListener('click', () => {
    document.getElementById('info-page').style.display = 'none';
})



