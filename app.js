// Server SETUP

// Server SETUP

// MAIN
const track = document.getElementById("track");
const progress = document.getElementById("progress");
const thumb = document.getElementById("thumb");
const hiddenRange = document.getElementById("hiddenRange");

let isDragging = false; //is user dragging or not

function updateProgress(e) {
    const rect = track.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;

    let progressPercentage = (clickPosition / rect.width) * 100;

    if (progressPercentage > 100) progressPercentage = 100;

    if (progressPercentage < 0) progressPercentage = 0;

    track.style.setProperty("--progressPoint", `${progressPercentage}%`)
    hiddenRange.setAttribute("value", `${progressPercentage}%`);
};

//mouse dragging start
track.addEventListener("mousedown", (e) => {
    isDragging = true;
    updateProgress(e);
});

//Continue Dragging
track.addEventListener("mousemove", (e) => {
    if (isDragging) {
        updateProgress(e);
    }
});

//stop Dragging
track.addEventListener("mouseup", (e) => {
    isDragging = false;
});
// MAIN


let songId= "J1ejXBn3";
async function getSongById(songId) {
    const url = `https://saavn.dev/api/songs/${songId}`;
    const options = { method: 'GET' };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
};