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


// TEMPORARY ACCOUNT
const tempEmail = document.getElementById('js-email-input');
const tempPass = document.getElementById('js-password-input');

document.getElementById('js-login-btn').addEventListener('click', () => {
    const email = tempEmail.value;
    const pass = tempPass.value;

    if (email === 'npfeliciano@ccc.edu.ph' && pass === 'charlie') {
        window.location.href = '/proflocator.html';
    } else {
        alert("Mali")
    }
})