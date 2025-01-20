import mongoose from 'mongoose';

const connectDB = async () => {
  // db connection
  // const mongoUri = process.env.MONGO_URI;
  const mongoUri = process.env.MONGO_URI;

  // console.log("mongoUri", mongoUri);

  if (!mongoUri) {
    console.error("Missing MONGO_URI in environment variables.");
    process.exit(1); // Exit the process if the environment variable is not set
  }

  try {
    // Connecting to the database using the URI from the environment variable
    const conn = await mongoose.connect(mongoUri, { writeConcern: { w: "majority" } });
    console.log(`MongoDB Connected to: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1); // Optionally exit if connection fails
  }
};

export default connectDB;
