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
        }
    }
}

export function changeStatusBgColor(filter, showButtonElement, currentStatus) {
    if (filter === 'All') {
        showButtonElement.innerText = 'Available';
        showButtonElement.style.backgroundColor = 'var(--available)';
        return currentStatus = 'Available';
    } else if (filter === 'Available') {
        showButtonElement.innerText = 'In a Meeting';
        showButtonElement.style.backgroundColor = 'var(--in-a-meeting)';
        return currentStatus = 'In a Meeting';
    } else if (filter === 'In a Meeting') {
        showButtonElement.innerText = 'In Class';
        showButtonElement.style.backgroundColor = 'var(--in-class)';
        return currentStatus = 'In Class';
    } else if (filter === 'In Class') {
        showButtonElement.innerText = 'Away';
        showButtonElement.style.backgroundColor = 'var(--away)';
        return currentStatus = 'Away';
    } else if (filter === 'Away') {
        showButtonElement.innerText = 'Busy';
        showButtonElement.style.backgroundColor = 'var(--busy)';
        return currentStatus = 'Busy';
    } else if (filter === 'Busy') {
        showButtonElement.innerText = 'Not Set';
        showButtonElement.style.backgroundColor = 'var(--not-set)';
        return currentStatus = 'Not Set';
    } else if (filter === 'Not Set') {
        showButtonElement.innerText = 'All';
        showButtonElement.style.backgroundColor = 'var(--webColor1)';
        return currentStatus = 'All';
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
}