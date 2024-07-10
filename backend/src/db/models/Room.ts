import mongoose, {Model, Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

interface IRoom extends Document {
    roomId: string;
    users: ObjectId[];
}

const RoomSchema: Schema = new Schema({
    roomId: { type: String, required: true, unique: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }]
});

const Room: Model<IRoom> = mongoose.model<IRoom>('Room',RoomSchema)

export default Room