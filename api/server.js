const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

const upload = multer({
	limits: {
		fileSize: 1000000,
	},
});

// Starton API configuration
const starton = axios.create({
	baseURL: "https://api.starton.io/v3",
	headers: {
		"x-api-key": "sk_live_718900e9-5aa3-4efd-8c34-3be9f6414b03",
	},
});

// Specify allowed origins for CORS
const allowedOrigins = ["http://example1.com", "http://example2.com"];

// File upload route with CORS middleware
app.post(
	"/upload",
	cors({ origin: allowedOrigins }),
	upload.single("file"),
	async (req, res) => {
		// File upload logic...
	}
);

// Server listening
app.listen(port, () => {
	console.log("Server is running on port " + port);
});
