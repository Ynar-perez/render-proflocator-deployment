document.getElementById('js-link-to-signup').addEventListener('click', () => {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('signup-page').style.display = 'block';
})

document.getElementById('js-link-to-login').addEventListener('click', () => {
    document.getElementById('signup-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
})