const homePage = document.getElementById('home-page');
const profPage = document.getElementById('prof-page');
const appointmentPage = document.getElementById('appointment-page');

homePage.style.display = 'none';
profPage.style.display = 'none';
appointmentPage.style.display = 'none';

document.getElementById('nav-home').addEventListener('click', () => {
    homePage.style.display = 'flex';
    profPage.style.display = 'none';
    appointmentPage.style.display = 'none';
})

document.getElementById('nav-profSec').addEventListener('click', () => {
    homePage.style.display = 'none';
    profPage.style.display = 'flex';
    appointmentPage.style.display = 'none';
})

document.getElementById('nav-appointment').addEventListener('click', () => {
    homePage.style.display = 'none';
    profPage.style.display = 'none';
    appointmentPage.style.display = 'flex';
})