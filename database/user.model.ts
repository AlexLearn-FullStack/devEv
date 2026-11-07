import { Schema, model, models } from 'mongoose';
import type { Document } from "mongoose";


export interface IUser extends Document {
  clerkId: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}


const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: [true, "Clerk ID is required"],
      match: [/^user_[A-Za-z0-9]+$/, "Clerk ID must be a valid Clerk user ID"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => {
          const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
    displayName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ clerkId: 1 }, { unique: true });

const User = models.User || model<IUser>('User', UserSchema);
export default User;