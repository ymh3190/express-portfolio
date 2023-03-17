const viewCounts = document.querySelectorAll("#viewCount");
const videoDOM = document.querySelector(".videos");

if (videoDOM) {
  viewCounts.forEach((viewCount) => {
    const count = Number(viewCount.innerText);
    viewCount.innerText = `${count === 1 ? "view" : "views"}: ${count}`;
  });
} else {
  viewCounts.forEach((viewCount) => {
    const count = Number(viewCount.innerText);
    viewCount.innerText = `${count} ${count === 1 ? "view" : "views"}`;
  });
}
