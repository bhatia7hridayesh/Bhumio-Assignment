import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
    {
        
        filePath: {
            type: String,
            default: "",
        }
    }, {timestamps: true});

const Files = mongoose.model("Files", FileSchema);
export default Files;