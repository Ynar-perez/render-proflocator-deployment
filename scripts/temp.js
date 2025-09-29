// DISPLAY WHAT IS CLICKED TO THE CONSOLE

const whatIsThis = document.body;
whatIsThis.addEventListener('click', (event) => {
    console.log(event.target);
});



