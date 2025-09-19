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
