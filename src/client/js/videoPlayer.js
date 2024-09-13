const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (e) => {
  video.muted = !video.muted;

  if (video.muted) {
    muteBtnIcon.classList = "fas fa-volume-mute";
    volumeRange.value = 0;
  } else {
    volumeRange.value = volumeValue;

    if (video.volume > 0 && video.volume <= 0.33) {
      muteBtnIcon.classList = "fas fa-volume-off";
    } else if (video.volume > 0.33 && video.volume <= 0.66) {
      muteBtnIcon.classList = "fas fa-volume-down";
    } else if (video.volume > 0.66) {
      muteBtnIcon.classList = "fas fa-volume-up";
    }
  }
};

const handleVolumeChange = (e) => {
  const {
    target: { value },
  } = e;

  volumeValue = value;
  video.volume = volumeValue;

  if (video.volume === 0) {
    muteBtnIcon.classList = "fas fa-volume-mute";
  } else if (video.volume > 0 && video.volume <= 0.33) {
    muteBtnIcon.classList = "fas fa-volume-off";
  } else if (video.volume > 0.33 && video.volume <= 0.66) {
    muteBtnIcon.classList = "fas fa-volume-down";
  } else if (video.volume > 0.66) {
    muteBtnIcon.classList = "fas fa-volume-up";
  }
};

const formatTime = (seconds) => {
  if (seconds >= 3600) {
    return new Date(seconds * 1000).toISOString().substring(11, 19);
  }
  return new Date(seconds * 1000).toISOString().substring(14, 19);
};

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (e) => {
  const {
    target: { value },
  } = e;
  video.currentTime = value;
};

const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = (e) => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 2000);
};

const handleMouseLeave = (e) => {
  controlsTimeout = setTimeout(hideControls, 2000);
};

// const handleKeydown = (e) => {
//   if (e.code === "Space") {
//     handlePlayClick();
//     e.preventDefault();
//   }
// };

const handleVideoClickPlay = (e) => {
  handlePlayClick();
};

const handleMuteKeyUp = (e) => {
  if (e.key === "m") {
    handleMuteClick();
    e.preventDefault();
  }
};

const handleFullscreenKeyUp = (e) => {
  if (e.key === "f") {
    handleFullScreen();
    e.preventDefault();
  }
};

const handleEnded = async () => {
  const { id } = videoContainer.dataset;
  await fetch(`/api/videos/${id}/view`, { method: "POST" });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
// document.addEventListener("keydown", handleKeydown);
video.addEventListener("click", handleVideoClickPlay);
document.addEventListener("keyup", handleMuteKeyUp);
document.addEventListener("keyup", handleFullscreenKeyUp);
