import axios from "axios";

export default async function handler(req, res) {
    const { q, id } = req.query; // Extract query parameters: q for name, id for song ID

    // Determine the URL based on the parameters
    let url = "";
    if (q) {
        // Search by name
        url = `https://www.jiosaavn.com/api.php?p=1&q=${encodeURIComponent(q)}&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=20&__call=search.getResults`;
    } else if (id) {
        // Fetch song by ID
        url = `https://www.jiosaavn.com/api.php?__call=song.getDetails&pids=${encodeURIComponent(id)}&_format=json&_marker=0&ctx=web6dot0`;
    } else {
        return res.status(400).json({ error: "Either 'q' or 'id' parameter is required." });
    }

    // Required headers for JioSaavn API
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Referer": "https://www.jiosaavn.com/",
    };

    try {
        const response = await axios.get(url, { headers });
        res.status(200).json(response.data); // Send the API response to the frontend
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: "Failed to fetch data from JioSaavn API." });
    }
}
