const viewCounts = document.querySelectorAll("#viewCount");

viewCounts.forEach((viewCount) => {
  const count = Number(viewCount.innerText);
  viewCount.innerText = `${count} ${count === 1 ? "view" : "views"}`;
});
