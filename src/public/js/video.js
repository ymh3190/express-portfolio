const root = document.querySelector(".root");
const main = document.querySelector("main");
const videosContainer = document.querySelector(".videos-container");
const videoContainer = document.querySelector(".video-container");

if (videosContainer) {
  root.classList.remove("video-root");
  main.classList.remove("video");
} else if (videoContainer) {
  root.classList.remove("videos-root");
  main.classList.remove("videos");
}
