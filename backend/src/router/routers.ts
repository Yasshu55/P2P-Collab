import { Router } from 'express';
import { Request, Response } from 'express';
import User from '../db/models/User';
import Room from '../db/models/Room';
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { authMiddleware, generateToken } from '../utils/AuthMiddleware';

const router = Router();

router.post('/sign-up', async (req: Request,res: Response) => {
    try {
        const {username,email,password} = req.body
        console.log(username, " ",email, " ", password);

        const userExists = await User.findOne({email:email})
        if(userExists){
           return res.status(400).json({message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username:username,
            email:email,
            password:hashedPassword
        })
        await user.save()

        console.log("Signed up successfully!");
        
        return res.status(200).json({message: "User created successfully" })
    } catch (error) {
        console.log(error);
    }
})

router.post('/sign-in', async (req: Request,res: Response) => {
    try {
        const {email,password} = req.body
        console.log(email, " ", password);

        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            res.status(400).json({message: "Password is incorrect" })
        }

        console.log("Signed in successfully!");

        const token = await generateToken(user)

        return res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
        .status(200)
        .json({ message: "User authenticated successfully", user });

    } catch (error) {
        console.log(error);
    }
})

// Here put a authMiddleware to verify the user
router.post('/create-room',authMiddleware, async (req: Request,res: Response) => {
    try {
        const {roomId} = req.body
        console.log("Create Room api - Room ID : "+roomId);
        
        const roomExists = await Room.findOne({roomId})
        if(roomExists){
            return res.status(400).json({message: "Room already exists" })
        }

        const newRoom = new Room({roomId,users:[]})
        await newRoom.save()
        console.log("Room created successfully!");

        return res.status(200).json({ message: "Room created successfully" });
    
    } catch (error) {
        console.log(error);      
    }
})

router.post('/join-room',authMiddleware, async (req: any,res: Response) => {
    try {
        const {roomId} = req.body
        const userId = req.user?.id
        console.log("Join room api - RoomId : "+roomId+" UserID : "+userId);
        

        const room = await Room.findOne({roomId})
        if(!room){
            return res.status(400).json({message: "Room does not exists" })
        }
        if (!room.users.includes(userId)) {
            room.users.push(userId)
            await room.save();
        }

        return res.status(200).json({ message: "User joined room successfully", roomId });
    } catch (error) {
        console.log(error);      
    }
})

export default router;
