import { useState } from "react";

const FileUpload = () => {
	const [file, setFile] = useState(null);
	const [cid, setCid] = useState("");
	const [transaction, setTransaction] = useState("");
	//it will handle the submition of the file
	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			if (file) {
				const formData = new FormData();
				formData.append("file", file);
				const response = await fetch("http://localhost:4000/upload", {
					method: "POST",
					body: formData,
				})
					.then((response) => response.json())
					.then((data) => {
						setCid(data.cid);
						setTransaction(data.transactionHash);
						console.log(data.cid);
						console.log(data.transactionHash);
					})
					.catch((error) => {
						console.error(error);
					});
			}
		} catch (error) {
			alert(error);
		}
	};

	const retrieveFile = (event) => {
		try {
			const data = event.target.files[0]; //functionality of single file upload, index 0
			setFile(data);
			event.preventDefault();
		} catch (error) {
			alert("Retrieve File Does not work");
		}
	};
	return (
		<>
			<div className="img-ctr">
				{cid && (
					<a href={`https://${cid}.ipfs.dweb.link`}>
						<img src={`https://${cid}.ipfs.dweb.link`} height={"250px"} />
					</a>
				)}
			</div>
			<div className="transaction">
				{transaction && (
					<a href={`https://mumbai.polygonscan.com/tx/${transaction}`}>
						Transaction Detials
					</a>
				)}
			</div>
			<div className="form">
				<form onSubmit={handleSubmit}>
					<input type="file" className="choose" onChange={retrieveFile} />
					<button className="btn">NFt Minter</button>
				</form>
			</div>
		</>
	);
};

export default FileUpload;
