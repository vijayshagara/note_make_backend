import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv()

const dbName = 'notes_taking' 
const uri = `${process.env.MONGOURL}/${dbName}`; // replace with your MongoDB connection URI

mongoose.set('debug', true);

export async function connectDb() {
    try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB");
      // Your code here
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    }
}



