import moment from "moment-timezone";

const clientUtc = moment.tz.guess(); // Guess the utc of the client (e.g. "Europe/Brussels")

export const utcConvert = (date: Date) => {
  return moment.utc(date).tz(clientUtc);
};

export const calendarConvert = (date: Date) => {
  const date_cal = utcConvert(date).calendar();
  return date_cal.charAt(0).toUpperCase() + date_cal.slice(1); // Capitalize the first letter
};
