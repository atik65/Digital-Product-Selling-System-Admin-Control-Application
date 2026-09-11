import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

// Add the required plugins
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// Customize the relative time messages
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'Just now',
    m: '1 min',
    mm: '%d mins',
    h: '1 hr',
    hh: '%d hrs',
    d: 'Yesterday',
    dd: '%d days',
    M: '1 month',
    MM: '%d months',
    y: '1 year',
    yy: '%d years'
  }
});

function getStyleTime(date) {
  const now = dayjs();
  const timeDate = dayjs(date);
  
  // Special case for "Just now" - if less than a minute ago
  if (now.diff(timeDate, 'seconds') < 60) {
    return 'Just now';
  }
  
  // Special case for Yesterday
  if (now.diff(timeDate, 'days') === 1) {
    return 'Yesterday';
  }
  
  // If it's more than a week ago, show the actual date
  if (now.diff(timeDate, 'days') >= 7) {
    // For current year, show Month Day (e.g., "March 15")
    if (now.year() === timeDate.year()) {
      return timeDate.format('MMMM D');
    }
    // For previous years, show Month Day, Year (e.g., "March 15, 2023")
    return timeDate.format('MMMM D, YYYY');
  }
  
  // Otherwise show relative time
  return timeDate.fromNow();
}

export default getStyleTime;
