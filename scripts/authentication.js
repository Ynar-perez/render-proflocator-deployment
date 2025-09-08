document.getElementById('js-link-to-signup').addEventListener('click', () => {
    document.getElementById('login-div').style.display = 'none';
    document.getElementById('signup-div').style.display = 'flex';
})

document.getElementById('js-link-to-login').addEventListener('click', () => {
    document.getElementById('signup-div').style.display = 'none';
    document.getElementById('login-div').style.display = 'flex';
})

