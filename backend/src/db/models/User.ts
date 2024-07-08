import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
}

const UserSchema = new mongoose.Schema({
    username : {type : String, required : true},
    email : {type: String, required : true},
    password : {type : String, required : true}
})

const User  = mongoose.model<IUser>('User',UserSchema)
export default User