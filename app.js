// MAIN
const track = document.getElementById("track");
const progress = document.getElementById("progress");
const thumb = document.getElementById("thumb");
const searchSongForm = document.getElementById("searchSong");
const searchSpotify = document.getElementById("searchSpotify");
const playingAudio = document.getElementById("playingAudio");
const mainViewContainer = document.getElementById("mainViewContainer");
const mainView = document.getElementById("mainView");
const searchView = document.getElementById("searchView");
const searchResultsHeading = document.getElementById("searchResultsHeading");
const homeButton = document.getElementById("homeButton");
const resultElementsBox = document.getElementById("resultElementsBox");
const nowPlayingImg = document.getElementById("nowPlayingImg");
const titleText = document.getElementById("titleText");
const artistText = document.getElementById("artistText");
const playPause = document.getElementById("playPause");
const playCircle = document.getElementById("playCircle");
const currentDurationBox = document.getElementById("currentDurationBox");
const maxDurationBox = document.getElementById("maxDurationBox");
const volumeInput = document.getElementById("volumeInput");
const volumeIconBox = document.getElementById("volumeIconBox");
const rightSideBarContainer = document.getElementById("rightSideBarContainer");
const topTitleBox = document.getElementById("topTitleBox");
const rightTitle = document.getElementById("rightTitle");
const rightFirstArtist = document.getElementById("rightFirstArtist");
const rightSecondArtist = document.getElementById("rightSecondArtist");
const sidebarClose = document.getElementById("closeBox");
const sidebarOpen = document.getElementById("sidebarOpen");
const libItemInBox = document.getElementById("libItemInBox");

// Color Thief
const colorThief = new ColorThief();
//gradient primary color opacity
const gradientOpacity = "0.23012955182072825";


let songName;
let songId;
let searchResults = [];
let songPlayUrl;

let isDragging = false; // To track dragging state
let progressPercentage;

let currentMinutes;
let currentSeconds;

// Decrypter
const mgkey = "38346591";
function decryptByDES(encryptedData, key) {
    const decrypted = CryptoJS.DES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(encryptedData) },
        CryptoJS.enc.Utf8.parse(key),
        { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// Update progress visually
playingAudio.ontimeupdate = () => {
    currentMinutes = Math.floor(playingAudio.currentTime / 60);
    currentSeconds = Math.floor(playingAudio.currentTime % 60);
    if (!isDragging) { // Avoid conflict during dragging

        progressPercentage = (playingAudio.currentTime / playingAudio.duration) * 100;
        track.style.setProperty("--progressPoint", `${progressPercentage}%`);
        currentDurationBox.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
    }
};

playingAudio.addEventListener("loadedmetadata", () => {
    let maxMinutes = Math.floor(playingAudio.duration / 60);
    let maxSeconds = Math.floor(playingAudio.duration % 60);
    maxDurationBox.textContent = `${maxMinutes}:${maxSeconds.toString().padStart(2, '0')}`;
});

// Function to calculate and update progress
function updateProgress(e) {
    //for current duration set on display
    currentMinutes = Math.floor(playingAudio.currentTime / 60);
    currentSeconds = Math.floor(playingAudio.currentTime % 60);

    //get click position
    const rect = track.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;

    progressPercentage = (clickPosition / rect.width) * 100;

    if (progressPercentage > 100) progressPercentage = 100;
    if (progressPercentage < 0) progressPercentage = 0;

    track.style.setProperty("--progressPoint", `${progressPercentage}%`);
    playingAudio.currentTime = (progressPercentage / 100) * playingAudio.duration; // Convert to time
    currentDurationBox.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
}

// Start dragging
track.addEventListener("mousedown", (e) => {
    isDragging = true;
    updateProgress(e);
});

// Continue dragging
track.addEventListener("mousemove", (e) => {
    if (isDragging) {
        updateProgress(e);
    }
});

// Stop dragging
document.addEventListener("mouseup", () => {
    isDragging = false;
});

// Allow clicks to update progress directly
track.addEventListener("click", (e) => {
    updateProgress(e);
});


//stop Dragging
track.addEventListener("mouseup", (e) => {
    isDragging = false;
});

// change to Search view
searchSpotify.addEventListener("click", () => {
    mainView.style.display = "none";
    searchView.style.display = "block";
});

// change to main View
homeButton.addEventListener("click", () => {
    searchView.style.display = "none";
    mainView.style.display = "flex";
});


// search listner

searchSongForm.addEventListener("submit", (e) => {
    e.preventDefault();
    songName = searchSpotify.value;
    getSongsByName(songName);
});


// MAIN

// creating array to store created result elements
let createdResultElements = []; //array to store created result elements


function displaySearchResult() {
    // remove previous search results
    if (resultElementsBox.hasChildNodes()) {
        resultElementsBox.innerHTML = "";
        createdResultElements = [];
    }

    searchResultsHeading.textContent = "Search Results";

    // create each result Box
    searchResults.forEach((song, index) => {
        // play pause icon svg
        playSVG = '<svg id="playIcon" role="img" aria-hidden="true" class="" viewBox="0 0 24 24"><path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05 - .606z"></path></svg>'
        pauseSVG = '<svg id="playIcon" role="img" aria-hidden="true" viewBox="0 0 16 16"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>';

        let resultElement = document.createElement("div");
        resultElement.id = `resultElement${index}`; //set id to each result box
        resultElement.classList.add("resultElements"); //give class to result box
        resultElementsBox.appendChild(resultElement); // append it to main result Container

        //making box for album cover for each result
        let resultIconBox = document.createElement("div"); // creating album box
        resultIconBox.id = `resultIconBox${index}`;  //setting id
        resultIconBox.classList.add("resultIconBox"); // class add for styling
        resultElement.appendChild(resultIconBox); // adding album box to each result box

        let resultIcon = document.createElement("img"); //adding img to album box
        resultIcon.id = `resultIcon${index}`; // setting id
        resultIcon.classList.add("resultIcon"); // class for styling 
        resultIcon.src = song.image.replace(/150x150/, '500x500'); // getting album cover from api
        resultIconBox.appendChild(resultIcon); //appending image to album box

        let resultPlayIconBox = document.createElement("div");//creating div for storing play icon
        resultPlayIconBox.id = `resultPlayIconBox${index}`;//setting id
        resultPlayIconBox.classList.add("resultPlayIconBox");//class for styling
        //adding play icon svg to the box
        resultPlayIconBox.innerHTML = playSVG;
        resultIconBox.appendChild(resultPlayIconBox); //appending to Icon Box

        let songDetailsBox = document.createElement("div");// creating box for song title and artist
        songDetailsBox.id = `songDetailsBox${index}`; //setting id
        songDetailsBox.classList.add("songDetailsBox"); //class for styling
        resultElement.appendChild(songDetailsBox); //appending to each result Box

        let songTitle = document.createElement("div");//creating a box for song title
        songTitle.textContent = song.title; //getting title from api
        songTitle.id = `songTitle${index}`; //setting id
        songTitle.classList.add("songTitle");//class for styling
        songDetailsBox.appendChild(songTitle); // appending title to detail box

        let artistName = document.createElement("div");// creating a box for artist name
        artistName.textContent = song.subtitle; //getting artist name from api
        artistName.id = `artistName${index}`;//setting id
        artistName.classList.add("artistName");//class for styling
        songDetailsBox.appendChild(artistName);//appending artist name to song details

        resultElement.addEventListener("click", () => {
            //change to pause icon
            songId = song.id;//setting song id to clicked song
            let currentSong;

            getSongById(songId).then(song => {
                currentSong = song;
                updateRightSideBar(song);
                //play song
                playSong(currentSong);
            });//calling song id function to play clicked song

            //changes to right side bar

        });

        createdResultElements.push(resultElement);//pushing each result element to array to save them
    });
};

function updateRightSideBar(song) {
    //changes to right side bar
    rightSideBarContainer.style.display = "block"; //setting it visible
    rightSideBarContainer.style.backgroundImage = `url("${song.image.replace(/150x150/, '500x500')}")`; // setting bg image to right side container
    topTitleBox.textContent = song.song;
    rightTitle.textContent = song.song;
    rightFirstArtist.textContent = song.primary_artists;
    rightSecondArtist.textContent = song.featured_artists;
    // if (song.more_info.artistMap.featured_artists.length > 0) {
    // }else {
    //     rightSecondArtist.textContent = song.more_info.artistMap.artists[1].name;
    // }
};

// Right SideBar Close
sidebarClose.addEventListener("click", () => {
    rightSideBarContainer.style.display = "none";
});

//Right SideBar Open
sidebarOpen.addEventListener("click", () => {
    rightSideBarContainer.style.display = "block";
})

async function getSongsByName(songName) {
    const fullURL = `https://spotify-clone-api-theta.vercel.app/api/search?q=${encodeURIComponent(songName)}`;

    try {
        const response = await fetch(fullURL, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Clean up preambles if present

        searchResults = data.results;

        if (searchResults.length === 0) {
            searchResultsHeading.textContent = "No results found. 😕";
            //empty results
            resultElementsBox.innerHTML = '';
        } else {
            // Display results
            displaySearchResult(searchResults);
        }
    } catch (error) {
        console.error("Error fetching songs:", error);
        searchResultsHeading.textContent = "Something seems wrong! 😣";
    }
}
// get by song id
async function getSongById(songId) {
    const fullURL = `https://spotify-clone-api-theta.vercel.app/api/search?id=${encodeURIComponent(songId)}`;

    try {
        const response = await fetch(fullURL, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const song = await data.songs[0];

        return song;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// play pause function
playPause.addEventListener("click", () => {
    //if audio is playing
    if (!playingAudio.paused) {
        //change to play icon
        playCircle.innerHTML = '<svg id="playIcon" role="img" aria-hidden="true" viewBox="0 0 16 16" class="playIcon"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>';
        playingAudio.pause();
    }
    else {
        //change to pause icon
        playCircle.innerHTML = '<svg id="playIcon" role="img" aria-hidden="true" viewBox="0 0 16 16" class="playIcon"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>';
        playingAudio.play();
    }
});


//volume control
volumeInput.addEventListener("input", () => {
    playingAudio.volume = volumeInput.value;
});

//mute unmute
volumeIconBox.addEventListener("click", () => {
    //when volume is not 0
    if (playingAudio.volume > 0 && volumeInput.value > 0) {
        playingAudio.volume = 0;
        volumeInput.value = 0;
        //mute icon
        volumeIconBox.innerHTML = '<svg id="volumeIcon" role="presentation" aria-label="Volume off" aria-hidden="false" viewBox="0 0 16 16" class="volumeIcon playerIcons"><path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path><path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path></svg>';
    }
    else {
        playingAudio.volume = 1;
        volumeInput.value = 1;
        //volume full icon
        volumeIconBox.innerHTML = '<svg role="presentation" aria-label="Volume high" aria-hidden="false" id="volumeIcon" viewBox="0 0 16 16" class="volumeIcon playerIcons"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path><path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path></svg>';
    }
});



// Home Page Cards
const songIdForCards = ["Paem2Kf1", "Dcn2JX4y", "6_Lkkdb-", "8KR1cpr8", "n3D96OBP", "sPjn5Gs1", "fW-Mxsnu", "mS0LY7W1", "bj63WBUs", "8Ti1DvzG", "Yh4u0ibF", "VToGp42K", "O22XNaZG", "StDihZvc", "oXXeN4Gv", "TtuJLWrj", "H-56B2xz", "uNWdki50", "I7GH9AB-", "VaNhRJHr", "ZY-m2M7V", "_J5iTI6U", "nsMAIFmD", "lvyoa4FM", "WTXoYqCF", "fad7sATd", "J-G9voQa", "dju4Cubp", "JuFEzYZR", "fbLZdM0I", "bEsdIBIp", "iE8z2T-c", "XaFAVKX2", "PX3J3pID", "q-F_jCoF", "ieScOYmG", "X031nLVY", "e9jds2zC", "LKzeL12B", "WGc8ueF_"];
const homeCards = document.querySelectorAll(".shelfCard");

async function setCardsData(card, songId) {
    let currentSong;
    getSongById(songId).then(song => {
        currentSong = song;
        //cover
        card.children[0].style.backgroundImage = `url('${currentSong.image.replace(/150x150/, '500x500')}')`;
        // text
        //song name
        card.children[1].children[0].textContent = currentSong.song;
        //artist
        card.children[1].children[1].textContent = currentSong.primary_artists;
        card.addEventListener("click", () => {
            // card.children[0].style.backgroundImage(`url('currentSong.image')`);
            updateRightSideBar(currentSong);
            playSong(currentSong);
        });
    }
    );

};

function playSong(currentSong) {
    const encryptedUrl = currentSong.encrypted_media_url;
    songPlayUrl = decryptByDES(encryptedUrl, mgkey);
    playingAudio.setAttribute("src", songPlayUrl);
    nowPlayingImg.src = currentSong.image.replace(/150x150/, '500x500');//changing now playing song icon to clicked song
    titleText.textContent = currentSong.song;//changing now playing song title to clicked song
    artistText.textContent = currentSong.primary_artists;//changing now playing song artist to clicked song
    //change to pause icon
    playCircle.innerHTML = '<svg id="playIcon" role="img" aria-hidden="true" viewBox="0 0 16 16" class="playIcon"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>';
    playingAudio.play();
};



//go through each cards on home
homeCards.forEach((card, index) => {
    //set html attribute for each card with a song id
    card.setAttribute("dataSongId", songIdForCards[index]);
    setCardsData(card, songIdForCards[index]);
});

const playlistImageTest = document.querySelectorAll(".uPlaylistImg");
let dominantColor;
const uPlaylistBox = document.querySelectorAll(".uPlaylistBox");
const songIdForPlaylist = ['e9kcJMvh', 'LKgPiSpG'];


uPlaylistBox.forEach((box, index) => {
    let currentSong;
    getSongById(songIdForPlaylist[index]).then(data => {
        currentSong = data;
    }).then(() => {
        const img = box.children[0];
        img.src = currentSong.image.replace(/150x150/, '500x500');
        box.children[1].textContent = currentSong.song;

        box.addEventListener("click", () => {
            updateRightSideBar(currentSong);
            playSong(currentSong);
        });

        img.onload = () => {
            dominantColor = colorThief.getColor(img);
            const rgbColor = `rgba(${dominantColor.join(",")},${gradientOpacity})`;
            box.addEventListener("mouseenter", () => {
                mainViewContainer.style.setProperty("--startColor", rgbColor);
            });
        };
    });
});


// side library
const songIdForLib = songIdForCards;
songIdForLib.forEach((song, index) => {
    let currentSong;
    //creating element for library
    const libItem = document.createElement('div');
    const libItemImg = document.createElement('img');

    //setting id and class for styling
    libItem.id = `libItem${index}`;
    libItem.classList.add('libItem');
    
    //setting id and class for styling
    libItemImg.id = `libItemImg${index}`;
    libItemImg.classList.add('libItemImg');

    //appending to library box
    libItem.appendChild(libItemImg);
    libItemInBox.appendChild(libItem);

    getSongById(song).then(data => {
        currentSong = data;
    }).then(() => {
        libItemImg.src = currentSong.image.replace(/150x150/, '500x500');

        libItem.addEventListener("click", () => {
            updateRightSideBar(currentSong);
            playSong(currentSong);
        })
    });
});