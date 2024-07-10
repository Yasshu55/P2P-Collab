import mongoose, { Schema } from "mongoose";

export interface IUser extends mongoose.Document {
    username: string;
    email: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    username : {type : String, required : true},
    email : {type: String, required : true},
    password : {type : String, required : true}
})

const User  = mongoose.model<IUser>('User',UserSchema)
export default User