const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** `Sun 11 Oct` */
export function shortDate(date: Date) {
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

/** `Oct 7` */
export function monthDay(value: Date | string) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

/** `12:26` (24-hour clock, as in the journal designs). */
export function clockTime(value: Date | string) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
