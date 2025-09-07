import mongoose from "mongoose";

const connectDB = async () => {
  console.log('MONGODB_URI:', process.env.MONGODBURI);

  if (!process.env.MONGODBURI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('💡 Please create a .env file in the server directory with:');
    console.log('MONGODB_URI=mongodb+srv://testUser1:Qw-CsdCT_-789@cluster0.0twofax.mongodb.net/quizcraft?retryWrites=true&w=majority&appName=Cluster0');
    process.exit(1);
  }

  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODBURI
    );

    console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (err) {
    console.log(`MongoDB Connection Failed:${err}`);
    process.exit(1);
  }
};

export default connectDB;
