import mongoose from 'mongoose'


function runDb(){
    const uri = process.env.MONGO_URL || "";
    // console.log(uri);    
    mongoose.connect(uri)

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
    console.log('Connected to MongoDB');
    });

    db.on('disconnected', () => {
        console.log('Disconnected from MongoDB');
    });
}

export default runDb