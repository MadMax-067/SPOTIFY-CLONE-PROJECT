const axios = require('axios');

// Function to fetch song details
const fetchSongDetails = async (songId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/song/${songId}`);
    console.log('Song details:', response.data);
    // Log the media URL to see if it's valid
    console.log('Media URL:', response.data[0].downloadUrl);
  } catch (error) {
    console.error('Error fetching song:', error);
  }
};

// Test the song ID
const songId = '3IoDK8qI';  // Replace with a valid song ID from Saavn
fetchSongDetails(songId);
