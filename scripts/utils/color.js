export function changeStatusTextColor() {
    const statuses = document.getElementsByClassName('status');

    for (const status of statuses){
        if (status.innerText.trim() === 'Available') {
        status.style.color = 'var(--available)';
        } else if (status.innerText.trim() === 'In a Meeting') {
        status.style.color = 'var(--in-a-meeting)';
        } else if (status.innerText.trim() === 'In Class') {
        status.style.color = 'var(--in-class)';
        } else if (status.innerText.trim() === 'Away') {
        status.style.color = 'var(--away)';
        } else if (status.innerText.trim() === 'Busy') {
        status.style.color = 'var(--busy)';
        } else if (status.innerText.trim() === 'Not Set') {
        status.style.color = 'var(--not-set)';
        } else if (status.innerText.trim() === 'Off Duty') {
        status.style.color = 'var(--off-duty)';
        }
    }
}

export function changeStatusBgColor(currentStatus, showButtonElement) {
    if (currentStatus === 'All') {
        showButtonElement.innerText = 'Available';
        showButtonElement.style.backgroundColor = 'var(--available)';
        return 'Available';
    } else if (currentStatus === 'Available') {
        showButtonElement.innerText = 'In a Meeting';
        showButtonElement.style.backgroundColor = 'var(--in-a-meeting)';
        return 'In a Meeting';
    } else if (currentStatus === 'In a Meeting') {
        showButtonElement.innerText = 'In Class';
        showButtonElement.style.backgroundColor = 'var(--in-class)';
        return 'In Class';
    } else if (currentStatus === 'In Class') {
        showButtonElement.innerText = 'Away';
        showButtonElement.style.backgroundColor = 'var(--away)';
        return 'Away';
    } else if (currentStatus === 'Away') {
        showButtonElement.innerText = 'Busy';
        showButtonElement.style.backgroundColor = 'var(--busy)';
        return 'Busy';
    } else if (currentStatus === 'Busy') {
        showButtonElement.innerText = 'Not Set';
        showButtonElement.style.backgroundColor = 'var(--not-set)';
        return 'Not Set';
    } else if (currentStatus === 'Not Set') {
        showButtonElement.innerText = 'All';
        showButtonElement.style.backgroundColor = 'var(--webColor1)';
        return 'All';
    }
}

export function changeInfoSectionStatusColor() {
    const status = document.getElementById('info-section-status');
    const profImgElement = document.getElementById('info-section-display-pic');
        if (status.innerText === 'Available') {
            status.style.color = 'var(--available)';
            profImgElement.style.border = '6px solid var(--available)';
            profImgElement.style.padding = '6px';
        }
        else if (status.innerText === 'In a Meeting') {
            status.style.color = 'var(--in-a-meeting)';
            profImgElement.style.border = '6px solid var(--in-a-meeting)';
            profImgElement.style.padding = '6px';
        }
        else if (status.innerText === 'In Class') {
            status.style.color = 'var(--in-class)';
            profImgElement.style.border = '6px solid var(--in-class)';
            profImgElement.style.padding = '6px';
        }
        else if (status.innerText === 'Away') {
            status.style.color = 'var(--away)';
            profImgElement.style.border = '6px solid var(--away)';
            profImgElement.style.padding = '6px';
        }
        else if (status.innerText === 'Busy') {
            status.style.color = 'var(--busy)';
            profImgElement.style.border = '6px solid var(--busy)';
            profImgElement.style.padding = '6px';
        }
        else if (status.innerText === 'Not Set') {
            status.style.color = 'var(--not-set)';
        }
        else if (status.innerText === 'Off Duty') {
            status.style.color = 'var(--off-duty)';
        }
}