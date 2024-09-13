import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleError = (error) => console.log("❌DB error: ", error);
const handleOpen = () => console.log("✅Connected to DB");
const handleDisconnect = () => console.log("❌Disconnected from DB");

db.on("disconnect", handleDisconnect);
db.on("error", handleError);
db.once("open", handleOpen);
