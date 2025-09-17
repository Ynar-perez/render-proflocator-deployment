// DISPLAY WHAT IS CLICKED TO THE CONSOLE

const whatIsThis = document.body;
whatIsThis.addEventListener('click', (event) => {
    console.log(event.target);
});

let usertype = 'professor';
let username = 'Jasper Garcia';

document.getElementById('user-name').innerText = username;
document.getElementById('user-type').innerText = usertype;

// SECTION FOR PROFESSOR

const typeOfAccount = document.getElementById('user-type');

if (typeOfAccount.innerText === 'PROFESSOR') {
    document.getElementById('prof-sec').style.display = 'flex';
    document.getElementById('student-section').style.paddingTop = '30px';
} else if (typeOfAccount.innerText === 'STUDENT') {
    document.getElementById('prof-sec').style.display = 'none';
}