// DISPLAY SIGNUP/LOGIN FORMS
document.getElementById('js-link-to-signup').addEventListener('click', displaySignup);
document.getElementById('js-link-to-login').addEventListener('click', displayLogin);

function displaySignup() {
    document.getElementById('login-div').style.display = 'none';
    document.getElementById('signup-div').style.display = 'flex';
}
function displayLogin() {
    document.getElementById('signup-div').style.display = 'none';
    document.getElementById('login-div').style.display = 'flex';
}

//