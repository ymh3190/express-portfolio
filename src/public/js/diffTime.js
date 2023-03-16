const createdAts = document.querySelectorAll("#createdAt");

const currentTime = new Date().getTime();

createdAts.forEach((createdAt) => {
  const createdAtTime = new Date(createdAt.innerText).getTime();
  const seconds = Math.floor(new Date(currentTime - createdAtTime) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(weeks / 4);

  if (seconds < 60) {
    createdAt.innerText = `${seconds} ${
      seconds === 1 ? "second" : "seconds"
    } ago`;
  } else if (minutes < 60) {
    createdAt.innerText = `${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    } ago`;
  } else if (hours < 24) {
    createdAt.innerText = `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (days < 7) {
    createdAt.innerText = `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (weeks < 4) {
    createdAt.innerText = `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (months < 12) {
    createdAt.innerText = `${months} ${months === 1 ? "month" : "months"} ago`;
  }
});
