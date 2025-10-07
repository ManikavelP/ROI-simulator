// /types/mongoose.d.ts

// Import the Mongoose type
import { Mongoose } from "mongoose";

declare global {
  var mongoose: {
    // Use the Mongoose type
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

export {};
