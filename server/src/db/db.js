import mongoose from 'mongoose';

const connectDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODBURI}`);

        console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
    }
    catch(err){
        console.log(`MongoDB Connection Failed:${err}`);
        process.exit(1);
    }
}

export default connectDB;