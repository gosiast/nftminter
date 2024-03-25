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

//starton api will be useful when we want to connect to the blockchain
const starton = axios.create({
	baseURL: "https://api.starton.io/v3",
	headers: {
		"x-api-key": "sk_live_718900e9-5aa3-4efd-8c34-3be9f6414b03",
	},
});

//this has sth to do with multer, to upload the files

app.post("/upload", cors(), upload.single("file"), async (req, res) => {
	let data = new FormData();
	const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
	data.append("file", blob, { filename: req.file.originalname });

	//uploading the files on ipfs
	async function uploadImageOnIpfs() {
		const ipfsImg = await starton.post("/ipfs/file", data, {
			headers: {
				"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
			},
		});
		//this is useful to get the CID of the image
		return ipfsImg.data;
	}
	//uploading api metadata on ipfs
	//it will have or data of our nft
	//we have our img CID - unique identifier and we pass it to upload metadata
	async function uploadMetadataOnIpfs(imgCid) {
		const metadataJson = {
			name: `A Wonderful NFT`,
			description: `Probably the most awesome NFT ever created!`,
			image: `ipfs://ipfs/${imgCid}`,
		};

		// i make a request to the pfs
		const ipfsMetadata = await starton.post("/ipfs/json", {
			name: "My NFT metadata Json",
			content: metadataJson,
			isSync: true,
		});

		//this is useful to get the Metadata of the image
		return ipfsMetadata.data;
	}

	const ipfsImgData = await uploadImageOnIpfs();
	const ipfsMetadata = await uploadMetadataOnIpfs(ipfsImgData.cid);
	console.log(ipfsImgData, ipfsMetadata);

	//res means response
	res.status(201).json({
		cid: ipfsImgData.cid,
	});
});
//we need to listen to this
app.listen(port, () => {
	console.log("Server is running on port " + port);
});
