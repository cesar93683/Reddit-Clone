const timeSince = (currentDate: number, date: number) => {
  const seconds = Math.floor((currentDate - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    interval = Math.floor(interval);
    return interval + " year" + (interval === 1 ? "" : "s") + " ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    interval = Math.floor(interval);
    return interval + " month" + (interval === 1 ? "" : "s") + " ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    interval = Math.floor(interval);
    return interval + " day" + (interval === 1 ? "" : "s") + " ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    interval = Math.floor(interval);
    return interval + " hour" + (interval === 1 ? "" : "s") + " ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    interval = Math.floor(interval);
    return interval + " minute" + (interval === 1 ? "" : "s") + " ago";
  }
  return seconds + " second" + (seconds === 1 ? "" : "s") + " ago";
};

export default timeSince;
