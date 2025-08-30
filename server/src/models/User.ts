import mongoose, { Schema, model } from "mongoose";

export interface InterfaceUser {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  password: string;
  salt: string;
  created_at?: Date;
}

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },

    salt: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },

});

export const User = model("User", userSchema);
