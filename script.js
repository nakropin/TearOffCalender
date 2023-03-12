const pages = document.querySelector('.pages');
const locale = window.navigator.language || 'en-us';

// let date = new Date();
// let dayNum = date.getDate();
// let month = date.getMonth();
// let dayName = date.toLocaleString(locale, { weekday: 'long' });
// let monthName = date.toLocaleString(locale, { month: 'long' });
// let year = date.getFullYear();

// function daysInMonth(month, year) {
//   return new Date(year, month + 1, 0).getDate();
// }

// function getNewDate() {
//   if (dayNum < daysInMonth(month, year)) {
//     dayNum++;
//   } else {
//     dayNum = 1;
//   }
//   if (dayNum === 1 && month < 11) {
//     month++;
//   } else if (dayNum === 1 && month === 11) {
//     month = 0;
//   }
//   if (dayNum === 1 && month === 0) {
//     year++;
//   }
//   const newDate = new Date(year, month, dayNum);
//   dayName = newDate.toLocaleString('en-us', { weekday: 'long' });
//   monthName = newDate.toLocaleString('en-us', { month: 'long' });
// }

function handleClick(e) {
  getNewDate();
  updateCalendar(e.target);
}

function updateCalendar(target) {
  if (target && target.classList.contains('page')) {
    target.classList.add('tear');
    setTimeout(() => {
      pages.removeChild(target);
    }, 800);
  } else {
    return;
  }
  renderPage();
}

function renderPage() {
  const newPage = document.createElement('div');
  newPage.classList.add('page');
  newPage.innerHTML = `
    <p class="month">${monthName}</p>
    <p class="day">${dayNum}</p>
    <p class="day-name">${dayName}</p>
    <p class="year">${year}</p>
  `;
  pages.appendChild(newPage);
}

renderPage();

pages.addEventListener('click', handleClick);