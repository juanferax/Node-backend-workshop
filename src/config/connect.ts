import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectionString =
  process.env.MONGO_URI ||
  "mongodb+srv://juanferas25:rFTaQrg4RHmPVMHg@cluster0.iz7m71g.mongodb.net/";

export const db = mongoose
  .connect(connectionString)
  .then((res) => {
    console.log("Connected to MongoDb");
  })
  .catch((err) => {
    console.log(err);
  });
