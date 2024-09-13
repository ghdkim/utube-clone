const startBtn = document.getElementById("startBtn");
const videoMe = document.getElementById("videoMe");
const reRecordBtn = document.getElementById("reRecordBtn");
const video = document.getElementById("preview");
const captureBtn = document.getElementById("captureBtn");

let stream;
let recorder;
let videoFile;

const files = {
  thumb: "thumbnail.jpg",
  output: "MyRecording.mp4",
};

// Handle file download
const handleDownload = async () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = files.output;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Stop recording and prepare download
const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

// Start recording the video
const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  // Initialize the media recorder with the stream
  recorder = new MediaRecorder(stream, { mimeType: "video/mp4" });

  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };

  recorder.start();
};

// Re-record video: Reset to video preview mode
const handleReRecord = () => {
  videoFile = null;
  video.srcObject = stream;
  video.play();

  // Reset buttons to the initial state
  startBtn.innerText = "Start Recording";
  startBtn.removeEventListener("click", handleDownload);
  startBtn.addEventListener("click", handleStart);
};

// Toggle the video preview on and off
const toggleVideoPreview = async () => {
  if (videoMe.innerText === "Start Video Preview") {
    try {
      // Access the user's media devices (camera and microphone)
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 1024,
          height: 576,
        },
      });

      video.srcObject = stream;
      video.play();

      // Enable the Start and Re-record buttons after preview starts
      startBtn.disabled = false;
      reRecordBtn.disabled = false;
      captureBtn.disabled = false;
      videoMe.innerText = "End Video Preview";
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert(
        "Could not access your camera and microphone. Please check permissions."
      );
    }
  } else {
    // Stop video stream and remove the preview
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    video.srcObject = null;

    // Disable buttons and reset text
    startBtn.disabled = true;
    reRecordBtn.disabled = true;
    captureBtn.disabled = true;
    videoMe.innerText = "Start Video Preview";
  }
};

// Capture a single frame at the 1-second timestamp
const captureFrame = () => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext("2d");

  // Set the video current time to 1 second and capture the frame
  video.currentTime = 1;

  // Ensure this only happens once by capturing the frame and removing the listener
  const onSeeked = () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to an image and download it
    const image = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = image;
    link.download = files.thumb;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    video.removeEventListener("seeked", onSeeked);
  };

  video.addEventListener("seeked", onSeeked);
};

// Event listeners
videoMe.addEventListener("click", toggleVideoPreview);
startBtn.addEventListener("click", handleStart);
reRecordBtn.addEventListener("click", handleReRecord);
if (captureBtn) {
  captureBtn.addEventListener("click", captureFrame);
}
