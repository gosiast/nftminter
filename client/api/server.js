const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const upload = multer({
	limits: {
		fileSize: 1000000,
	},
});

//starton api will be useful when we want to connect to the blockchain
const starton = axios.create({
	baseURL: "https://api.starton.io/v3",
	headers: {
		"x-api-key": "sk_live_718900e9-5aa3-4efd-8c34-3be9f6414b03",
	},
});

//this has sth to do with multer, to upload the files

app.post("./upload", cors(), upload.single("file"), async (req, res) => {
	let data = FormData();
	const blob = new Blob([req.file.lbuffer], { type: req.file.mimetype });
	data.append("file", blob, { filename: req.file.originalname });
	data.append("isSync", "true");
});
