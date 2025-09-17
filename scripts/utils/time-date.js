export function updateLiveTime() {
  const now = new Date();
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[now.getDay()];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = months[now.getMonth()];

  const day = now.getDate();

  const year = now.getFullYear();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  const formattedTime = `${dayName} | ${monthName} ${day < 10 ? '0' + day : day}, ${year} ${hours}:${minutes}:${seconds} ${ampm}`;


  document.getElementById('live-time').textContent = formattedTime;
}

// GREETINGS

export function greetings() {
  const greetingSpan = document.getElementById('greeting');
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    greetingSpan.textContent = 'Good morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    greetingSpan.textContent = 'Good afternoon';
  } else {
    greetingSpan.textContent = 'Good evening';
  }
}

// 12-HOURS TIME FORMATTER

export function convertTo12HourFormat(time24) {
  const [hours, minutes] = time24.split(':');
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h === 0 ? 12 : h;
  return `${h}:${minutes} ${ampm}`;
}

