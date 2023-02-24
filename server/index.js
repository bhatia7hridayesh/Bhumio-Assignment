import express from "express";
import cors from "cors";
import { result, fileCreate, verifyFileName, downloadFile, viewFile, mergeFile, sendFileToMail, getAllFilePaths } from "./controllers.js";
import mongoose from "mongoose";


const app = express();
app.use(express.json());
//Route for search
app.use(cors());
app.get("/", result);
app.get("/check-file-name", verifyFileName);
app.post("/create-pdf", fileCreate);
app.get("/get-files", getAllFilePaths);
app.get("/download-file", downloadFile);
app.get("/view-file", viewFile);
app.post("/merge-files", mergeFile);
app.post("/send-mail", sendFileToMail);
const PORT = 5000 || 8000;


mongoose.connect("mongodb://localhost:27017/Bhumio",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
app.listen(PORT, () => console.log(`Server running on port ${PORT} `));
}).catch((error) => console.log(`${error} did not connect`));