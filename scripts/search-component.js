document.getElementById('filter-btn').addEventListener('click', toggleFilter)

/*
    STATUS

    Available
    In a Meeting
    In Class
    Away
    Busy
    Not Set
*/

function toggleFilter() {
    const showButtonElement = document.getElementById('filter-btn');
    const filter = showButtonElement.innerText;
    let currentStatus;
    if (filter === 'All') {
        showButtonElement.innerText = 'Available';
        showButtonElement.style.backgroundColor = 'var(--available)';
        currentStatus = 'Available';
    } else if (filter === 'Available') {
        showButtonElement.innerText = 'In a Meeting';
        showButtonElement.style.backgroundColor = 'var(--in-a-meeting)';
        currentStatus = 'In a Meeting';
    } else if (filter === 'In a Meeting') {
        showButtonElement.innerText = 'In Class';
        showButtonElement.style.backgroundColor = 'var(--in-class)';
        currentStatus = 'In Class';
    } else if (filter === 'In Class') {
        showButtonElement.innerText = 'Away';
        showButtonElement.style.backgroundColor = 'var(--away)';
        currentStatus = 'Away';
    } else if (filter === 'Away') {
        showButtonElement.innerText = 'Busy';
        showButtonElement.style.backgroundColor = 'var(--busy)';
        currentStatus = 'Busy';
    } else if (filter === 'Busy') {
        showButtonElement.innerText = 'Not Set';
        showButtonElement.style.backgroundColor = 'var(--not-set)';
        currentStatus = 'Not Set';
    } else if (filter === 'Not Set') {
        showButtonElement.innerText = 'All';
        showButtonElement.style.backgroundColor = 'var(--webColor1)';
        currentStatus = 'All';
    }
        // EXTERNAL FUNCTION FOR FILTER
    const doFilter = (currentStatus) => {
            const statuses = document.getElementsByClassName('status');

    if (currentStatus === 'Available') {
        for (const status of statuses) {
            if (status.innerText !== 'Available') {
                const notAvailableCard = status.closest('.prof-card');
                notAvailableCard.style.display = 'none'
            }
        }
    } else if (currentStatus === 'In a Meeting') {
        for (const status of statuses) {
            if (status.innerText === 'In a Meeting') {
                status.closest('.prof-card').style.display = 'flex';
            } else if (status.innerText !== 'In a Meeting') {
                const notAvailableCard = status.closest('.prof-card');
                notAvailableCard.style.display = 'none'
            }
        }
    } else if (currentStatus === 'In Class') {
        for (const status of statuses) {
            if (status.innerText === 'In Class') {
                status.closest('.prof-card').style.display = 'flex';
            } else if (status.innerText !== 'In Class') {
                const notAvailableCard = status.closest('.prof-card');
                notAvailableCard.style.display = 'none'
            }
        }
    } else if (currentStatus === 'Away') {
        for (const status of statuses) {
            if (status.innerText === 'Away') {
                status.closest('.prof-card').style.display = 'flex';
            } else if (status.innerText !== 'Away') {
                const notAvailableCard = status.closest('.prof-card');
                notAvailableCard.style.display = 'none'
            }
        }
    } else if (currentStatus === 'Busy') {
        for (const status of statuses) {
            if (status.innerText === 'Busy') {
                status.closest('.prof-card').style.display = 'flex';
            } else if (status.innerText !== 'Busy') {
                const notAvailableCard = status.closest('.prof-card');
                notAvailableCard.style.display = 'none'
            }
        }
    } else if (currentStatus === 'Not Set') {
        for (const status of statuses) {
            if (status.innerText === 'Not Set') {
                status.closest('.prof-card').style.display = 'flex';
            } else if (status.innerText !== 'Not Set') {
                const notAvailableCard = status.closest('.prof-card');
                notAvailableCard.style.display = 'none'
            }
        }
    } else if (currentStatus === 'All') {
        for (const status of statuses) {
            status.closest('.prof-card').style.display = 'flex';
        }
    }
    }
    
    doFilter(currentStatus);
}