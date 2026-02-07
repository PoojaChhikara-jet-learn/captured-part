const video = document.getElementById("preview");
const capturedImg = document.getElementById("capturedPreview");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");

let stream = null;

captureBtn.addEventListener("click", async () => {
  // If camera not started -> start it
  if (!stream) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });

      video.srcObject = stream;

      // Wait until the video has real width/height
      video.addEventListener("loadedmetadata", () => {
        video.play();

        // OPTIONAL: auto-capture once camera starts
        // captureFrame();
      }, { once: true });

    } catch (err) {
      console.error(err);
      alert("Camera permission denied or camera not available.");
    }
    return;
  }

  // If camera already started -> capture frame
  captureFrame();
});

function captureFrame() {
  if (!video.videoWidth || !video.videoHeight) {
    alert("Camera is still loading. Click again in 1 second.");
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL("image/png");

  // ✅ Force render in page
  capturedImg.src = dataUrl;
  capturedImg.style.display = "block";

  console.log("Captured image base64:", dataUrl.slice(0, 50) + "...");
}
