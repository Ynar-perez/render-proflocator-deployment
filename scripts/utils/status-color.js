export function setProfSectionStatusColor() {
    const statusElem = document.querySelector('.prof-status');
    if (!statusElem) return;
    const statusText = statusElem.innerText.trim();
    let colorVar = '--not-set';
    if (statusText === 'Available') colorVar = '--available';
    else if (statusText === 'In a Meeting') colorVar = '--in-a-meeting';
    else if (statusText === 'In Class') colorVar = '--in-class';
    else if (statusText === 'Away') colorVar = '--away';
    else if (statusText === 'Busy') colorVar = '--busy';
    else if (statusText === 'Not Set') colorVar = '--not-set';
    statusElem.style.color = `var(${colorVar})`;
}