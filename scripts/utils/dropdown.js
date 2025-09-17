export function showDropdown(isDisplaying) {
    const drowpdownMenu = document.getElementById('dropdown-menu');

    if (isDisplaying === false) {
        drowpdownMenu.style.display = 'flex';
        isDisplaying = true;
    } else {
        drowpdownMenu.style.display = 'none';
        isDisplaying = false;
    }
} 

