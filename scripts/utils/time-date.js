export function updateLiveTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    const formattedTime = now.toLocaleString('en-US', options);
    const liveTimeElement = document.getElementById('live-time');
    if (liveTimeElement) {
        liveTimeElement.textContent = formattedTime;
    }
}

export function greetings() {
    const greetingElement = document.getElementById('greeting');
    const now = new Date();
    const hour = now.getHours();

    let greeting;
    if (hour < 12) {
        greeting = 'Good morning';
    } else if (hour < 18) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }

    if (greetingElement) {
        greetingElement.textContent = greeting;
    }
}

export function convertTo12HourFormat(time24) {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function getDayIndex(day) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.indexOf(day);
}

/**
 * Converts a time string (e.g., "7:00 AM" or "13:30") to total minutes since midnight.
 * @param {string} timeStr The time string to parse.
 * @returns {number} Total minutes since midnight.
 */
export function parseTime(timeStr) {
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier) {
        if (modifier.toUpperCase() === 'PM' && hours !== 12) hours += 12;
        if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
    }
    return hours * 60 + (minutes || 0);
}

/**
 * Sets up event listeners for a pair of "from" and "to" time dropdowns.
 * When a "from" time is selected, it disables earlier times in the "to" dropdown.
 * @param {HTMLElement} fromElement The 'from' time <select> element.
 * @param {HTMLElement} toElement The 'to' time <select> element.
 */
export function setupTimeDropdownLogic(fromElement, toElement) {
    if (!fromElement || !toElement) return;

    fromElement.addEventListener('change', () => {
        const fromTimeValue = fromElement.value;

        if (!fromTimeValue) {
            for (const option of toElement.options) {
                option.disabled = false;
            }
            return;
        }

        let shouldResetToTime = false;

        for (const option of toElement.options) {
            if (!option.value) continue;
            option.disabled = option.value <= fromTimeValue;
            if (option.selected && option.disabled) {
                shouldResetToTime = true;
            }
        }

        if (shouldResetToTime) {
            toElement.value = '';
        }
    });
}

/**
 * Formats a timestamp into a human-readable "time ago" string.
 * @param {string|Date} timestamp - The timestamp to format.
 * @returns {string} The formatted string (e.g., "5 mins ago", "2 hours ago", "just now").
 */
export function formatTimeAgo(timestamp) {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000; // years
    if (interval > 1) {
        return Math.floor(interval) + ' year' + (Math.floor(interval) === 1 ? '' : 's') + ' ago';
    }
    interval = seconds / 2592000; // months
    if (interval > 1) {
        return Math.floor(interval) + ' month' + (Math.floor(interval) === 1 ? '' : 's') + ' ago';
    }
    interval = seconds / 86400; // days
    if (interval > 1) {
        return Math.floor(interval) + ' day' + (Math.floor(interval) === 1 ? '' : 's') + ' ago';
    }
    interval = seconds / 3600; // hours
    if (interval > 1) {
        return Math.floor(interval) + ' hour' + (Math.floor(interval) === 1 ? '' : 's') + ' ago';
    }
    interval = seconds / 60; // minutes
    if (interval > 1) {
        return Math.floor(interval) + ' min' + (Math.floor(interval) === 1 ? '' : 's') + ' ago';
    }
    return 'just now';
}