export function convertTime(time = 0) {
  let seconds = parseInt((time / 1000) % 60),
    minutes = parseInt((time / (1000 * 60)) % 60),
    hours = parseInt((time / (1000 * 60 * 60)) % 24);

  hours = hours > 0 ? `${(hours < 10) ? `0${hours}` : hours}:` : '';
  minutes = (minutes < 10) ? `0${minutes}` : minutes;
  seconds = (seconds < 10) ? `0${seconds}` : seconds;

  return `${hours}${minutes}:${seconds}`;
}
