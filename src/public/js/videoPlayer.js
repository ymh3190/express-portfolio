const playIcon = document.getElementById("play");
const volumeIcon = document.getElementById("volume");
const videoElem = document.getElementById("video");
const volumeRangeInput = document.getElementById("volumeRange");
const currentTimeSpan = document.getElementById("currentTime");
const entireTimeSpan = document.getElementById("entireTime");
const expandIcon = document.getElementById("expand");
const videoPlayerDOM = document.getElementById("videoPlayer");
const videoPlayerInteractiveDOM = document.getElementById(
  "videoPlayerInteractive"
);

playIcon.addEventListener("click", () => {
  if (videoElem.paused) {
    videoElem.play();
    playIcon.classList.remove("fa-play");
    playIcon.classList.add("fa-pause");
  } else {
    videoElem.pause();
    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");
  }
});

volumeIcon.addEventListener("click", () => {
  if (!videoElem.muted) {
    videoElem.muted = true;
    volumeIcon.classList.add("fa-volume-xmark");
  } else {
    videoElem.muted = false;
    volumeIcon.classList.remove("fa-volume-xmark");
  }
});

volumeRangeInput.addEventListener("input", (e) => {
  videoElem.volume = e.target.value / 100;

  if (videoElem.volume >= 0.6) {
    volumeIcon.classList.remove("fa-volume-off", "fa-volume-low");
    volumeIcon.classList.add("fa-volume-high");
  } else if (videoElem.volume >= 0.3 && videoElem.volume < 0.6) {
    volumeIcon.classList.remove("fa-volume-high", "fa-volume-off");
    volumeIcon.classList.add("fa-volume-low");
  } else {
    volumeIcon.classList.remove("fa-volume-high", "fa-volume-low");
    volumeIcon.classList.add("fa-volume-off");
  }
});

videoElem.addEventListener("loadedmetadata", (e) => {
  currentTimeSpan.innerText = `00:00`;
  const seconds = Math.floor(videoElem.duration % 60);
  const minutes = Math.floor(videoElem.duration / 60);
  const hours = Math.floor(videoElem.duration / 3600);
  const time = { seconds, minutes, hours };
  updateTime(time, entireTimeSpan);
});

videoElem.addEventListener("timeupdate", () => {
  const seconds = Math.floor(videoElem.currentTime % 60);
  const minutes = Math.floor(videoElem.currentTime / 60);
  const hours = Math.floor(videoElem.currentTime / 3600);
  const time = { seconds, minutes, hours };
  updateTime(time, currentTimeSpan);
});

expandIcon.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    videoPlayerDOM.requestFullscreen();
    expandIcon.classList.remove("fa-expand");
    expandIcon.classList.add("fa-compress");
    videoElem.classList.add("video-expand");
    videoPlayerDOM.classList.add("videoPlayer-expand");
    videoPlayerInteractiveDOM.classList.add("videoPlayer-interactive-expand");
  } else {
    document.exitFullscreen();
    expandIcon.classList.remove("fa-compress");
    expandIcon.classList.add("fa-expand");
    videoElem.classList.remove("video-expand");
    videoPlayerDOM.classList.remove("videoPlayer-expand");
    videoPlayerInteractiveDOM.classList.remove(
      "videoPlayer-interactive-expand"
    );
  }
});

const updateTime = (time, timeDOM) => {
  const { hours, minutes, seconds } = time;
  timeDOM.innerText = `${hours ? `${hours >= 10 ? hours : `0${hours}`}:` : ""}${
    minutes ? `${minutes >= 10 ? minutes : `0${minutes}`}:` : "00:"
  }${seconds ? `${seconds >= 10 ? seconds : `0${seconds}`}` : "00"}`;
};

let moveTimeout;
let leaveTimeout;
const handleVideoPlayerInteractiveDOM = () => {
  if (moveTimeout) {
    clearTimeout(moveTimeout);
    moveTimeout = null;
  }
  videoPlayerInteractiveDOM.style.display = "grid";
  moveTimeout = setTimeout(() => {
    videoPlayerInteractiveDOM.style.display = "none";
  }, 2500);
};

videoPlayerDOM.addEventListener("mousemove", handleVideoPlayerInteractiveDOM);
