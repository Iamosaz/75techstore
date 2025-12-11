import mongoose from "mongoose";

// Define the schema (my document structure)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    email: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      enum: ['admin','vendor','customer'],
      default: 'customer'
    }
  },
  {
     timestamps: true  // adding createdAT and updateAt automatically
  }
);

// Compile the model (our usable object for interacting with MongoDB)
export const User = mongoose.model('User', userSchema);