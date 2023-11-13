import mongoose from "mongoose";

export interface UserInput {
  name: string;
  email: string;
  password: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  groups: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  deleteAt?: Date;
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }], // Referencia a grupos
  },
  { timestamps: true, collection: "users" }
);

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
